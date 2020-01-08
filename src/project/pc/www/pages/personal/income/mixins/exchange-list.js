export default {
  data() {
    return {
      header: [
        {
          title: '兑换时间',
          align: 'center',
          slot: 'time'
        },
        {
          title: '兑换订单号',
          align: 'center',
          key: 'cashout_sn',
          width: '220px'
        },
        {
          title: '提现金额（元）',
          align: 'center',
          key: 'money',
        },
        {
          title: '审核状态',
          align: 'center',
          slot: 'auditStatus'
        },
        {
          title: '提现状态',
          align: 'center',
          slot: 'withdrawStatus'
        },
      ],
    }
  }
}