import axios, {
  AxiosInstance,
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  ParamsSerializerOptions,
  InternalAxiosRequestConfig,
} from "axios";
import qs from "qs";
import { ResultData } from "./interface";
import { ElMessage } from "element-plus";
import { checkStatus } from "../helper/checkStatus";
import { ResultEnum } from "../enums/httpEnum";
import { GlobalStore } from "@/store";
// import { AxiosResponse } from "@/api/interface";

// export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
//   noLoading?: boolean;
// }

const options = {
  // 默认地址请求地址，可在 .env.*** 文件中修改
  baseURL: "./",
  // 设置超时时间
  timeout: ResultEnum.TIMEOUT as number,
  // 跨域时候允许携带凭证
  withCredentials: true,
  // // 序列化
  // paramsSerializer: (params: ParamsSerializerOptions | undefined): string => {
  //   return qs.stringify(params, { arrayFormat: "repeat" });
  // },
};

class RequestHttp {
  service: AxiosInstance;
  public constructor(config: AxiosRequestConfig) {
    // 实例化axios
    this.service = axios.create(options);

    /**
     * @description 请求拦截器
     * 客户端发送请求 -> [请求拦截器] -> 服务器
     * 情况：如果在拦截器上改基础配置（options）如超时时间，第一个请求时的配置还是原来的，第二个请求才是改变后的
     * 解决方案：可以通过请求发起的时候传入的config
     * token校验(JWT) : 接受服务器返回的token,存储到vuex/pinia/本地储存当中
     *
     * 暂时使用x-access-token 这个header来传token
     */
    this.service.interceptors.request.use(
      (config: AxiosRequestConfig): any => {
        const globalStore = GlobalStore();

        const token = globalStore.token;
        return {
          ...config,
          headers: { ...config.headers, "x-access-token": token },
        };
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    /**
     * @description 响应拦截器
     *  服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
     */

    this.service.interceptors.response.use(
      (response: AxiosResponse): any => {
        const { data } = response;
        const globalStore = GlobalStore();
        // 没有权限（401）
        if (data.status === ResultEnum.OVERDUE) {
          ElMessage.error(data.msg);
          globalStore.setToken("");
          return Promise.reject(data.data);
        }

        if (data.code && data.code === ResultEnum.SUCCESS) {
          return Promise.resolve(data.data);
        }
        // response 拦截器统一处理请求失败逻辑
        ElMessage.error(data.msg);
        return Promise.reject(data.data);
      },
      (error: AxiosError) => {
        const { response } = error;
        // 请求超时 && 网络错误单独判断，没有 response
        if (error.message.indexOf("timeout") !== -1)
          ElMessage.error("请求超时！请您稍后重试");
        if (error.message.indexOf("Network Error") !== -1)
          ElMessage.error("网络错误！请您稍后重试");
        // 根据服务器响应的错误状态码，做不同的处理
        if (response) checkStatus(response.status);
        return Promise.reject(error);
      }
    );
  }

  get<T>(url: string, params?: object, config = {}): Promise<ResultData<T>> {
    return this.service.get(url, {
      params,
      ...config,
      // 序列化
      // paramsSerializer: (params: any): string => {
      //   return qs.stringify(params, { arrayFormat: "repeat" });
      // },
    });
  }
  post<T>(url: string, params?: object, config = {}): Promise<ResultData<T>> {
    return this.service.post(url, params, config);
  }
  put<T>(url: string, params?: object, config = {}): Promise<ResultData<T>> {
    return this.service.put(url, params, config);
  }
  delete<T>(url: string, params?: object, config = {}): Promise<ResultData<T>> {
    return this.service.delete(url, { params, ...config });
  }
  document(url: string, params?: object, config = {}): Promise<BlobPart> {
    return this.service.post(url, params, { ...config, responseType: "blob" });
  }
}
const http2 = new RequestHttp(options);
export { http2 };
export default new RequestHttp(options);
