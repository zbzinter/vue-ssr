/**
 * mock数据分发处理，对API对应地址做mock数据处理
 * @example
 * api: 'user/login'
 * 对应mock文件: 项目目录/mock/login.json
 * login.json可为json数据或符合mockjs语法的动态json
 */
import Mock from 'mockjs'

/**
 * api使用mock数据处理
 * @param  {String} api 接口请求地址
 * @return {Promise}     动态加载mock数据的Promise
 */
export default(api) => {
  return new Promise((resolve, reject) => {
    if (typeof api !== 'string' || api.trim() === '') {
      reject('接口地址必须为非空字符串')
    } else {
      let fileName = api.replace(/^\/?|\?.*/g, '')
      import(`@mockPath/${fileName}.json`).then(module =>{
        if (typeof module === 'object'){
          resolve(module.default || module)
        }else{
          reject(module)
        }
      }).catch(err=>{
        reject(err)
      })
    }
  })
}
