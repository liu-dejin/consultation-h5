import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig, Method } from "axios";
import { Toast } from "antd-mobile";
import { useUserStore } from "@/stores/useUserStore";
import { router } from "@/router";
import type { LoginRes } from "@/types/auth";

/** 可重试的请求配置：_retry 防循环，__isRefresh 标记刷新请求自身 */
type RetryableConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  __isRefresh?: boolean;
};

/**
 * 接口基础地址（可通过环境变量 VITE_API_BASE_URL 配置）
 */
export const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

/**
 * Axios 实例
 */
export const instance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * 请求拦截器：携带 token（刷新请求自身走 body，不带旧 Bearer）
 */
instance.interceptors.request.use(
  (config) => {
    if ((config as RetryableConfig).__isRefresh) return config;
    // 拦截器在 React 渲染外执行，用 getState() 取最新状态
    const { user } = useUserStore.getState();
    if (user?.token && config.headers) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (err) => Promise.reject(err),
);

/**
 * 401 自动续期（单飞 + 排队重试）：
 * - access token 过期 / 被顶掉 → 后端回 HTTP 401，前端用 refreshToken 换一次新双 token 后重放原请求
 * - 刷新接口自身失败 → 可能是 HTTP 200 + 业务码 401（成功拦截器已 reject，Toast 已弹）
 *   也可能是 HTTP 401（service 层 401 已映射为 HTTP 状态，见下方 __isRefresh 分支补 Toast），两种都直接清本地跳登录
 * - 刷新必须在本文件里直接调 instance.post，不能挪到 api/common：那边依赖 @/utils（就是本文件），
 *   反过来引用会形成 request → api/common → utils → request 的循环依赖
 */
let refreshPromise: Promise<LoginRes> | null = null;

const logoutAndRedirect = () => {
  useUserStore.getState().delUser();
  const { pathname, search } = router.state.location;
  const redirect = encodeURIComponent(pathname + search);
  router.navigate(`/login?redirect=${redirect}`, { replace: true });
};

const doRefresh = async (): Promise<LoginRes> => {
  const { user } = useUserStore.getState();
  // 成功拦截器已把 AxiosResponse 解包为 Data<T>，此处用 R = Data<LoginRes> 如实声明，
  // 避免 res as unknown 双重断言（之前是类型谎言：post 默认回 AxiosResponse，运行时却是 Data）。
  const res = await instance.post<LoginRes, Data<LoginRes>>(
    "/common/auth/token/refresh",
    { refreshToken: user?.refreshToken },
    { __isRefresh: true } as unknown as InternalAxiosRequestConfig,
  );
  const loginRes = res.data;
  const cur = useUserStore.getState().user;
  if (cur) {
    useUserStore
      .getState()
      .setUser({ ...cur, token: loginRes.token, refreshToken: loginRes.refreshToken });
  }
  return loginRes;
};

/**
 * 响应拦截器：统一处理业务失败、401
 */
instance.interceptors.response.use(
  (res) => {
    const data = res.data as Data<unknown>;
    // 业务失败：提示并返回 rejected promise（携带完整响应体，catch 时可用）
    if (data.code !== 10000) {
      Toast.show({ content: data.message || "业务失败" });
      return Promise.reject(data);
    }
    // 成功：返回 { code, message, data }，业务层取 .data
    return res.data;
  },
  async (err: AxiosError) => {
    // 非 401 直接透出；刷新请求自身失败走业务码分支，这里只处理 HTTP 401
    if (err.response?.status !== 401) return Promise.reject(err);
    const original = err.config as RetryableConfig | undefined;
    if (!original || original.__isRefresh) {
      // 刷新请求自身拿 HTTP 401（如 service 层 401 已映射为 HTTP 状态）：
      // 成功拦截器没机会弹 Toast，这里把后端 body 里的 message 补弹一个再跳登录
      if (original?.__isRefresh) {
        const msg = (err.response?.data as Data<unknown> | undefined)?.message;
        if (msg) Toast.show({ content: msg });
      }
      logoutAndRedirect();
      return Promise.reject(err);
    }
    // 已重放过一次还 401（新 token 也被顶/被禁），防循环，直接退出
    if (original._retry) {
      logoutAndRedirect();
      return Promise.reject(err);
    }
    const { user } = useUserStore.getState();
    if (!user?.refreshToken) {
      logoutAndRedirect();
      return Promise.reject(err);
    }
    // 单飞：并发 401 共用同一个刷新 promise
    if (!refreshPromise) {
      refreshPromise = doRefresh().finally(() => {
        refreshPromise = null;
      });
    }
    try {
      const loginRes = await refreshPromise;
      original._retry = true;
      if (original.headers) {
        original.headers.Authorization = `Bearer ${loginRes.token}`;
      }
      return instance(original);
    } catch (refreshErr) {
      // refresh 过期/失效/被轮换：doRefresh 已被成功拦截器 reject，直接退出（Toast 已由成功拦截器弹出）
      logoutAndRedirect();
      return Promise.reject(refreshErr);
    }
  },
);

/**
 * 通用响应结构
 */
export type Data<T> = {
  /** 业务状态码 */
  code: number;
  /** 提示信息 */
  message: string;
  /** 业务数据 */
  data: T;
};

/**
 * 通用请求方法
 * @param url 请求地址
 * @param method 请求方法，默认为 get
 * @param submitData 请求参数（get 为 params，其余为 data）
 * @returns Promise<Data<T>>
 */
export const request = <T>(url: string, method: Method = "get", submitData?: object) => {
  return instance.request<T, Data<T>>({
    url,
    method,
    [method.toLowerCase() === "get" ? "params" : "data"]: submitData,
  });
};

/**
 * 便捷方法：GET / POST / PUT / DELETE / PATCH
 * @param url 请求地址
 */
export const get = <T>(url: string, params?: object) => request<T>(url, "get", params);
export const post = <T>(url: string, data?: object) => request<T>(url, "post", data);
export const put = <T>(url: string, data?: object) => request<T>(url, "put", data);
export const del = <T>(url: string, data?: object) => request<T>(url, "delete", data);
export const patch = <T>(url: string, data?: object) => request<T>(url, "patch", data);
