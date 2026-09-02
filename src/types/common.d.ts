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

export type SendEmailCodeReq = {
  email: string;
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
