
import createApp from '@vues/createApp'

import common from '@src/common'

createApp({
  //App,
  modules: common.modules,
  methods: common.methods
}).then(({ app, store, router }) => {
  // 如果有__INITIAL_STATE__变量，则将store的状态用它替换
  if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__)
  }

  router.onReady((currentRoute) => {

    // 通过路由勾子，执行拉取数据逻辑
    router.beforeResolve((to, from, next) => {
      store.state.noHeader=!!router.currentRoute.meta.noHeader
      // 找到增量组件，拉取数据 
      const matched = router.getMatchedComponents(to)
      const prevMatched = router.getMatchedComponents(from)
      let diffed = false
      const activated = matched.filter((c, i) => {
        return diffed || (diffed = (prevMatched[i] !== c))
      })
      // 组件数据通过执行asyncData方法获取
      const asyncDataHooks = activated.map(c => c.asyncData).filter(_ => _)
      if (!asyncDataHooks.length) {
        return next()
      }
      // 要注意asyncData方法要返回promise，asyncData调用的vuex action也必须返回promise
      Promise.all(asyncDataHooks.map(hook => hook({ store, route: to })))
        .then(() => {
          next()
        })
        .catch((err) => {
          console.log(err, 'asyncData错误')
          next()
        })
    })
    if (window.__serverRenderError === 500) {
      feCompatibleRender(currentRoute)
    } else {
      // 将Vue实例挂载到dom中，完成浏览器端应用启动
      app.$mount('#app')
    }
    

  })

  function feCompatibleRender(route) {
    let matched = router.getMatchedComponents(route)
    console.log('前端兼容渲染')
    Promise.all(matched.map(c => {
      if (c.asyncData) {
        return c.asyncData({
          store, route
        })
      }
    })).then(() => {
      console.log('兼容渲染完成')
      app.$mount('#app')
    }).catch(err => {
      console.log(err)
    })
  }
})
