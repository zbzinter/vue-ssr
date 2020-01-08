export default [

  {
    path: '/rules/exchange-income',
    component: () =>
      import(/* webpackChunkName: "rules" */ '@pages/rules/exchange-income')
  },
  {
    path: '/rules/anchor-manage',
    component: () =>
      import(/* webpackChunkName: "rules" */ '@pages/rules/anchor-manage')
  },
  {
    path: '/rules/recharge-service',
    component: () =>
      import(/* webpackChunkName: "rules" */ '@pages/rules/recharge-service')
  },
  {
    path: '/rules/privacy-policy',
    component: () =>
      import(/* webpackChunkName: "rules" */ '@pages/rules/privacy-policy')
  },
  {
    path: '/rules/service-agreement',
    component: () =>
      import(/* webpackChunkName: "rules" */ '@pages/rules/service-agreement')
  },
  {
    path: '/rules/software-license',
    component: () =>
      import(/* webpackChunkName: "rules" */ '@pages/rules/software-license')
  },
  {
    path: '/rules/user-policy',
    component: () =>
      import(/* webpackChunkName: "rules" */ '@pages/rules/user-policy')
  },
  {
    path: '/rules/guess-ball',
    component: () => import(/* webpackChunkName: "rules" */ '@pages/rules/guess-ball')
  },
]