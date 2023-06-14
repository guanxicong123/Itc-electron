export interface IElectronAPI {
  send: (channel, data?) => Promise<void>;
  on: (channel, callback?) => Promise<void>;
  removeAllListeners: (channel) => Promise<void>;
  once: (channel, callback?) => Promise<void>;
  sendToHost: (channel, data?) => Promise<void>;
  postMessage: (channel, message?) => Promise<void>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
