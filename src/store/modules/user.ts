import { defineStore } from "pinia";
import { UserState } from "../interface";
import piniaPersistConfig from "@/utils/piniaPersist";

export const useUserStore = defineStore({
  id: "user",
  state: (): UserState => ({
    token: "",
    userInfo: { name: "" },
  }),
  getters: {},
  actions: {
    // Set Token
    setToken(token: string) {
      this.token = token;
    },
    // Set setUserInfo
    setUserInfo(userInfo: UserState["userInfo"]) {
      this.userInfo = userInfo;
    },
  },
  persist: piniaPersistConfig("user"),
});
