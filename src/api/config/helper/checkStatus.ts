/**
 * @description: 校验网络请求状态码
 * @param {Number} status
 * @return void
 */
import i18n from "@/language";

const $t: any = i18n.global;
export const checkStatus = (status: number) => {
  let message: string;
  switch (status) {
    case 400:
      message = $t("请求失败！请您稍后重试");
      break;
    case 401:
      message = $t("登录失效！请您重新登录");
      break;
    case 403:
      message = $t("当前账号无权限访问！");
      break;
    case 404:
      message = $t("你所访问的资源不存在！");
      break;
    case 405:
      message = $t("请求方式错误！请您稍后重试");
      break;
    case 408:
      message = $t("请求超时！请您稍后重试");
      break;
    case 500:
      message = $t("服务异常！");
      break;
    case 502:
      message = $t("网关错误！");
      break;
    case 503:
      message = $t("服务不可用！");
      break;
    case 504:
      message = $t("网关超时！");
      break;
    default:
      message = $t("请求失败！");
  }
  return message;
};
