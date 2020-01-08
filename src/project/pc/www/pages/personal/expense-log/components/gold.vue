<template>
  <div class="gold">
    <DatePicker
      type="month"
      placeholder="选择日期"
      style="width: 100px"
      class="c-test-input"
      :value="currentDate"
    />
    <div class="content">
      <Table
        :columns="columns1"
        :data="data1"
      />
    </div>
  </div>
</template>
<script>
import { DatePicker, Table } from 'iview'
import dayjs from 'dayjs'

export default {
  components: {
    DatePicker,
    Table
  },
  data() {
    return {
      // 当前时间
      currentDate: '',
      columns1: [
        {
          title: '消费时间',
          key: 'a1'
        },
        {
          title: '消费类型',
          key: 'a2'
        },
        {
          title: '赠送主播',
          key: 'a3'
        },
        {
          title: '单价（金币）',
          key: 'a4'
        },
        {
          title: '数量',
          key: 'a5'
        },
        {
          title: '总支付（金币）',
          key: 'a6'
        }
      ],
      data1: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.currentDate = dayjs().format('YYYY-MM')
    },
  }
}
</script>
<style lang="postcss" scoped>
.gold {
  min-height: 500px;
  .content {
    padding-top: 30px;
  }
}
</style>


