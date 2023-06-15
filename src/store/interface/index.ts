export interface GlobalState {
  token: string;
}

/* UserState */
export interface UserState {
  token: string;
  userInfo: { name: string };
}

/* AppState */
export interface AppState {
  is_websocekt: boolean;
  is_login: boolean;
  is_login_status: number;
  register_detail: any;
}
