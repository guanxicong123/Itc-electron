"use strict";

import { app, protocol, BrowserWindow, ipcMain, dialog } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";
import { startCarashReporter, printCrashLogPath } from "./crashReport";
const path = require("path");
const isDevelopment = process.env.NODE_ENV !== "production";

// 开启崩溃日志收集
startCarashReporter();

// 必须在应用准备就绪之前注册方案
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  // 创建浏览器窗口.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false, //窗口是否可以由用户手动调整大小的属性
    autoHideMenuBar: true, //是否隐藏菜单
    frame: false, //false为无边框窗口
    // transparent: true, //使窗口 透明。 默认值为 false. 在Windows上，仅在无边框窗口下起作用。
    // icon: path.join(__dirname, "../public/icons/ip.ico"),
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env
        .ELECTRON_NODE_INTEGRATION as unknown as boolean,
      contextIsolation: !(process.env
        .ELECTRON_NODE_INTEGRATION as unknown) as boolean,
      preload: path.join(__dirname, "preload.js"), //预加载
      webSecurity: false,
    },
  });
  printCrashLogPath(win);
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }
  ipcMain.on("open-devtools", () => {
    win.webContents.openDevTools();
  });
  // close
  ipcMain.on("close", () => {
    win.close();
  });
  // minimize
  ipcMain.on("minimize", () => {
    win.minimize();
  });
  // maximize
  ipcMain.on("maximize", () => {
    win.maximize();
  });

  // 窗口F11的监听事件
  // 保存全屏之前的窗口大小
  const F11Size = {
    width: 0,
    height: 0,
  };
  // 防止用户快速点击F11,
  let setPrevSize = 0;
  // 仅适用与F11全屏操作，
  // 当前是否为全屏状态
  let winIsFullScreenFlog = false;
  win.on("enter-full-screen", () => {
    winIsFullScreenFlog = !winIsFullScreenFlog;
    if (winIsFullScreenFlog && setPrevSize === 0) {
      F11Size.width = win.getSize()[0];
      F11Size.height = win.getSize()[1];
      setPrevSize = 1;
    }
    setTimeout(() => {
      if (!winIsFullScreenFlog) {
        win.setSimpleFullScreen(false);
      }
    }, 500);
  });
  // 通过win.setSimpleFullScreen(false)，可触发这个事件
  win.on("leave-full-screen", () => {
    setTimeout(() => {
      win.setSize(F11Size.width, F11Size.height);
      win.center();
      setPrevSize = 0;
    });
  });
  // F11 end
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS);
    } catch (e: any) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
