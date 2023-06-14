import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  send: (channel: string, data?: any) => {
    ipcRenderer.send(channel, data);
  },
  on: (channel: string, callback: (arg0: any) => any) => {
    // Filtering the event param from ipcRenderer
    const newCallback = (_: any, data: any) => callback(data);
    ipcRenderer.on(channel, newCallback);
  },
  removeAllListeners: (channel: string, callback: (arg0: any) => any) => {
    ipcRenderer.removeAllListeners(channel);
  },
  sendToHost: (channel: string, data?: any) => {
    ipcRenderer.sendToHost(channel, data);
  },
  once: (channel: string, callback: (arg0: any) => any) => {
    // Filtering the event param from ipcRenderer
    const newCallback = (_: any, data: any) => callback(data);
    ipcRenderer.once(channel, newCallback);
  },
  postMessage: (channel: string, message?: string) => {
    ipcRenderer.postMessage(channel, message);
  },
});
ipcRenderer.on("crash-file-path", (event, args) => {
  console.warn("crash-file-path:", args);
});
