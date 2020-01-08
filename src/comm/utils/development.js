// 开发环境特定文件
import { getServerConf } from '@config/apiConf'
import mockFile from '@utils/mockFile'

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

export function toMock(...options){
  return mockFile(...options)
}


