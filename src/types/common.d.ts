export type LoginReq = {
  email: string;
  password?: string;
  code?: string;
};
export type LoginRes = {
  token: string;
  refreshToken: string;
  avatar: string;
  email: string;
  account: string;
  id: string;
};

// 验证码场景：register=注册 / login=登录 / forgot=重置密码
export type EmailCodeScene = "register" | "login" | "forgot";

// 发送验证码统一请求体
export type SendEmailCodeReq = {
  email: string;
  scene: EmailCodeScene;
};

export type RegisterByEmailReq = {
  email: string;
  code: string;
  password: string;
};

export type ForgotPasswordReq = {
  email: string;
  code: string;
  password: string;
};
