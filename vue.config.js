const { defineConfig } = require("@vue/cli-service");

const AutoImport = require("unplugin-auto-import/webpack");
const Components = require("unplugin-vue-components/webpack");
const { ElementPlusResolver } = require("unplugin-vue-components/resolvers");

const Icons = require("unplugin-icons/webpack");
// 因为elementPlus的icon如果使用是需要加ep的,为了实现自动加载,所以需要这个给它统一加ep
const IconsResolver = require("unplugin-icons/resolver");
const path = require("path");
const pathSrc = path.resolve(__dirname, "src");

module.exports = defineConfig({
  transpileDependencies: true, // 以避免构建后的代码中出现未转译的第三方依赖；Default `false` babel-loader 会忽略所有node_modules中的文件
  lintOnSave: false, // 取消在开发环境下通过eslint-loader 在每次保存时 lint 代码。
  parallel: false, // 不在生产构建的时候，使用多线程来构建项目，Default 默认启用 thread-loader
  pluginOptions: {
    electronBuilder: {
      preload: "src/preload.ts",
      customFileProtocol: "./", //打包后静态资源文件指向
      builderOptions: {
        // options placed here will be merged with default configuration and passed to electron-builder
        productName: "ApplicationName", //项目名，也是生成的安装文件名，即ApplicationName.exe
        appId: "com.example.ApplicationName",
        copyright: "itc © 2023", //版权信息
        // 设置用户可选择安装目录
        nsis: {
          // "oneClick" : false,// 是否一键安装
          // "allowToChangeInstallationDirectory" : true, // 允许修改安装目录
          installerIcon: "public/ip.ico", // 安装图标
          uninstallerIcon: "public/ip.ico", //卸载图标
          installerHeaderIcon: "public/ip.ico", // 安装时头部图标
          createDesktopShortcut: true, // 创建桌面图标
          createStartMenuShortcut: true, // 创建开始菜单图标
          shortcutName: "ip-broadcast", // 图标名称
          deleteAppDataOnUninstall: true, // 卸载时删除 localStorage 数据
          // "include": "./installer.nsh", // 配置 nsn 如修改默认安装目录
          // "license": "./public/license_zh_CN.txt", // 用户协议-指定语言路径
          // "displayLanguageSelector": true, // 语言选择配置
        },
        // "directories": {//输出文件夹
        //   "buildResources": "./public", // 用户协议-支持多语言
        // },
        win: {
          //win相关配置
          // "requestedExecutionLevel": "highestAvailable", // requireAdministrator: 管理员权限, highestAvailable: 可用的最高权限, asInvoker: 默认配置
          icon: "public/ip.ico", //图标，当前图标在icon目录下，注意这里有两个坑
          target: [
            {
              target: "nsis", // 使用nsis打成安装包，打包成免安装版
              arch: [
                "x64", //64位
                // "ia32"//32位
              ],
            },
          ],
        },
        dmg: {
          // macOSdmg macOS系统上常用的安装包格式
          contents: [
            {
              x: 410,
              y: 150,
              type: "link",
              path: "/Applications",
            },
            {
              x: 130,
              y: 150,
              type: "file",
            },
          ],
        },
        mac: {
          // mac
          icon: "./icon/icon.icns",
        },
        linux: {
          // linux
          icon: "./src/assets/images/logo-linux.png",
          target: [
            {
              target: "deb", // 使用deb打成安装包
            },
          ],
          category: "Development",
        },
        // 在linux环境下打包需要，win下打包会报错
        // homepage:"https://www.itc-pa.cn/"
      },
    },
  },
  /**
   * webpack 配置进行更细粒度的修改  https://cli.vuejs.org/zh/config/#chainwebpack
   */
  chainWebpack(config) {
    // 移除 prefetch 插件
    // prefetch 插件 通常用于在路由导航时 自动预加载页面资源，以提升用户体验，不过可能导致首屏展示到用户可操作性的时间增加
    config.plugins.delete("prefetch");
    // set environment variables 消除 vue-i18n 的 esm-bundler 构建警告
    // 详情查看 https://github.com/intlify/vue-i18n-next/issues/789
    config.plugin("define").tap((definitions) => {
      Object.assign(definitions[0], {
        // ... rest of your injected vars here
        // get rid of vue-i18 warning
        __VUE_I18N_FULL_INSTALL__: JSON.stringify(true),
        __INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false),
        __VUE_I18N_LEGACY_API__: JSON.stringify(false),
      });

      return definitions;
    });
  },
  configureWebpack: {
    // 路径别名配置
    resolve: {
      alias: {
        "@": pathSrc,
        assets: "@/assets",
        components: "@/components",
        views: "@/views",
      },
    },
    /**
     * 向全局自动导入插件配置，配置详情：
     * unplugin-auto-import: https://github.com/antfu/unplugin-auto-import
     * unplugin-vue-components: https://github.com/antfu/unplugin-vue-components
     */
    plugins: [
      AutoImport({
        // 在哪些文件里可以直接引入
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/, // .vue
          /\.md$/, // .md
        ],
        // 全局注册导入，详情看 auto-imports.d.ts 文件
        imports: [
          "vue",
          "pinia",
          "vue-router",
          {
            "@/utils/storage": [
              // 命名导入 import { localStorage } from '@/utils/storage'
              "localStorage",
            ],
            "@/store/get_store": [["default", "getStore"]],
            "@/utils/global/index": [["default", "usePublicMethod"]],
            "@/utils/vue/use_current_instance": [
              ["default", "useCurrentInstance"],
            ],
            axios: [
              // 默认导入 import { default as axios } from 'axios'
              ["default", "axios"],
            ],
          },
        ],
        // 声明文件生成位置和文件名称
        dts: path.resolve(pathSrc, "auto-imports.d.ts"),
        // 解析器来进行组件声明
        resolvers: [
          // Element Plus 组件相关函数(带样式)
          ElementPlusResolver(),
          // 图标组件
          IconsResolver({
            prefix: "Icon",
          }),
        ],
        // eslint报错解决
        eslintrc: {
          enabled: true, // Default `false`
          filepath: "./.eslintrc-auto-import.json",
          globalsPropValue: true,
        },
      }),
      Components({
        // 自定义组件的解析器
        resolvers: [
          // Element Plus 组件
          ElementPlusResolver(),
          // 图标库组件
          IconsResolver({
            enabledCollections: ["ep"],
          }),
        ],
        // 声明文件生成位置和文件名称
        dts: path.resolve(pathSrc, "components.d.ts"),
      }),
      // Icons({
      //   autoInstall: true,
      // }),
    ],
  },
  /**
   * 向全局sass样式传入共享的全局变量, $src可以配置图片cdn前缀
   * 配置详情: https://cli.vuejs.org/zh/guide/css.html#%E5%90%91%E9%A2%84%E5%A4%84%E7%90%86%E5%99%A8-loader-%E4%BC%A0%E9%80%92%E9%80%89%E9%A1%B9
   */
  css: {
    loaderOptions: {
      scss: {
        // 注意：在 sass-loader v8 中，这个选项名是 "prependData"
        // 但是在配置 `prependData` 选项的时候
        // `scss` 语法会要求语句结尾必须有分号，`sass` 则要求必须没有分号
        additionalData: `
                  @import "@/assets/css/color.scss";
                `,
      },
    },
  },
  /**
   * 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
   * 打包之后发现map文件过大，项目文件体积很大，设置为false就可以不输出map文件
   * map文件的作用在于：项目打包后，代码都是经过压缩加密的，如果运行时报错，输出的错误信息无法准确得知是哪里的代码报错。
   * 有了map就可以像未加密的代码一样，准确的输出是哪一行哪一列有错。
   */
  productionSourceMap: false,
  /**
   * 详情看官网：https://cli.vuejs.org/zh/config/
   * 支持webPack-dev-server的所有选项
   * host: 可以直接写IP地址这样方便真机测试
   * port: 端口号
   * open: 配置自动启动浏览器
   * proxy: 配置多个代理
   */
  devServer: {
    host: "127.0.0.1",
    port: 8010,
    open: false,
    // open: true,
    // https: true,
    proxy: {
      "/api/v29+": {
        target: "http://172.16.39.123:81",
        changeOrigin: true,
      },
      "/api/v1/": {
        target: "http://127.0.0.1:9999",
        changeOrigin: true,
      },
    },
  },
});
