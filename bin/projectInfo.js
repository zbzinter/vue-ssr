/**
 * 通过 /conf.js 文件配置信息，获取项目详细信息，如输入、输出绝对路径等
 */

const path = require('path')

let { project, codeType, apiType, dll_version, ...other } = require('../conf')

// 生成目录
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

// src目录
const srcPath = 'src';

let projectPath = project.replace(/^\/?project\//, '')
projectPath = projectPath.startsWith('project_outside')
  ? projectPath
  : `project/${projectPath}`

// 除去projec前缀的路径
const shortPath = projectPath.replace(/^(project_outside|project)\/?/, '')

module.exports = {
  // src路径
  srcPath: resolve(srcPath),

  // 项目源码根目录绝对路径
  projectPath: resolve(`${srcPath}/${projectPath}`),

  // 项目输出目录绝对路径
  distPath: resolve(`www`),

  // 项目源码根目录绝对路径
  commPath: resolve(`${srcPath}/comm`),

  // 项目源码根目录绝对路径
  configPath: resolve(`${srcPath}/config`),

  // mock目录
  mockPath: resolve(`mock/${shortPath}`),

  // 默认html模板路径
  defaultHtmlPath: resolve(`${srcPath}/default.html`),

  // 默认favicon图标路径
  defaultFaviconPath: resolve(`${srcPath}/favicon.ico`),

  // webpack dll文件输出目录
  dllDistPath: resolve('dll'),

  // 项目路径（可作为项目标识使用）
  shortPath,

  resolve,

  // 其他配置项不变
  ...other,

  // dll版本号
  dll_version,

  // dll manifest 文件路径
  manifestFilePath: resolve(`dll/vues_manifest.${dll_version}.json`),

  // api类型
  apiType: apiType || 'api',

  // 代码类型
  codeType: codeType || 'pc'
}
