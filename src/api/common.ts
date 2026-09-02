import type {
  ForgotPasswordReq,
  LoginReq,
  LoginRes,
  RegisterByEmailReq,
  SendEmailCodeReq,
} from "@/types/common";
import { post } from "@/utils";

// 邮箱密码登录
export const LoginByPasswordApi = (data: LoginReq) => {
  return post<LoginRes>("/login/password", data);
};
// 邮箱验证码登录
export const LoginByCodeApi = (data: LoginReq) => {
  return post<LoginRes>("/login", data);
};
// 发送注册验证码（企业邮，不限域）
export const SendRegisterCodeApi = (data: SendEmailCodeReq) => {
  return post<void>("/user/captcha/email", data);
};
// 发送登录验证码
export const SendLoginCodeApi = (data: SendEmailCodeReq) => {
  return post<void>("/user/captcha/login", data);
};
// 发送重置密码验证码
export const SendForgotCodeApi = (data: SendEmailCodeReq) => {
  return post<void>("/user/captcha/forgot", data);
};
// 兼容旧命名：Register 页仍可调用 SendEmailCodeApi
export const SendEmailCodeApi = SendRegisterCodeApi;
// 邮箱验证码注册
export const RegisterByEmailApi = (data: RegisterByEmailReq) => {
  return post<LoginRes>("/user/register", data);
};
// 邮箱验证码重置密码
export const ForgotPasswordApi = (data: ForgotPasswordReq) => {
  return post<void>("/user/forgot-password", data);
};
