<!-- 积分排名table -->
<template>
  <div class="integral-table">
    <Table
      :columns="columns"
      :data="getTransferArrData"
      size="small"
    />
  </div>
</template>
<script>
import { Decimal } from 'decimal.js'
import {Table} from 'iview'
export default {
  name: 'IntegralRankTable',
  components: {
    Table
  },
  props: ['titles', 'tableData'],
  data(){
    return {
      rowTitle: ['总', '主', '客'],
    }
  },
  computed: {
    columns () {
      return [  
        {
          title: '全场',
          key: 'name',
          width: 55
        },
        {
          title: '赛',
          key: 'count',
          width: 55
        },
        {
          title: '胜',
          key: 'win',
          width: 50
        },
        {
          title: '负',
          key: 'lost',
          width: 50
        },
        {
          title: '得',
          className: 'red',
          key: 'goal',
          width: 55,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '失',
          className: 'red',
          key: 'lostGoal',
          width: 55,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '净胜',
          className: 'red',
          key: 'goalDiff',
          width: 55,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '排名',
          key: 'rank',
          width: 70,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '胜率',
          key: 'winRate',
          ellipsis: true,
          tooltip: true
        },
      ]
    },
    getTransferArrData(){
      if (!Object.keys(this.tableData).length) return []
      let getTransferArrData = []
      for (let [index, item] of Object.entries(this.rowTitle)) {
        index = parseInt(index)
        getTransferArrData[index] = getTransferArrData[index] || {}
        getTransferArrData[index] = {
          name: item,
          count: this.getKey(index, 'Count'),
          win: this.getKey(index, 'Win'),
          lost: this.getKey(index, 'Lost'),
          goal: this.getKey(index, 'Goal'),
          lostGoal: this.getKey(index, 'LostGoal'),
          goalDiff: this.getKey(index, 'GoalDiff'),
          rank: this.getKey(index, 'Rank'),
          winRate: this.winRate(index)
        }
      }
      return getTransferArrData
    }
  },
  methods: {
    getKey(index, valKey){
      let key = index === 0 ? 'all' : index === 1 ? 'host' : 'guest'
      let val = this.tableData[`${key}${valKey}`]
      if(/^\d+\./.test(val)) val = (+val).toFixed(1)
      return val
    },
    winRate(index){
      let key = index === 0 ? 'all' : index === 1 ? 'host' : 'guest'
      return this.tableData[`${key}Count`] ? `${new Decimal(this.tableData[`${key}Win`]*100).dividedBy(this.tableData[`${key}Count`]).toFixed(1)}%` : '-'
    }
  }
}
</script>
<style lang="postcss" scoped>

.integral-table{
  /deep/ {
    .ivu-table{
      th{
        background-color: transparent;
        span{
          font-weight: normal;
          color: #888
        }
      }
      .ivu-table-cell{
        padding-left: 12px;
        padding-right: 0;
      }
      .ivu-table-row{
        font-weight: 600;
      }
      tr{
        td:nth-of-type(1), th:nth-of-type(1){
          .ivu-table-cell{
            padding-left: 18px;
          }
        }
        td{
          &.red{
            color: #E15756
          }
        }
      }
    }
  }
}
@import '../../../Common/detail.scss'
</style>
