import axios from "axios";
import type { AxiosError, Method } from "axios";
import { Toast } from "antd-mobile";
import { CODE_SUCCESS } from "@/constants";
import { useUserStore } from "@/stores/useUserStore";
import { router } from "@/router";

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
 * 请求拦截器：携带 token
 */
instance.interceptors.request.use(
  (config) => {
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
 * 响应拦截器：统一处理业务失败、401
 */
instance.interceptors.response.use(
  (res) => {
    const data = res.data as Data<unknown>;
    // 业务失败：提示并返回 rejected promise（携带完整响应体，catch 时可用）
    if (data.code !== CODE_SUCCESS) {
      Toast.show({ content: data.message || "业务失败" });
      return Promise.reject(data);
    }
    // 成功：返回 { code, message, data }，业务层取 .data
    return res.data;
  },
  (err: AxiosError) => {
    // 401：清除本地用户信息，跳转登录页并携带来源地址
    if (err.response?.status === 401) {
      useUserStore.getState().delUser();
      const { pathname, search } = router.state.location;
      const redirect = encodeURIComponent(pathname + search);
      router.navigate(`/login?redirect=${redirect}`, { replace: true });
    }
    return Promise.reject(err);
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
 * 便捷方法：GET
 */
export const get = <T>(url: string, params?: object) => request<T>(url, "get", params);

/**
 * 便捷方法：POST
 */
export const post = <T>(url: string, data?: object) => request<T>(url, "post", data);

/**
 * 便捷方法：PUT
 */
export const put = <T>(url: string, data?: object) => request<T>(url, "put", data);

/**
 * 便捷方法：DELETE
 */
export const del = <T>(url: string, data?: object) => request<T>(url, "delete", data);

/**
 * 便捷方法：PATCH
 */
export const patch = <T>(url: string, data?: object) => request<T>(url, "patch", data);
