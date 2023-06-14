import { defineStore } from "pinia";
import { AuthState } from "../interface";
import { getAuthMenuListApi } from "@/api/modules/login";
import { Names } from "../store_name";
import { getFlatArr } from "@/utils";
import { testRouter } from "@/router/modules/testRouter";
// 权限管理
export const AuthStore = defineStore(Names.AUTH, {
  state: (): AuthState => ({
    routeName: "",
    authButtonList: {},
    authMenuList: [],
  }),
  getters: {
    flatMenuListGett: (state): [] => {
      return getFlatArr(state.authMenuList);
    },
    authMenuListGet: (state) => state.authMenuList,
  },
  actions: {
    async getAuthMenuList() {
      // 请求菜单
      // const { data } = await getAuthMenuListApi();
      this.authMenuList = testRouter;
    },
  },
});
