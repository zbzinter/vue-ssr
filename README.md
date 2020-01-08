# 火狐体育前端开发说明

## 一、全局环境配置

### 下载并安装node及git客户端

### 安装全局依赖(以package.json中engines项为准)

`npm install -g  webpack webpack-cli webpack-dev-server`

* 注意node及相关包的版本号不能太低

## 二、项目依赖配置

1. 进入项目目录后，安装项目依赖（请先clone对应仓库）
`npm install`

## 三、创建项目

1. 修改项目根目录conf.js文件中project项
2. `npm run create` (该功能待完善)

* 该配置即为项目实际对应根目录简写（完整路径会自动添加'src/project'前缀）
* 如：配置'pc/www'，则实际对应项目路径为'src/project/pc/www'
* 该目录下的main.js文件即为项目入口

## 四、启动项目

* 启动项目（自动打开浏览器）

`npm start 保持不变`

`npm run start:local 开发环境连接本地后台的API`

`npm run start:dev 开发环境连接dev环境的API`

`npm run start:test 开发环境连接test环境的API`

`npm run start:uat 开发环境连接uat环境的API`

* 启动项目(不打开浏览器)

`npm run dev`

## 五、项目打包

`npm run build`

* 项目打包输出路径对应conf.js中的project项
* 如：配置'pc/www'，则实际输出路径为'dist/pc/www'

## 六、项目配置项说明

1. conf.js 为项目运行及打包配置文件，配置项说明如下:

```js
{
  // 当前项目目录缩写(缩写规则为：项目类型名/项目目录名)
  
  project: 'pc/www', // activity, app, document, manage

  // 接口类型（api:比赛数据, scoreadmin:比分后台, multimedia: 上传文件, 用户中心: passport等）
  apiType: 'api',

  // 代码类型（pc, mobile, wechat等）
  // 默认pc
  codeType: 'pc',

  // devServer运行端口号
  // 同时运行多个项目时，可修改该项为不同值，避免互相冲突
  devServerPort: 8808,

  // 是否启用mock功能: true为启用，false为不启用
  // 该项配置仅在本地开发环境下有效，打包后的文件该功能自动失效
  // 若启用mock功能，需在mock目录中建立对应的json文件（建立规则见第八点公共封装及使用说明）
  isMock: false,

  // 本地ip地址前缀(自动获取地址会获取多个，不准确，所以需填写本地ip前缀特征)
  localIp: '192.168.101',

  // dll版本（对应dll命令打包出来的公共文件名）
  dll_version: '1.0.0'
}
```

## 七、公共静态资源配置

1. 默认html模板路径
`src/default.html`

2. 默认favicon.ico路径
`src/favicon.ico`

3. 字体图标css文件引入

> 配置项目前在'bin/webpack.base.js'文件中（若改动频繁，后续可以考虑放到conf.js文件中）
> 修改文件中'mobileFontPath'及'pcFontPath'的值，即可修改移动端及pc端引入的字体图标css文件

## 八、dll公共代码提取说明

1. 通过以下命令可以生成公共dll文件
`npm run dll`

2. dll公共代码的配置文件为./bin/webpack.dll.js，可根据实际情况修改需提取配置文件

3. 若重新打包了dll文件，需同步更新./bin/projectInfo.js中的manifestFilePath值

## 九、接口配置修改说明

1. 接口配置文件为'src/apiConf.js'

> 关键配置项说明：

```javascript

// 服务器环境类型
// 可根据该数组实际情况修改或增减环境类型
export const servers = ['192', 'dev', 'test', 'uat']

// 获取当前服务器信息
export function getServerConf() {

  // ... 省略部分代码
  
  // 开发环境默认接口类型
  // 可通过修改该处的值来修改开发环境接口类型
  // 如：type = type === '192' ? 'test' : type, 则可将本地开发环境接口地址修改为测试环境接口地址 
  type = type === '192' ? 'uat' : type
  
  // mqtt正式环境配置
  let mqttUrl = 'wss:mqtt-cn-mp90zryi40c.mqtt.aliyuncs.com'
  let mqttToken = null

  //  开发及测试环境mqtt配置项
  if (type === 'dev' || type === 'test'){
    mqttUrl = 'wss:mq.dev.xiaomingsport.com/ws'
    mqttToken = { username: 'admin', password: '123456' }
  }

  type = type ? `${type}.` : ''


  return {
    type,

    apiInfo: {
      // 比赛数据 API
      api: `https://api.${type}xiaomingsport.com`,

      // 比分后台 API
      scoreadmin: `https://scoreadmin.${type}xiaomingsport.com`

      // ... 省略部分代码
    }

  // ... 省略部分代码

}

```

## 十、目录说明

```text
├─ bin  webpack配置文件目录
│  ├─ create.js  创建项目node文件（待完善）
│  ├─ projectInfo.js  项目路径等相关信息
│  ├─ webpack.base.js  webpack基础配置文件
│  ├─ webpack.development.js  webpack开发环境配置文件
│  ├─ webpack.dll.js  webpack公共文件提取配置文件
│  └─ webpack.production.js  webpack输出配置文件
├─ dist 项目输出目录
├─ dll 项目公共文件输出目录
├─ mock mock数据目录
├─ node_modules 依赖目录
├─ src 源代码目录
│  ├─ comm 公共文件目录
│  │  ├─ business 公共业务目录  
│  │  │  └─ github.js  
│  │  ├─ components 公共组件目录
│  │  ├─ public 公共样式文件目录
│  │  ├─ utils 公共工具方法目录
│  │  └─ vues vue相关封装目录
│  │  │  └─ github.js
│  ├─ config 公共配置目录
│  ├─ project_outside 外部项目目录（暂无，待完善）
│  └─ project 项目代码目录
├─ test 测试代码目录
├─ .babelrc  babel配置文件
├─ .eslintrc.json eslint配置文件  
├─ .gitignore git忽略文件配置文件
├─ conf.js 当前运行项目配置文件
├─ jest.config.js jest配置文件
├─ package-lock.json
├─ package.json  
├─ postcss.config.js postcss配置文件
├─ README.md 开发步骤说明文件
└─ RULE.md 开发规范说明文件
```

## 十一、公共封装及使用说明

### 1、api请求

* get请求

```js
// 通过createApp方法创建的vue实例中，可通过混入的$get及$post方法来发起网络请求
// 例如(以get方法为例，post也类似使用$post方法即可)：
this.$get('v5/match/today/all', {
  sportType: 1,
  date: '2019-5-13',
  matchIds: '',
  leagueIds: ''
}).then(res => {
  // 接口返回信息
  console.log(res.data)
})
```

### 2、混入方法

* 如tip提示语
  
```js
// 通过createApp方法创建的vue实例中，可通过混入的$tip方法来弹出提示语
this.$tip('这是一条提示信息。')

this.$error('这是一条错误信息。')

this.$requireParams('请求前调用，传入必填值的键值对校验')
```

### 3、mock功能使用

1. 开启mock功能

   * 设置根目录下conf.js中isMock为true

2. 添加mock对应json文件

   1. 根据conf.js中project项对应的路径，在mock目录中建立对应的接口文件

      * 如：project项值为'pc/www'，需配置接口地址为'v5/match/today/all'
      * 则在mock目录中逐层创建目录v5/match/today
      * 接口最后一级名称则对应为实际mock数据文件，如上述mock文件路径为v5/match/today/all.json
      * 上述json文件遵循mockjs规范，可动态配置数值

### 4、其他混入功能（待完善）

* 如（mixin，createApp，mock，mqtt等）
* 客户端交互，微信授权、分享等封装
* 自定义methods，store等

### 5、路由

* 路由跳转时打开新页面

```js
用 this.$router.openNewPage({}) 跳转新页面，传参和 this.$router.resolve({}) 一致
```

## 十二、开发规范建议说明

* 待完善。。。（eslint， postcss， es6+）
* 变量命令规范，sessionStorage，localStorage等命名统一规范，全局命名规范（如wx）

## 十三、错误处理

1. npm 错误处理

> 错误提示：
> Module not found: Error: Can't resolve 'core-js/modules/es7.array.includes'

* 错误原因： core-js高版本有问题，需要降版本

`npm i core-js@2.6.5 --save`