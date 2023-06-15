// 与后端约定的接口返回格式
export interface Result {
  status: number;
  msg: string;
  success: boolean;
}

export interface ResultData<T = any> extends Result {
  data: T;
}
