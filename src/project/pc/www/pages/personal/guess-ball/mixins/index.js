export default {
  data() {
    return {
      countdown: [
        {
          time: '2分钟',
          key: 2 * 60 * 1000,
        },
        {
          time: '5分钟',
          key: 5 * 60 * 1000,
        },
        {
          time: '10分钟',
          key: 10 * 60 * 1000,
        },
        {
          time: '15分钟',
          key: 15 * 60 * 1000,
        },
        {
          time: '30分钟',
          key: 30 * 60 * 1000,
        },
        {
          time: '40分钟',
          key: 40 * 60 * 1000,
        },
        {
          time: '60分钟',
          key: 60 * 60 * 1000,
        },
      ],

      guessBallHeader: [
        {
          title: '主题',
          key: 'theme',
          align: 'center',
        },
        {
          title: '选择',
          key: 'option',
          width: '130px',
          align: 'center',
        },
        {
          title: '参与球豆',
          key: 'beans',
          width: '85px',
          align: 'center',
        },
        {
          title: '下注时间',
          key: 'betting_time',
          align: 'center',
          width: '110px',
          slot: 'time'
        },
        {
          title: '参与人数',
          key: 'number_person',
          width: '85px',
          align: 'center',
        },
        {
          title: '结果',
          key: 'result',
          align: 'center',
          slot: 'result'
        },
        {
          title: '盈亏',
          key: 'profit_loss',
          align: 'center',
          width: '100px',
          slot: 'profitLoss'
        },
        {
          title: '发起方',
          key: 'anchor_nickname',
          align: 'center',
        },
      ],
      guessBallManageHeader: [
        {
          title: '主题',
          key: 'theme',
          align: 'center',
          className: 'br'
        },
        {
          title: '选项1',
          slot: 'optionA',
          align: 'center',
          className: 'option-a'
        },
        {
          title: '选项2',
          slot: 'optionB',
          align: 'center',
          className: 'option-b'
        },
        {
          title: '时间',
          slot: 'time',
          width: '130px',
          align: 'center',
        },
      ]

    }
  }
}