import type {
  EmailCodeScene,
  ForgotPasswordReq,
  LoginReq,
  LoginRes,
  RegisterByEmailReq,
} from "@/types/common";
import { post } from "@/utils";

// 邮箱密码登录 -> POST /sessions/password
export const LoginByPasswordApi = (data: LoginReq) => {
  return post<LoginRes>("/sessions/password", data);
};
// 邮箱验证码登录 -> POST /sessions/email-code
export const LoginByCodeApi = (data: LoginReq) => {
  return post<LoginRes>("/sessions/email-code", data);
};

/**
 * 发送邮箱验证码（统一入口）-> POST /verification-codes
 * @param scene register=注册 / login=登录 / forgot=重置密码
 */
export const SendEmailCodeApi = (scene: EmailCodeScene, data: { email: string }) => {
  return post<void>("/verification-codes", { ...data, scene });
};
// 发送注册验证码（兼容旧命名）
export const SendRegisterCodeApi = (data: { email: string }) => {
  return SendEmailCodeApi("register", data);
};
// 发送登录验证码
export const SendLoginCodeApi = (data: { email: string }) => {
  return SendEmailCodeApi("login", data);
};
// 发送重置密码验证码
export const SendForgotCodeApi = (data: { email: string }) => {
  return SendEmailCodeApi("forgot", data);
};
// 邮箱验证码注册 -> POST /users
export const RegisterByEmailApi = (data: RegisterByEmailReq) => {
  return post<LoginRes>("/users", data);
};
// 邮箱验证码重置密码 -> POST /password-resets
export const ForgotPasswordApi = (data: ForgotPasswordReq) => {
  return post<void>("/password-resets", data);
};
