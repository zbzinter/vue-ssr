import Vue from 'vue'
import mixinRouter from '@vues/mixinRouter'
import mixinStore from '@vues/mixinStore'
import mixinFilters from '@vues/mixinFilters'
import mixinMethods from '@vues/mixinMethods'
import vueExtend from '@vues/vueExtend'
import { Decimal } from 'decimal.js'
// // import { setProjectInfo, getProjectInfo } from '@business/projectInfo'
import { fetchServiceInfo } from '@envFile'
import dayjs from 'dayjs'
import dateFormate from '@utils/dateFormate'
import Message from '@utils/message'
const msg = new Message()
import echarts from 'echarts'
// 初始化页面
import { defaultImg, throttle } from '@utils/utils'
// import '@utils/initPage'

import '@public/reset'

import { createRouter } from '@src/router'
import { sync } from 'vuex-router-sync'
import App from '@src/App.vue'

Vue.prototype.msg = msg
Vue.prototype.dayjs = dayjs
Vue.prototype.dateFormate = dateFormate
Vue.prototype.bus = new Vue()
Vue.prototype.echarts = echarts
Vue.prototype.Decimal = Decimal
Vue.prototype.defaultImg = defaultImg
Vue.prototype.throttle = throttle
export default ({
  conf = {},
  modules = {},
  filters = {},
  methods = {},
  vueExtends = {},
  el = '#app'
}) => {
  const router = createRouter()
 
  const store = mixinStore(modules)
  
  // 同步路由状态(route state)到 store
  sync(store, router)
  mixinFilters(filters)
  mixinMethods(methods, conf)
  vueExtend(vueExtends)
  let options = {
    el,
    store,
    render: h => h(App)
  }
  if (typeof router !== 'undefined') {
    mixinRouter(router, conf)
    options = {
      ...options,
      router
    }
  }
  let app=new Vue(options)
  return new Promise(resolve => {
    fetchServiceInfo().then(res => {
      resolve({ app, router, store })
    })
  })
}
