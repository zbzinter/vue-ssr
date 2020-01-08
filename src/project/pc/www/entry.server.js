import createApp from '@vues/createApp'
import common from '@src/common'
let TIME_OUT = 10//请求接口超时时间
export default context => {
  return new Promise((resolve, reject) => {
    //const { app, store, router } = createApp({ modules: common.modules, methods: common.methods, ...context })
    createApp({ modules: common.modules, methods: common.methods, ...context }).then(({ app, store, router }) => {
      context.serverError = 0

      // 设置路由
      router.push(context.url)

      router.onReady(() => {
        const matchedComponents = router.getMatchedComponents()

        if (!matchedComponents.length) {
          return reject({ code: 404 })
        }

        let timeOut = new Promise((resolve, reject) => {
          setTimeout(() => {
            reject({
              code: 408
            })
          }, TIME_OUT * 1000)
        })

        //  对所有匹配的路由组件调用 `asyncData()`
        let asyncDataReq = Promise.all(matchedComponents.map(Component => {
          store.state.noHeader=!!router.currentRoute.meta.noHeader
          if (Component.asyncData) {

            return Component.asyncData({
              store: store,
              route: router.currentRoute
            })
          }
        }))

        Promise.race([timeOut, asyncDataReq]).then(() => {
          // 在所有预取钩子(preFetch hook) resolve 后，
          // 我们的 store 现在已经填充入渲染应用程序所需的状态。
          // 当我们将状态附加到上下文，
          // 并且 `template` 选项用于 renderer 时，
          // 状态将自动序列化为 `window.__INITIAL_STATE__`，并注入 HTML。
          context.state = store.state
          resolve(app)
        }).catch(err => {
          console.log('服务端异常', err)
          context.serverError = 500
          resolve(app)
          //reject(err)
        })

      }, reject)
    }).catch((err) => {
      reject(err)
    })
  })
}