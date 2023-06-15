import router from "@/router";
import { send } from "@/utils/socket";
let $timer: any = null;
const usePublicMethod = {
  // 设置一小时刷新一次token
  setTokenMonitorTime() {
    return new Date().getTime() + 3600 * 1000;
  },
  // 是否到了刷新token的时间
  isRefreshToken() {
    const time = Number(localStorage.get("tokenExpireMonitor")) || 0;
    return time < 1 || time <= new Date().getTime();
  },
  // 跳转新建/编辑界面
  clickJump(path: string, id: number, scheme?: number) {
    if (!path.includes("/new_edit/")) {
      const scheme_id = scheme ? "/" + scheme : "";
      router.push(path + "/new_edit/" + id + scheme_id);
    }
  },
  // 后退
  clickBack() {
    router.go(-1);
  },
  // 统计歌曲时长
  convertSongDuration(second: number, isLimit?: boolean) {
    const h =
      Math.floor(second / 3600) < 10
        ? "0" + Math.floor(second / 3600)
        : Math.floor(second / 3600);
    let m =
      Math.floor((second / 60) % 60) < 10
        ? "0" + Math.floor((second / 60) % 60)
        : Math.floor((second / 60) % 60);
    let s =
      Math.floor(second % 60) < 10
        ? "0" + Math.floor(second % 60)
        : Math.floor(second % 60);

    if (isLimit && Number(h) > 23) return "23:59:59";

    if (Number(m) > 59) m = 59;

    if (Number(s) > 59) s = 59;

    return h + ":" + m + ":" + s;
  },
  // 00:00:00 时间格式转换为秒
  timeToSec(time: any, num = 1) {
    const hour = time.split(":")[0];
    const min = time.split(":")[1];
    const sec = time.split(":")[2];
    const s = Number(hour * 3600) + Number(min * 60) + Number(sec);
    return s * num;
  },
  // 数据容量单位转换
  bytesConversionToSize(bytes: number) {
    if (bytes === 0) {
      return "0 B";
    }
    const k = 1024,
      sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
      i = Math.floor(Math.log(bytes) / Math.log(k));

    return (bytes / Math.pow(k, i)).toPrecision(3) + " " + sizes[i];
  },
  // 日期转换到时间戳
  dateConversionToTimestamp(value: any) {
    if (!value) {
      return 0;
    }

    if (value.indexOf("-")) {
      const arr = value.split("-");
      return new Date(arr[0], Number.parseInt(arr[1]) - 1, arr[2]).getTime();
    }

    return 0;
  },
  // 获取当前时间（年月日时分秒）格式化
  formatDate(str: string, type: string) {
    const date = new Date(str);
    const y = date.getFullYear();
    const m = (date.getMonth() + 1 + "").padStart(2, "0");
    const d = (date.getDate() + "").padStart(2, "0");
    const hh = (date.getHours() + "").padStart(2, "0");
    const mm = (date.getMinutes() + "").padStart(2, "0");
    const ss = (date.getSeconds() + "").padStart(2, "0");
    let time;

    switch (type) {
      case "YYYY-MM":
        time = `${y}-${m}`;
        break;
      case "YYYY-MM-DD":
        time = `${y}-${m}-${d}`;
        break;
      case "YYYY-MM-DD HH:mm:ss":
        time = `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
        break;
      case "MM-DD HH:mm:ss":
        time = `${m}-${d} ${hh}:${mm}:${ss}`;
        break;
      case "MM-DD":
        time = `${m}-${d}`;
        break;
      case "YYYY/MM":
        time = `${y}/${m}`;
        break;
      case "YYYY/MM/DD":
        time = `${y}/${m}/${d}`;
        break;
      case "YYYY/MM/DD HH:mm:ss":
        time = `${y}/${m}/${d} ${hh}:${mm}:${ss}`;
        break;
      case "MM/DD HH:mm:ss":
        time = `${m}/${d} ${hh}:${mm}:${ss}`;
        break;
      case "MM/DD":
        time = `${m}/${d}`;
        break;
    }

    return time;
  },
  // 获取当前日期指定天数后得日期
  specifyDate(num: number) {
    const date = new Date();
    date.setDate(date.getDate() + num);
    return (
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
    );
  },
  // 二进制选择
  binarySelection(decimal: number, number: number) {
    const array = [];
    for (let i = 0; i < number; i++) {
      const dec = Math.pow(2, i);
      if ((decimal & dec) === dec) {
        array.push(i + 1);
      }
    }

    return array;
  },
  // base64 转二进制
  dataURLtoFile(dataurl: string, filename: string) {
    // 将base64转换为文件
    const arr: any[] = dataurl.split(",");
    const mime = arr?.[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {
      type: mime,
    });
  },
  // 随机数
  randomNum() {
    let Num = "";
    for (let i = 0; i < 13; i++) {
      Num += Math.floor(Math.random() * 10);
    }
    return Num;
  },
  /**
   * 压缩图片
   * @param img 被压缩的img对象
   * @param type 压缩后转换的文件类型
   * @param mx 触发压缩的图片最大宽度限制
   * @param mh 触发压缩的图片最大高度限制
   */
  compressImg(img: any, type: any, mx: any, mh: any) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const { width: originWidth, height: originHeight } = img;
    // 最大尺寸限制
    const maxWidth = mx;
    const maxHeight = mh;
    // 目标尺寸
    let targetWidth = originWidth;
    let targetHeight = originHeight;
    if (originWidth > maxWidth || originHeight > maxHeight) {
      if (originWidth / originHeight > 1) {
        // 图片宽
        targetWidth = maxWidth;
        targetHeight = Math.round(maxWidth * (originHeight / originWidth));
      } else {
        // 图片高
        targetHeight = maxHeight;
        targetWidth = Math.round(maxHeight * (originWidth / originHeight));
      }
    }
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    if (context) {
      context.clearRect(0, 0, targetWidth, targetHeight);
      // 图片绘制
      context.drawImage(img, 0, 0, targetWidth, targetHeight);
    }
    return canvas.toDataURL(type || "image/jpeg", 0.5);
  },
  // 生成UUID
  generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  },
  // 16进制转rgb
  hexToRgb(hexStr: string, index: number) {
    // 十六进制颜色值的正则表达式
    const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    let sColor = hexStr.toLowerCase();
    if (sColor && reg.test(sColor)) {
      if (sColor.length === 4) {
        let sColorNew = "#";
        for (let i = 1; i < 4; i += 1) {
          sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
        }
        sColor = sColorNew;
      }
      // 处理六位的颜色值, 转为RGB
      const sColorChange = [];
      for (let i = 1; i < 7; i += 2) {
        sColorChange.push(parseInt(`0x${sColor.slice(i, i + 2)}`));
      }
      // 倒叙，数值越大，颜色越浅
      const num = 1 - index * 0.1;
      const rgbText = `rgba(${sColorChange.join(",")}, ${num})`;
      // 浅色系
      const grayLevel =
        sColorChange[0] * 0.299 +
        sColorChange[1] * 0.587 +
        sColorChange[2] * 0.114;
      return grayLevel >= 192 ? "true" : rgbText;
    } else {
      return sColor;
    }
  },
  // rgb转16进制
  rgbToHex(rgbStr: string) {
    // 十六进制颜色值的正则表达式
    const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    if (/^(rgb|RGB)/.test(rgbStr)) {
      const aColor = rgbStr.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
      let strHex = "#";
      for (let i = 0; i < aColor.length; i++) {
        let hex = Number(aColor[i]).toString(16).padStart(2, "0");
        if (hex === "0") {
          hex += hex;
        }
        strHex += hex;
      }
      if (strHex.length !== 7) {
        strHex = rgbStr;
      }
      return strHex;
    } else if (reg.test(rgbStr)) {
      const aNum = rgbStr.replace(/#/, "").split("");
      if (aNum.length === 6) {
        return rgbStr;
      } else if (aNum.length === 3) {
        let numHex = "#";
        for (let i = 0; i < aNum.length; i += 1) {
          numHex += aNum[i] + aNum[i];
        }
        return numHex;
      }
    } else {
      return rgbStr;
    }
  },
  // 先将16进制颜色先转化成 rgb ，再计算，最后还要将得出的 rgb 颜色转化成16进制颜色
  mix(color1: string, color2: string, weight: number) {
    weight = Math.max(Math.min(Number(weight), 1), 0);
    const r1 = parseInt(color1.substring(1, 3), 16);
    const g1 = parseInt(color1.substring(3, 5), 16);
    const b1 = parseInt(color1.substring(5, 7), 16);
    const r2 = parseInt(color2.substring(1, 3), 16);
    const g2 = parseInt(color2.substring(3, 5), 16);
    const b2 = parseInt(color2.substring(5, 7), 16);
    const r = Math.round(r1 * (1 - weight) + r2 * weight);
    const g = Math.round(g1 * (1 - weight) + g2 * weight);
    const b = Math.round(b1 * (1 - weight) + b2 * weight);
    const _r = ("0" + (r || 0).toString(16)).slice(-2);
    const _g = ("0" + (g || 0).toString(16)).slice(-2);
    const _b = ("0" + (b || 0).toString(16)).slice(-2);
    return "#" + _r + _g + _b;
  },
  debounce(fn: () => void, wait: number | undefined) {
    // 清除上一次延时器
    clearTimeout($timer);
    $timer = setTimeout(function () {
      fn();
    }, wait);
  },
  throttle(fn: () => void, wait: number | undefined) {
    return (function () {
      if (!$timer) {
        fn();
      }
      clearTimeout($timer);
      $timer = setTimeout(() => {
        clearTimeout($timer);
        $timer = null;
      }, wait);
    })();
  },
};

export default usePublicMethod;
