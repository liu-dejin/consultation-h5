export type LoginReq = {
  mobile: string;
  password?: string;
  code?: string;
};
export type LoginRes = {
  token: string;
  refreshToken: string;
  avatar: string;
  mobile: string;
  account: string;
  id: string;
};
