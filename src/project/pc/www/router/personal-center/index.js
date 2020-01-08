export default {
  path: '/personal',
  component: () => import( /* webpackChunkName: "personal" */ '@pages/personal'),
  children: [
    {
      path: 'basic-data',
      component: () => import(/* webpackChunkName: "personal" */ '@pages/personal/basic-data')
    },
    {
      path: 'vip',
      component: () => import(/* webpackChunkName: "personal" */ '@pages/personal/vip')
    },
    // {
    //   path: 'wallet',
    //   component: () => import('@pages/personal/wallet')
    // },
    {
      path: 'follow',
      component: () => import(/* webpackChunkName: "personal" */ '@pages/personal/follow')
    },
    {
      path: 'message',
      component: () => import(/* webpackChunkName: "personal" */ '@pages/personal/message')
    },
    {
      path: 'expense-log',
      component: () => import(/* webpackChunkName: "personal" */ '@pages/personal/expense-log')
    },
    {
      path: 'identity',
      component: () => import(/* webpackChunkName: "personal" */ '@pages/personal/identity')
    },
    {
      path: 'set',
      component: () => import(/* webpackChunkName: "personal" */ '@pages/personal/set')
    },
    {
      path: 'set-simple',
      component: () => import(/* webpackChunkName: "personal" */ '@pages/personal/set-simple')
    },
    {
      path: 'private',
      component: () => import(/* webpackChunkName: "personal" */ '@pages/personal/private')
    },
    {
      path: 'guess-ball',
      component: () => import(/* webpackChunkName: "personal" */ '@pages/personal/guess-ball/my')
    },
    {
      path: 'guess-ball-manage',
      component: () => import(/* webpackChunkName: "personal" */ '@pages/personal/guess-ball/manage')
    },
    {
      path: 'property',
      redirect: 'property/index',
      component: () => import(/* webpackChunkName: "personal" */ '@pages/personal/property'),
      children: [
        {
          path: 'index',
          component: () => import(/* webpackChunkName: "personal" */ '@pages/personal/property/property.vue')
        },
        {
          path: 'details',
          component: () => import(/* webpackChunkName: "personal" */ '@pages/personal/property/diamond-beans-details.vue')
        },
        {
          path: 'withdraw/details',
          component: () => import(/* webpackChunkName: "personal" */ '@pages/personal/property/withdraw-beans.vue')
        },
        {
          path: 'withdraw',
          component: () => import(/* webpackChunkName: "personal" */ '@pages/personal/property/withdraw-bindalipay-beans.vue')
        },
      ]
    },
    {
      path: 'income',
      component: () => import(/* webpackChunkName: "personal" */ '@pages/personal/income')
    },
    {
      path: 'rooms-manage',
      component: () => import(/* webpackChunkName: "personal" */ '@pages/personal/rooms')
    }, {
      path: 'live-history',
      component: () => import(/* webpackChunkName: "personal" */ '@pages/personal/live-history')
    },
  ]
}