<!-- 技术统计table -->
<template>
  <div class="common-table">
    <div class="team-name">
      <span class="name">{{ matchData[`${teamType}TeamName`] }}</span>
    </div>
    <Table
      :columns="columns"
      :data="getTransferArrData"
      size="small"
      border
      class="low-border"
    />
  </div>
</template>
<script>
import { Decimal } from 'decimal.js'
import {Table} from 'iview'
import mixins from '../mixins.js'
export default {
  name: 'IntegralTable',
  components: {
    Table
  },
  mixins: [mixins],
  props: ['titles', 'tableData', 'teamType', 'matchData'],
  data(){
    return {
      rowTitle: ['总成绩', '主场', '客场'],
      tapeSize: 10
    }
  },
  computed: {
    isChangeTableData() {
      return !!Object.keys(this.tableData).length
    },
    isEmpty () {
      let isEmpty = true
      return !this.tableData.length
    },
    columns () {
      return [  
        {
          title: ' ',
          key: 'name',
          ellipsis: true,
          tooltip: true,
          align: 'center',
          render: (h, {row})=>{
            return h('span', {
            }, row.name)
          }
        },
        {
          title: '投篮命中率',
          key: 'goal',
          width: 75,
          ellipsis: true,
          tooltip: true,
          align: 'center',
          render: (h, {row})=>{
            return h('span', {
            }, this.format(this.transferRate(row.goal)))
          }
        },
        {
          title: '三分命中率',
          key: 'threePoint',
          width: 75,
          ellipsis: true,
          tooltip: true,
          align: 'center',
          render: (h, {row})=>{
            return h('span', {
            }, this.format(this.transferRate(row.threePoint)))
          }
        },
        {
          title: '平均篮板',
          key: 'rebound',
          width: 75,
          ellipsis: true,
          tooltip: true,
          align: 'center',
          render: (h, {row})=>{
            return h('span', {
            }, this.format(row.rebound, 1, true))
          }
        },
        {
          title: '平均助攻',
          className: 'red',
          key: 'assist',
          width:75,
          ellipsis: true,
          tooltip: true,
          align: 'center',
          render: (h, {row})=>{
            return h('span', {
            }, this.format(row.assist, 1, true))
          }
        },
        {
          title: '平均抢断',
          className: 'red',
          key: 'steal',
          width: 75,
          ellipsis: true,
          tooltip: true,
          align: 'center',
          render: (h, {row})=>{
            return h('span', {
            }, this.format(row.steal, 1, true))
          }
        },
        {
          title: '平均失误',
          className: 'red',
          key: 'turnover',
          width: 75,
          ellipsis: true,
          tooltip: true,
          align: 'center',
          render: (h, {row})=>{
            return h('span', {
            }, this.format(row.turnover, 1, true))
          }
        }
      ]
    },
    getTransferArrData(){
      return this.tableData || []
    }
  },
  methods: {
    transferRate(val) {
      return val ? `${new Decimal(val*100).toFixed(1)}%` : '-'
    }
  }
}
</script>
<style lang="postcss" scoped>
@import '../../../Common/detail.scss';
  .team-name{
    width: 520px;
    margin: 0 auto;
    margin-bottom: 12px;
    text-align: center;
    .name{
      font-weight: 600;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #3683FF;
      letter-spacing: 0;
      text-align: center;
    }
  }
  /deep/ {
    .ivu-table{
      .ivu-table-cell{
        padding-left: 6px;
        padding-right: 6px;
      }
    }
    .ivu-select{
      text-align: left;
      width: 76px !important;
      margin-left: 20px;
    }
  }
</style>
