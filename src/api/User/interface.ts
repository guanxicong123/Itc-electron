/**
 * @descript 登录模块
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Login {
  export interface ReqLoginForm {
    username: string;
    password: string;
  }
  export interface ResLogin {
    access_token: string;
  }
}
