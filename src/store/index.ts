import { defineStore, createPinia } from "pinia";
import { GlobalState } from "./interface/index";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

export const GlobalStore = defineStore("global", {
  state: (): GlobalState => {
    return {
      token: "",
    };
  },
  // 相当于计算属性
  getters: {},
  // 相当于方法
  actions: {
    setToken(token: string) {
      this.token = token;
    },
  },
});

// 持续化存储，也就是把数据存入storage
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export default pinia;
