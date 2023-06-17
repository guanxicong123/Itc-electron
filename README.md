<p align="center" style="font-size: 30px; font-weight: bold;">
    客户端初始化模板
</p>

## 项目介绍
本项目是作为客户端项目的初始化模板,为改善每开启一个新项目都要工程师由0开始架构起整个项目而耗费过多的时间，能让工程师在开发项目过程中，更快地投入到业务功能的开发上，以实现更快，更好的交付产品的目标。
该模板致力于实现一个拿来就用的客户端模板，项目该有的配置都基本配置完成，及时工程师需要根据项目需求更改某些依赖项甚至框架，都有对应的教程提供。


## 技术栈
| 技术栈       | 描述                                                 | 官网                                 |
| ------------ | ---------------------------------------------------- | ------------------------------------ |
| volta         | 项目的node & yarn版本管理工具                         | https://volta.sh/        |
| node@16.17.1 | 由于electron22.3.12版本官网推荐的node版本              | https://nodejs.org/en/ |
| Vue3         | 渐进式 JavaScript 框架                               | https://staging-cn.vuejs.org/        |
| Vue CLI      | Vue.js 开发的标准构建工具                            | https://cli.vuejs.org/zh/guide/      |
| Vue Router   | Vue.js 生态的核心库-路由                             | https://router.vuejs.org/zh/         |
| Pinia        | Vue.js 生态的核心库-状态管理                         | https://pinia.vuejs.org/             |
| TypeScript   | JavaScript 的超集                                    | https://www.tslang.cn/               |
| Element Plus | 基于 Vue 3，面向设计师和开发者的组件库               | https://element-plus.gitee.io/zh-CN/ |
| Axios        | 基于 promise 的 HTTP 库，可以用在浏览器和 node.js 中 | http://www.axios-js.com/zh-cn/docs/  |
| Webpack5      | 现代 JavaScript 应用程序的静态模块打包器             | https://www.webpackjs.com/           |
| Electron     | @22.3.12 当前22版本中最新的新版本，因为23开始就不对ie6,7,8 进行支持了 | https://releases.electronjs.org/ |
| 更多插件     | 在 package.json 中查看                               | ……                                   |

### 项目版本
当前最新版本：1.0.1
#### 1.0.1 更新内容
1. localStorage 不需要重新封装，直接使用window提供
2. css 预设文件只需要放 reset 文件
3. src/api/config/checkStatus.ts 文件中的接口错误提示信息，通过 return 返回，统一在axios/index.ts中做消息的提示（涉及UI框架的提示样式） ,并且做国际化
4. ip地址栏输入框组件

#### 1.1.0 预更新内容
1. language 国际化，使用自定义函数代替i18n插件（黄茂峰）
2. router的权限控制逻辑（苏斌）
3. 基本的客户端应用程序框架的功能（最小化，最大化，关闭按钮等）（关锡琮）
4. preload.ts中的ipc通信写法（关锡琮）
5. 常用的工具函数总结归类（黄金凤）
6. 直接引入element-plus，提供切换UI框架的教程。（关锡琮）

#### 预告后续更新的内容
1. 路由根据views文件夹格式，来定义router，无需开发人员自行添加router定义

## 启动部署

#### 环境准备

- **安装 volta**
 https://docs.volta.sh/guide/getting-started
 window 下载并安装 https://github.com/volta-cli/volta/releases/download/v1.1.1/volta-1.1.1-windows-x86_64.msi

- **安装 Yarn && node**
  版本根据package.json中获取
  volta install ndoe@16.17.1
  volta install yarn@1.22.1

- **开发工具**
  推荐 VS Code

- **Vue CLI**
  版本：v5 +

- **必装插件**
  VSCode 插件市场搜索并安装 Volar, 且一定要禁用 Vetur，不然代码会出现组件使用了但编译器还报组件未使用的警告信息，另外 Vue 作者尤雨溪也在 Vue3 生态话题说过 Volar 将会替代 Vetur 作为 Vue 的官方插件。

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
