export default {
  data() {
    return {
      alreadyOrder: [
        {
          title: '类型',
          width: 100,
          key: 'live_type_name',
          align: 'center',
        },
        {
          title: '赛事',
          align: 'center',
          key: 'match_type_name'
        },
        {
          title: '场次',
          align: 'center',
          slot: 'competition'
        },
        {
          title: '开始时间',
          key: 'matchTime',
          width: 150,
          align: 'center',
          slot: 'matchTime'
        },
        {
          title: '管理',
          key: 'operate',
          width: 100,
          align: 'center',
          slot: 'action'
        }
      ],
      orderCompetitionHeader: [
        {
          title: '时间',
          key: 'matchTime',
          slot: 'time',
          align: 'center',
          width: 150,
        },
        {
          title: '赛事',
          align: 'center',
          key: 'leagueName'
        },
        {
          title: '场次',
          key: 'competition',
          width: 350,
          align: 'center',
          slot: 'competition'
        },
        {
          title: '赛事状态',
          key: 'count',
          slot: 'count',
          align: 'center',
        },
        {
          title: '管理',
          key: 'operate',
          width: 80,
          align: 'center',
          slot: 'action'
        }
      ],
      recordHeader: [
        {
          title: '开播时间',
          align: 'center',
          key: 'start_date',
          slot: 'startDate'
        },
        {
          title: '结束时间',
          align: 'center',
          key: 'end_date',
          slot: 'endDate'
        },
        {
          title: '直播赛事',
          align: 'center',
          key: 'match_name'
        },
        {
          title: '直播时长',
          align: 'center',
          key: 'second',
          slot: 'second'
        },
        {
          title: '观看人数',
          align: 'center',
          slot: 'num'
        }
      ],
    }
  },
}