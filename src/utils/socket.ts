import { ElMessage, ElNotification, ElLoading } from "element-plus";

import i18n from "@/language";
import router from "../router";
import { Md5 } from "ts-md5";

const $t: any = i18n.global;

let loadingInstance: any;
let loginData: any = ""; //用于储存登录时请求信息
let socket: any;
let reloadInterval: any;
let connected = false;
let connecting = false;
let is_login = true; //是否处于登录状态
const WbakUrl = "ws://127.0.0.1:9999/socket";

const baseParams = {
  company: "BL",
  actioncode: "c2ms_net_reconnect",
  token: "",
  data: {},
  result: 0,
  return_message: "",
};

const registerWebSocket = async () => {
  const socketStatus = !socket || socket.readyState !== 1;
  if (socketStatus && !connected && !connecting) {
    connected = false;
    connecting = true;
    socket = new WebSocket(WbakUrl);
    //WebSocket连接成功
    socket.onopen = () => {
      connecting = false;
      connected = true;
      //初始化请求数据
      if (is_login) {
        initRequest();
      } else {
        login();
      }
      loadingInstance?.close();
      loadingInstance = null;
    };
    //WebSocket通知
    socket.onmessage = ({ data }: any) => {
      try {
        const msg = JSON.parse(data);
        handlerMsg(msg);
      } catch (e) {
        console.log(e);
      }
    };
    //WebSocket异常
    socket.onerror = () => {
      if (getStore.useAppStore().is_login) return;
      clearInterval(reloadInterval);
      reload();
      connecting = false;
      connected = false;
    };
    //WebSocket关闭
    socket.onclose = () => {
      if (router.currentRoute.value.fullPath !== "/") {
        //登陆页面主动断开不重连
        reload();
      }
    };
  }
};
const send = (data: any) => {
  const connected = socket && socket.readyState === 1;
  if (connected) {
    if (data.actioncode !== "c2ms_user_login") {
      data["token"] = localStorage.get("userToken");
    }
    socket.send(JSON.stringify(data));
  }
};
const reload = () => {
  reloadInterval = setTimeout(() => {
    const socketStatus = !socket || socket.readyState !== 1;
    socketStatus && registerWebSocket();
    // message.error("服务器连接断开")
  }, 3000);
  loadingInstance = ElLoading.service({
    text: $t.t("Attempting to reconnect to logical server"),
    background: "rgba(0, 0, 0, 0.7)",
  });
};
// 初始化ws连接
const socketLogin = (data: any) => {
  const myDate = new Date();
  const a = myDate.getFullYear();
  const b = myDate.getMonth() + 1;
  const c = myDate.getDate();
  const d = myDate.getHours();
  const e = myDate.getMinutes();
  const f = myDate.getSeconds();
  data.data.LoginTime = a + "-" + b + "-" + c + " " + d + ":" + e + ":" + f;

  loginData = data;
  is_login = false;
  registerWebSocket();
};

const initRequest = () => {
  const token = localStorage.get("userToken");
  // 初始化的时候需要发送的ws
  const requestData = ["c2ms_get_register_status"];
  if (token) {
    requestData.forEach((item) => {
      requestFunction(item);
    });
  }
};
// webSocket请求获取XX信息状态
const requestFunction = (actionCode: string) => {
  baseParams.actioncode = actionCode;
  baseParams.data = {};
  return send(baseParams);
};

// 登录
const login = () => {
  const data = { ...loginData };
  const myDate = new Date();
  const a = myDate.getFullYear();
  const b = (myDate.getMonth() + 1).toString().padStart(2, "0");
  const c = myDate.getDate().toString().padStart(2, "0");
  const d = myDate.getHours().toString().padStart(2, "0");
  const e = myDate.getMinutes().toString().padStart(2, "0");
  const f = myDate.getSeconds().toString().padStart(2, "0");
  data.data.LoginTime = a + "-" + b + "-" + c + " " + d + ":" + e + ":" + f;
  data.data.Password = Md5.hashStr(
    Md5.hashStr(data.data.Password) + `${f}${c}${d}`
  );
  send(data);
};
const handlerMsg = (msg: any) => {
  if (msg.result !== 200) {
    // 登录失败
    return ElMessage({
      type: "error",
      message: msg.return_message,
      grouping: true,
    });
  }
  // 响应后的返回数据
  switch (msg.actioncode) {
    case "ms2c_user_login": // 登录返回信息
      is_login = true;
      localStorage.set("userToken", msg.token);
      initRequest();
      break;
  }
};

export {
  // 暴露出去,方便调用
  socket,
  socketLogin,
  registerWebSocket,
  send,
};
