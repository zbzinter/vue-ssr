export default {
  data() {
    return {
      managerHeader: [
        {
          title: '用户id',
          key: 'uid',
          align: 'center',
        },
        {
          title: '管理员用户帐号',
          key: 'user_nikename',
          align: 'center',
        },
        {
          title: '任命时间',
          align: 'center',
          slot: 'time'
        },
        {
          title: '操作',
          width: 150,
          align: 'center',
          slot: 'operate'
        }
      ],
      listHeader: [
        {
          title: '禁言用户账号',
          align: 'center',
          key: 'uid_nickname'
        },
        {
          title: '禁言时间',
          align: 'center',
          slot: 'time'
        },
        {
          title: '创建时间',
          align: 'center',
          slot: 'createdTime'
        },
        {
          title: '操作人',
          align: 'center',
          key: 'roommanager_nickname'
        },
        {
          title: '操作',
          width: 150,
          align: 'center',
          slot: 'operate'
        }
      ],
      times: [
        {
          time: '1分钟',
          value: 1 * 60
        },
        {
          time: '3分钟',
          value: 3 * 60
        },
        {
          time: '5分钟',
          value: 5 * 60
        },
        {
          time: '10分钟',
          value: 10 * 60
        },
        {
          time: '15分钟',
          value: 15 * 60
        },
        {
          time: '30分钟',
          value: 30 * 60
        },
        {
          time: '1小时',
          value: 60 * 60
        },
        {
          time: '2小时',
          value: 120 * 60
        },
        {
          time: '3小时',
          value: 180 * 60
        },
        {
          time: '1天',
          value: 24 * 60 * 60
        },
      ]
    }
  },
}