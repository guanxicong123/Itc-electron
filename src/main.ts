import { createApp } from "vue";
import App from "./App.vue";
import I18n from "@/language";
import router from "./router";
// pinia store
import pinia from "@/store";
import "element-plus/dist/index.css";

import ElementPlus from "element-plus";

// element icons
import * as Icons from "@element-plus/icons-vue";

const app = createApp(App);

// register the element Icons component
Object.keys(Icons).forEach((key) => {
  app.component(key, Icons[key as keyof typeof Icons]);
});
app.use(ElementPlus).use(router).use(I18n).use(pinia).mount("#app");
