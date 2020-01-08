
import Vue from 'vue'
import { Message } from 'iview'
//import VueCropper from 'vue-cropper'
/* import App from './App'
import createApp from '@vues/createApp'
import router from './router' */
import projectStore from './store'
import DefaultImg from '@src/components/DefaultImg'
import NoData from '@src/components/NoData'
//import VueAwesomeSwiper from 'vue-awesome-swiper'
import animated from 'animate.css'
import 'swiper/dist/css/swiper.css'
import 'iview/dist/styles/iview.css'

import './public/style.scss'
import VueLazyLoad from 'vue-lazyload'
import * as filters from './filters'
import commonMixin from './mixins/common.js'
import loadingImg from './assets/loading.gif'
import _ from 'lodash'


let tempMsgArr = []
Object.keys(filters.default).forEach(keys => {
  Vue.filter(keys, filters.default[keys])
})

Vue.use(VueLazyLoad, {
  preLoad: 1.3,
  error: loadingImg,
  loading: loadingImg,
  attempt: 1
})

Vue.use(animated)
//Vue.use(VueCropper)
Vue.mixin(commonMixin)
Vue.component('DefaultImg', DefaultImg)
Vue.component('NoData', NoData)
//Vue.use(VueAwesomeSwiper)


Vue.mixin({
  beforeRouteUpdate(to, from, next) {
    const { asyncData } = this.$options
    if(from&&to.name==from.name){
      next()
      return false
    }
    if (asyncData) {
      asyncData({
        store: this.$store,
        route: to
      }).then(next).catch(next)
    } else {
      next()
    }
  }
})


const modules = {
  projectStore
}
const methods = {
  debounce(conf, type) {
    if (!tempMsgArr.includes(conf)) Message[type](conf)
    tempMsgArr.push(conf)
    tempMsgArr = [...new Set(tempMsgArr)]
    _.debounce(() => {
      tempMsgArr = []
    }, 3000)()
  },
  $tip(conf) {
    this.debounce(conf, 'info')
  },
  $error(conf) {
    this.debounce(conf, 'error')
  },
  $warning(conf) {
    this.debounce(conf, 'warning')
  },
  $success(conf) {
    this.debounce(conf, 'success')
  },
  $requireParams(params, isTip) { // 请求前的必填参数校验
    if (Object.prototype.toString.call(params) !== '[object Object]') return false
    let nullVal = []
    for (const [key, item] of Object.entries(params)) {
      if (!item && item !== 0) {
        nullVal.push(key)
      }
    }
    if (nullVal.length) {
      isTip ? this.$error(`获取参数${nullVal.join()}失败`) : console.error(`获取参数${nullVal.join()}失败`)
      return true
    }
    return false
  },
  $judgeCode(code) {
    return code === 200 || code === 100200
  }
}
export default {
  modules: modules,
  methods: methods
}

