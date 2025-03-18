export type AuthProps = {
  isLoggedIn: boolean;
  user?: UserInfo | null;
  destinationUrl?: string | null;
};
export type UserInfo = {
  email?: string;
  name?: string;
  id?: number;
  refreshToken?: string;
  accessToken?: string;
  username?: string;
  mobile?: string;
  ip?: string;
  no?: number;
};
export type DecodeToken = {
  id: number;
  username: string;
  name: string;
  email: string;
  phone: string;
  is_del: number;
  manager_delete_reason: string;
  manager_delete_etc_reason: string;
  user_id: number;
  iat: number;
  exp: number;
  accessToken: string;
};
export type LoginData = {
  id: string;
  password: string;
};
export type AuthContextType = {
  isLoggedIn: boolean;
  destinationUrl?: string | null;
  user?: UserInfo | null | undefined;
  login: (data: LoginData) => void;
  logout: (token: string) => void;
  register: () => void;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: UserInfo) => Promise<void>;
};
