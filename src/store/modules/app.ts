import router from "@/router";
import { AppState } from "../interface";
export const useAppStore = defineStore({
  id: "app",
  state: (): AppState => ({
    is_websocekt: false, //是否连接
    is_login: false, //是否登录中
    is_login_status: 0, // 登录次数
    register_detail: {
      EffectiveTime: "",
      ProductKey: "",
      freeTime: 0,
      isRegister: false,
      RegisterCode: "",
    },
  }),
  actions: {
    // 改变webscoet连接状态
    changeWsStatus(is_websocekt: boolean) {
      this.is_websocekt = is_websocekt;
    },
    updateRegisterDetail(data: any) {
      this.register_detail = data;
    },
    // 改变登录状态
    changeLoginStatus(status: boolean) {
      this.is_login = status;
    },
    // 登录成功返回信息
    loginSuccessData(data: any) {
      this.is_login = false;
      this.is_login_status++;
      localStorage.set("LoginUserID", data.data.UserID);
    },
  },
});
