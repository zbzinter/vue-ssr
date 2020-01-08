export default {
  data() {
    return {
      header: [
        {
          title: '收到时间',
          align: 'center',
          slot: 'time'
        },
        {
          title: '礼物种类',
          align: 'center',
          key: 'remark'
        },
        {
          title: '礼物数量',
          align: 'center',
          key: 'goods_count'
        },
        {
          title: '赠送者',
          align: 'center',
          key: 'send_name'
        },
        {
          title: '礼物价值',
          align: 'center',
          slot: 'totalGoodsPrice'
        },
      ],
    }
  }
}