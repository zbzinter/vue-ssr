let footballUrl='/score/detail/football/'
let basketballUrl='/score/detail/basketball/'
export default (matchId)=> {
  return {
    'football': [
      {
        name: '数据分析',
        url: `${footballUrl}analyze/${matchId}`,
      },
      {
        name: '主流欧赔',
        url: `${footballUrl}ouzhi/${matchId}`,
      },
      {
        name: '亚盘指数',
        url: `${footballUrl}yapan/${matchId}`,
      },
      {
        name: '大小指数',
        url: `${footballUrl}dx/${matchId}`,
      },
      {
        name: '三合一',
        url: `${footballUrl}three/${matchId}`,
      },
      {
        name: '比赛直播',
        url: `/live/detail?id=${matchId}`,
        key: 'live'
      }
    ],
    'basketball': [
      {
        name: '数据分析',
        url: `${basketballUrl}analyze/${matchId}`,
      },
      {
        name: '欧指指数',
        url: `${basketballUrl}ouzhi/${matchId}`,
      },
      {
        name: '让分',
        url: `${basketballUrl}yapan/${matchId}`,
      },
      {
        name: '总分',
        url: `${basketballUrl}dx/${matchId}`,
      },
      {
        name: '技术统计',
        url: `/live/detail?id=${matchId}`,
        key: 'live'
      }
    ]
  }
}