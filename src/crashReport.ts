/**
 * Electron的崩溃捕获，并输出的本地文件中
 */
import { app, crashReporter, BrowserWindow } from "electron";
import path from "path";
import fs from "fs";
const crashDumpsDir = app.getPath("crashDumps");
const startCarashReporter = () => {
  console.log("crash log:", crashDumpsDir);

  crashReporter.start({
    productName: "ip3.0",
    companyName: "itc",
    submitURL: "",
    uploadToServer: false, // 是否将崩溃报告发送给服务器。 如果为 false，崩溃报告将被收集并存储在崩溃目录中，但不会上传。 默认值为 true。
    ignoreSystemCrashHandler: false, //  如果为true，在主进程中生成的崩溃将不会转发给系统崩溃处理器。 默认值为 false.
  });

  // 必要的全局错误捕获
  process.on("uncaughtException", (error) => {
    console.log(error.stack || JSON.stringify(error));
    app.exit();
  });
  // 在类似process.crash() 或者直接kill程序的操作上,这两个事件是不会被触发的
  app.on("render-process-gone", (event, webContents, details: any) => {
    console.warn("app:render-process-gone", event, webContents, details);
    const now = new Date().getTime();
    const fileName = `${now}-pid${"render"}.log`;
    const filePath = path.join(crashDumpsDir, fileName);
    fs.writeFile(filePath, details?.stack, (err) => {
      err ? console.log("write fail") : console.log("crash log:", filePath);
    });
  });

  app.on("child-process-gone", (event, details: any) => {
    console.warn("app:child-process-gone", event, details);
    const now = new Date().getTime();
    const fileName = `${now}-pid${"child"}.log`;
    const filePath = path.join(crashDumpsDir, fileName);
    fs.writeFile(filePath, details?.stack, (err) => {
      err ? console.log("write fail") : console.log("crash log:", filePath);
    });
  });
};
const printCrashLogPath = (win: BrowserWindow) => {
  // 在控制台打印出崩溃日志存放的位置,配合ipcRenderer
  win.webContents.send("crash-file-path", `${crashDumpsDir}`);
};
export { startCarashReporter, printCrashLogPath };

/**
 * 放到preload文件下，为了在控制台打印出崩溃地址
 * ipcRenderer.on("crash-file-path", (event, args) => {
        console.warn("crash-file-path:", args);
    });
 */
