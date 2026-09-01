import type { LoginReq, LoginRes } from "@/types/common";
import { post } from "@/utils";

// 密码登录
export const LoginByPasswordApi = (data: LoginReq) => {
  return post<LoginRes>("/login/password", data);
};
// 验证码登录
export const LoginByCodeApi = (data: LoginReq) => {
  return post<LoginRes>("/login", data);
};
