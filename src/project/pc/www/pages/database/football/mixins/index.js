export default {
  data() {
    return {
      menu: [
        {
          id: 1,
          title: '热门赛事',
          subName: '热门',
          i: ''
        },
        // {
        //   id: 2,
        //   title: '特别关注',
        //   subName: '关注'
        // },
        {
          id: 3,
          title: '国际赛事',
          subName: '国际'
        },
        {
          id: 4,
          title: '欧洲',
          subName: '欧洲',
          competitionAndCountry: [
            '欧洲国家', '欧洲赛事'
          ],
        },
        {
          id: 5,
          title: '亚洲',
          subName: '亚洲',
          competitionAndCountry: [
            '亚洲国家', '亚洲赛事'
          ],
        },
        {
          id: 6,
          title: '美洲',
          subName: '美洲',
          competitionAndCountry: [
            '美洲国家', '美洲赛事'
          ],
        },
        {
          id: 7,
          title: '非洲',
          subName: '非洲',
          competitionAndCountry: [
            '非洲国家', '非洲赛事'
          ],
        },
        {
          id: 8,
          title: '大洋洲',
          subName: '大洋洲',
          competitionAndCountry: [
            '大洋洲国家', '大洋洲赛事'
          ],
        },
      ],
      result: [
        {
          title: '轮次',
          key: 'leagueName',
          align: 'center',
        },
        {
          title: '时间',
          align: 'center',
          slot: 'competition'
        },
        {
          title: '主队',
          key: 'matchTime',
          align: 'center',
          slot: 'matchTime'
        },
        {
          title: '比分(半场)',
          key: 'operate',
          align: 'center',
          slot: 'action'
        },
        {
          title: '客队',
          key: 'operate',
          align: 'center',
          slot: 'action'
        },
        {
          title: '亚盘',
          key: 'operate',
          align: 'center',
          slot: 'action'
        },
        {
          title: '大小盘',
          key: 'operate',
          align: 'center',
          slot: 'action'
        },
        {
          title: '分析',
          key: 'operate',
          align: 'center',
          slot: 'analyze'
        }
      ],
      score: [
        {
          title: '排名',
          key: 'rank',
          align: 'center',
        },
        {
          title: '球队',
          key: 'teamName',
          width: '120',
          align: 'center',
        },
        {
          title: '场次',
          key: 'totalNum',
          align: 'center',
        },
        {
          title: '胜',
          key: 'winNum',
          className: 'win-column',
          width: '40',
          align: 'center',
        },
        {
          title: '平',
          key: 'drawNum',
          width: '40',
          align: 'center',
        },
        {
          title: '负',
          key: 'loseNum',
          className: 'lose-column',
          width: '40',
          align: 'center',
        },
        {
          title: '进球',
          key: 'goals',
          align: 'center',
        },
        {
          title: '失球',
          key: 'loseGoals',
          align: 'center',
        },
        {
          title: '净胜球',
          align: 'center',
          slot: 'win'
        },
        {
          title: '场均进球',
          align: 'center',
          slot: 'goalAvg'
        },
        {
          title: '场均失球',
          align: 'center',
          slot: 'loseAvg'
        },
        {
          title: '场均净胜',
          key: 'winRate',
          align: 'center',
          slot: 'winRate'
        },
        {
          title: '积分',
          key: 'score',
          align: 'center',
        },
      ],
      resultHeader: [
        {
          title: '轮次',
          align: 'center',
          slot: 'name'
        },
        {
          title: '时间',
          key: 'matchTime',
          align: 'center',
          width: '120',
          slot: 'matchTime'
        },
        {
          title: '主队',
          align: 'right',
          slot: 'hostTeam'
        },
        {
          title: '比分',
          align: 'center',
          width: '50',
          slot: 'score'
        },
        {
          title: '客队',
          align: 'left',
          slot: 'guestTeam'
        },
        {
          title: '亚盘',
          width: '70',
          align: 'center',
          slot: 'asiaRateStr'
        },
        {
          title: '大小盘',
          width: '80',
          align: 'center',
          slot: 'dxRateStr',
        },
        {
          title: '分析',
          width: '70',
          align: 'center',
          slot: 'analyze'
        },
      ],
    }
  },
}