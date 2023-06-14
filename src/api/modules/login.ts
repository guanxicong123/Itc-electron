/**
 * @name 登录模块
 */
import http from "@/api";
import { Login } from "@/api/interface";

export const loginApi = (params: Login.ReqLoginForm) => {
  return http.post<Login.ResLogin>("/login", params);
};

export const getAuthMenuListApi = () => {
  return http.get<Menu.MenuOptions[]>("/menu/list", {});
};
