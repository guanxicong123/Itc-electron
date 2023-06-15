/**
 * @name 登录模块
 */
import http from "@/api/config/axios";
import { Login } from "./interface";

export const loginApi = (params: Login.ReqLoginForm) => {
  return http.post<Login.ResLogin>("/login", params);
};

export const getAuthMenuListApi = () => {
  return http.get<Menu.MenuOptions[]>("/menu/list", {});
};
