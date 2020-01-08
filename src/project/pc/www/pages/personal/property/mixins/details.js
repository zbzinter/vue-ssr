export default {
  data() {
    return {
      header: [
        {
          title: '流水号',
          align: 'center',
          slot: 'id'
        },
        {
          title: '交易类型',
          align: 'center',
          slot: 'type'
        },
        {
          title: '存入',
          align: 'center',
          slot: 'deposit'
        },
        {
          title: '支出',
          align: 'center',
          slot: 'expend'
        },
        {
          title: '余额',
          align: 'center',
          key: 'total'
        },
        {
          title: '备注',
          align: 'center',
          slot: 'remark'
        },
        {
          title: '状态',
          align: 'center',
          slot: 'status'
        },
        {
          title: '日期',
          align: 'center',
          slot: 'time',
          width: '160px'
        },
      ],
      headerRecord: [
        {
          title: '流水号',
          align: 'center',
          key: 'id'
        },
        {
          title: '提取时间',
          align: 'center',
          slot: 'time'
        },
        {
          title: '提取金额',
          align: 'center',
          key: 'money'
        },
        {
          title: '支付宝账号',
          align: 'center',
          key: 'bank_username'
        },
        {
          title: '状态',
          align: 'center',
          slot: 'status'
        },
        {
          title: '到账日期',
          align: 'center',
          slot: 'recTime'
        },
      ],
    }
  }
}