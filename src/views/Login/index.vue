<!-- 
  @Author: hmf
  @CreateDate: 2022-06-20
  @FilePath: src\views\login\index.vue
  @Describe: 登陆页面
-->
<template>
  <div class="broadcast-login">
    <div class="broadcast-login-header">
      <div class="login-header-functron">
        <el-icon @click="handleMinimize">
          <template #default>
            <span class="iconfont icon-minimize"></span>
          </template>
        </el-icon>
        <el-icon>
          <template #default>
            <span class="iconfont icon-set-up"></span>
          </template>
        </el-icon>
        <el-icon @click="close">
          <template #default>
            <span class="iconfont icon-clear"></span>
          </template>
        </el-icon>
      </div>
      <div class="login-header-logo">
        <h2>{{ $t("IP network broadcasting") }}</h2>
      </div>
    </div>
    <div class="broadcast-login-edition">V3.0.6</div>
  </div>
</template>

<script lang="ts" setup>
import { socketLogin, socket } from "@/utils/socket";
import { ElMessage } from "element-plus";
import { loginApi } from "@/api/User/login";
// 全局属性
console.log(111);

console.log(useCurrentInstance, "useCurrentInstance");

const { proxy } = useCurrentInstance.useCurrentInstance();

const store = getStore.useAppStore();
// 计算属性 computed
const isWebsocekt = computed(() => {
  return store.is_websocekt;
}); //ws连接状态
const isLogin = computed(() => {
  return store.is_login;
}); //是否登录

// 隐藏
const handleMinimize = () => {
  window.electronAPI.send("minimize");
};
// 关闭
const close = () => {
  window.electronAPI.send("close");
};
// 拦截F11事件
const onF11Event = (event: any) => {
  if (event.code === "F11") {
    event.preventDefault();
  }
};
// mounted 实例挂载完成后被调用
onMounted(() => {
  window.addEventListener("keydown", onF11Event);
});
// 设置登录页面的大小
window.electronAPI.send("set-login-window-size");
// 离开登录页面后，取消F11监听事件
onUnmounted(() => {
  window.removeEventListener("keydown", onF11Event);
});
</script>

<style lang="scss">
.broadcast-login {
  width: calc(100% - 4px);
  height: calc(100% - 2px);
  margin: 0 2px 2px 2px;
  background-color: $c-fff;
  border-radius: 8px;
  box-sizing: border-box;
  border-color: #e8e8e8;
  box-shadow: 1px 12px 48px 16px rgb(0 0 0 / 5%), 1px 9px 28px 0 rgb(0 0 0 / 6%),
    1px 6px 6px -8px rgb(0 0 0 / 10%);

  .broadcast-login-header {
    position: relative;
    -webkit-app-region: drag;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    overflow: hidden;
  }

  .svg {
    position: absolute;
    left: 0;
    width: 100%;
    overflow: visible;
    bottom: 0;
  }

  .wave {
    animation: wave 4s linear;
    animation-iteration-count: infinite;
  }

  #wave1 {
    fill: $c-fff;
  }

  #wave2 {
    animation-duration: 5s;
    animation-direction: reverse;
    fill: #7dc3fb;
    opacity: 0.6;
  }

  #wave3 {
    animation-duration: 6s;
    fill: #40a3f8;
    opacity: 0.4;
  }

  @keyframes wave {
    to {
      transform: translateX(-100%);
    }
  }

  @keyframes ball {
    to {
      transform: translateY(20%);
    }
  }

  .login-header-functron {
    position: absolute;
    top: 0;
    right: 10px;
    -webkit-app-region: no-drag;
    display: flex;
    align-items: center;
    width: 80px;
    height: 44px;
    font-size: 16px;
    color: $c-fff;

    i {
      flex: 1;
    }
  }

  .login-header-logo {
    text-align: center;
    padding: 60px 0;
    background: linear-gradient(180deg, #2276f3 0%, #2aa0f8 100%);

    .logo-imag {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background-color: #fff;
    }

    h2 {
      font-size: 20px;
      line-height: 40px;
      font-weight: bold;
      color: $c-fff;
    }
  }

  .broadcast-login-from {
    padding-top: 22px;
    text-align: center;

    .el-input {
      padding-top: 8px;
      width: 240px;

      .el-input__wrapper {
        height: 28px;
        border-bottom: 1px solid #ddd;
        border-radius: 0;
        box-shadow: 0 0 0 0 var(--el-input-border-color, var(--el-border-color))
          inset;
      }
    }

    .login-from-remember_password {
      margin: 0 auto;
      width: 240px;
      text-align: right;
    }

    .iconfont {
      color: #9dc7f3;
    }

    .icon-the-server {
      font-size: 12px;
    }
    .login-from-server {
      display: flex;
      width: 240px;
      margin: 8px auto 0;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      .el-input {
        padding-top: 0;
        width: 100%;
      }
      .f-l {
        flex: 1;
        min-width: 70%;
      }
      .f-r {
        display: flex;
      }
    }
  }

  .broadcast-login-register {
    width: 240px;
    margin: 0 auto;
    padding: 9px 0;
    text-align: right;
    font-size: 12px;
    .register-no {
      color: #ce6245;
    }
    .register-lifespan {
      color: #018cee;
    }
  }

  .broadcast-login-sign {
    text-align: center;
    padding-top: 12px;

    .el-button {
      width: 240px;
      height: 36px;
      background-color: #0070ee;

      &:hover {
        opacity: 0.8;
      }
    }
  }

  .broadcast-login-edition {
    padding-top: 14px;
    text-align: center;
    color: #999999;
  }
}
</style>
