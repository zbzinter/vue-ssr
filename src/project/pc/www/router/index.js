
import Vue from 'vue'
import VueRouter from 'vue-router'
import NoPath from '@components/NoPath'
import Index from '../pages/home/Index.vue'
import PersonalCenter from './personal-center'
import News from './news'
import Score from './score'
import Rules from './rules'
import Obs from './obs'
// import ProgramTopics from '../pages/programtopics/index'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    component: Index,
    meta: {
      // isLogin: true,
      title: 'index'
    }
  },
  {
    path: '/score/football',
    component: () => import('../pages/score/football/Index')
  },
  {
    path: '/score/basketball',
    component: () => import('../pages/score/basketball/Index'),
    meta: {
      // isLogin: true,
      title: 'score'
    }
  },
  {
    path: '/score/tennis',
    component: () => import('../pages/score/tennis/Index')
  },
  {
    path: '/score/baseball',
    component: () => import('../pages/score/baseball/Index')
  },
  /**
   * 直播详情页
   * query: {
   *  id: 赛事id
   *  roomId: 房间id
   * }
   */
  {
    path: '/live/detail',
    component: () => import('../pages/live')
  },
  // 举报
  {
    path: '/live/inform',
    component: () => import('../pages/live/inform')
  },
  // 给后台测试推流的视频地址
  {
    path: '/video',
    name: 'video',
    component: () => import('../pages/live/video.vue')
  },
  // 主播页
  {
    path: '/live-list',
    name: 'live-list',
    component: () => import(/* webpackChunkName: "liveList" */'../pages/live-list')
  },
  // 主播搜索页
  {
    path: '/live-list/search',
    component: () => import('../pages/live-list/search')
  },
  {
    path: '/database',
    redirect: '/database/basketball',
    component: () => import('../pages/database/basketball/Index'),
    children: [
      {
        path: 'basketball',
        component: () => import('../pages/database/basketball/Index')
      },
      {
        path: 'team',
        component: () => import('../pages/database/basketball/Team')
      },
      // {
      //   path: 'info',
      //   component: () => import('../pages/database/basketball/TeamPersonInfo')
      // }
    ]
  },
  {
    path: '/database/info',
    component: () => import('../pages/database/basketball/TeamPersonInfo'),
  },
  {
    path: '/database',
    redirect: '/database/football',
  },
  {
    path: '/database/football',
    component: () => import('../pages/database/football/Index'),
    children: []
  },
  // 微信支付
  {
    path: '/pay/wx',
    component: () => import('../pages/pay/wx')
  },
  // 忘记密码
  {
    path: '/forget-password',
    component: () => import('../pages/personal/forget-password')
  },
  // 下载中心
  {
    path: '/download',
    component: () => import('../pages/download'),
    meta: {
      noHeader: true
    }
  },
  // 意见反馈
  {
    path: '/feedback',
    component: () => import('../pages/feedback')
  },
  {
    path: '/email',
    meta: {
      noHeader: true,
    },
    component: () => import('../pages/common/email')
  },
  // //项目专栏
  // {
  //   path: '/ProgramTopics',
  //   component: ProgramTopics
  // },
  PersonalCenter,
  ...News,
  ...Score,
  ...Rules,
  ...Obs,
  {
    // 404路由，该路由配置请当道最后
    path: '*',
    component: NoPath
  }
]

/* const router = new VueRouter({
  mode: 'history',
  routes
})

router.openNewPage = function (location, current, append) {
  let { href } = router.resolve(location, current, append)
  if (href !== router.history.current.path) {
    window.open(href, '_blank')
  }
}
export default router */
export function createRouter() {
  const router = new VueRouter({
    mode: 'history',
    routes
  })

  router.openNewPage = function (location, current, append) {
    let { href } = router.resolve(location, current, append)
    if (href !== router.history.current.path) {
      window.open(href, '_blank')
    }
  }
  return router
}