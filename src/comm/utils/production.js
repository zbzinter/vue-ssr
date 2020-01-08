// 打包环境特定文件
import { getServerConf } from '@config/apiConf'

let { apiInfo } = getServerConf()

// 同步获取api地址信息
export function getServiceInfo() {
  return apiInfo
}


// 获取接口host地址
export function fetchServiceInfo(){
  return new Promise((resolve, reject) => {
    resolve(apiInfo)
  })
}

export function toMock (){
  return new Promise((resolve, reject) => {
    reject('production mock can not be used!')
  })
}