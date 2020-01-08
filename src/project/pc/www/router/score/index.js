export default [
  {
    path: '/score/detail/football/',
    name: 'footballDetail',
    component: () => import('@pages/score/matchDetail'),
    children: [
      {
        path: 'analyze/:matchId',
        component: () => import('@pages/score/matchDetail/analyze/football'),
      },
      {
        path: 'ouzhi/:matchId',
        component: () => import('@pages/score/matchDetail/ouzhi/football'),
      },
      {
        path: 'yapan/:matchId',
        component: () => import('@pages/score/matchDetail/yapan/football'),
      },
      {
        path: 'dx/:matchId',
        component: () => import('@pages/score/matchDetail/dx/football'),
      },
      {
        path: 'three/:matchId',
        component: () => import('@pages/score/matchDetail/three/football'),
      }
    ]
  },
  {
    path: '/score/detail/football/zhishu/:matchId',
    component: () => import('@pages/score/matchDetail/Common/FootballZhishuDetail')
  },
  {
    path: '/score/detail/basketball/zhishu/:matchId',
    component: () => import('@pages/score/matchDetail/Common/ZhishuDetail')
  },
  {
    path: '/score/detail/basketball/',
    name: 'basketballDetail',
    component: () => import('@pages/score/matchDetail'),
    children: [
      {
        path: 'analyze/:matchId',
        component: () => import('@pages/score/matchDetail/analyze/basketball'),
      },
      {
        path: 'ouzhi/:matchId',
        component: () => import('@pages/score/matchDetail/ouzhi/basketball'),
      },
      {
        path: 'yapan/:matchId',
        component: () => import('@pages/score/matchDetail/yapan/basketball'),
      },
      {
        path: 'dx/:matchId',
        component: () => import('@pages/score/matchDetail/dx/basketball'),
      }
    ]
  },
]