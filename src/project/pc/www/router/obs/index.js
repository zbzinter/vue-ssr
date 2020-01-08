export default [
  {
    path: '/obs/flag',
    meta: {
      noHeader: true,
    },
    component: () => import('@pages/obs/competition')
  },
  {
    path: '/obs-msg',
    meta: {
      noHeader: true,
    },
    component: () => import('@pages/obs/msg')
  },
  // 给直播助手用的聊天室
  {
    path: '/obs-chat',
    name: 'obs-chat',
    meta: {
      noHeader: true,
    },
    component: () => import('@pages/live/obs-chat')
  },
  // 视频
  {
    path: '/obs-video',
    name: 'obs-video',
    meta: {
      noHeader: true,
    },
    component: () => import('@pages/obs/video')
  },
]