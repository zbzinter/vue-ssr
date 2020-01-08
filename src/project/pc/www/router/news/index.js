export default [
  {
    path: '/news',
    redirect: to => {
      return { path: '/news/187' }
    }
  },
  {
    path: '/news/:channelId',
    name:'news',
    component: () => import(/* webpackChunkName: "news" */'@pages/news/Index')
  },
  {
    path: '/news/:channelId/:articleId',
    name:'newsDetail',
    component: () => import(/* webpackChunkName: "news" */'@pages/news/NewsDetail')
  },
]