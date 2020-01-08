
// import { login, setTitle } from '@business/user'
/**
 * [description]
 * @param  {[Object]}   routes    [VueRouter实例对象]
 * @param  {Object} [http=new HttpBase()]   [HttpBase实例对象]
 */
export default (routes, conf) => {

  // let { loginUrl } = conf
  // routes.beforeEach((to, from, next) => {
  //   let { meta } = to
  //   meta = typeof meta === 'object'
  //     ? meta
  //     : {}
  //   let { isLogin } = meta

  //   // 检测登录，未登录则先登录再跳转
  //   if (isLogin) {
  //     // web, wechat, app, other-app
  //     login(true, loginUrl).then(() => {
  //       next()
  //     }).catch(reson => {
  //       console.log(reson)
  //     })
  //   } else {
  //     next()
  //   }
  // })

  routes.beforeEach((to, from, next) => {

    if (process) {
      next()
      return
    }

    if (!localStorage.getItem('token')) {
      if (to.path.indexOf('personal') > -1) {
        next({ path: 'index' })
      } else {
        next()
      }
    } else {
      next()
    }
  })

  routes.afterEach((to, from) => {
    let { meta } = to
    meta = typeof meta === 'object'
      ? meta
      : {}
    let { title } = meta

    if (title) {
      // 设置页面标题
      // setTitle(title)
    }

  })
}
