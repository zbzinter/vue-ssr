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
  name: 'IntegralTable',
  components: {
    Table
  },
  props: ['titles', 'tableData', 'index', 'type', 'matchData'],
  data(){
    return {
      rowTitle: ['总成绩', '主场', '客场']
    }
  },
  computed: {
    columns () {
      return [  
        {
          title: '全场',
          key: 'name',
          width: 72
        },
        {
          title: '比赛',
          key: 'count',
          width: 48,
          align: 'center'
        },
        {
          title: '胜',
          key: 'win',
          width: 48,
          align: 'center'
        },
        {
          title: '平',
          key: 'draw',
          width: 48,
          align: 'center'
        },
        {
          title: '负',
          key: 'lost',
          width: 48,
          align: 'center'
        },
        {
          title: '得',
          className: 'red',
          key: 'goal',
          width: 48,
          ellipsis: true,
          tooltip: true,
          align: 'center'
        },
        {
          title: '失',
          className: 'red',
          key: 'lostGoal',
          width: 48,
          ellipsis: true,
          tooltip: true,
          align: 'center'
        },
        {
          title: '净胜',
          className: 'red',
          key: 'goalDiff',
          width: 48,
          ellipsis: true,
          tooltip: true,
          align: 'center'
        },
        {
          title: '积分',
          className: 'red',
          key: 'point',
          width: 48,
          ellipsis: true,
          tooltip: true,
          align: 'center'
        },
        {
          title: '排名',
          key: 'rank',
          width: 48,
          ellipsis: true,
          tooltip: true,
          align: 'center'
        },
        {
          title: '胜率',
          key: 'winRate',
          ellipsis: true,
          tooltip: true,
          align: 'center'
        },
      ]
    },
    getTransferArrData(){
      if (!Object.keys(this.tableData).length || (!this.tableData.all && !this.tableData.guest && !this.tableData.host)) return []
      let {getKey, winRate} = this
      let getTransferArrData = []
      for (let [index, item] of Object.entries(this.rowTitle)) {
        index = parseInt(index)
        getTransferArrData[index] = getTransferArrData[index] || {}
        getTransferArrData[index] = {
          name: item,
          count: getKey(index).matchCount,
          win: getKey(index).win,
          draw: getKey(index).draw,
          lost: getKey(index).lost,
          goal: getKey(index).goal,
          lostGoal: getKey(index).lostGoal,
          goalDiff: (getKey(index).goal - getKey(index).lostGoal) ? (getKey(index).goal - getKey(index).lostGoal) : '',
          point: getKey(index).point,
          rank: getKey(index).teamRank,
          winRate: winRate(getKey(index))
        }
      }
      return getTransferArrData
    },
    isChangeTableData() {
      return !!Object.keys(this.tableData).length
    },
    isEmpty () {
      let isEmpty = true
      for (const [key, item] of Object.entries(this.tableData)) {
        if (Array.isArray(item) && item.length) isEmpty = false
      }
      return isEmpty
    }
  },
  methods: {
    getKey(index){
      let key = index === 0 ? 'all' : index === 1 ? 'host' : 'guest'
      let teamId = this.index === 'host' ? this.matchData.hostTeamId : this.index === 'guest' ? this.matchData.guestTeamId : ''
      let Obj = this.tableData[key] && this.tableData[key].find(item => item.teamId === teamId)
      return Obj ? Obj : {}
    },
    winRate(item){
      let total = item.win + item.draw + item.lost
      return total ? `${new Decimal(item.win*100).dividedBy(total).toFixed(2)}%` : '-'
    }
  }
}
</script>
<style lang="postcss" scoped>
@import '../../Common/detail.scss';
  /deep/ {
    tr{
      td:not(:first-child), th:not(:first-child){
        .ivu-table-cell{
          padding-left: 8px;
          padding-right: 8px;
        }
      }
    }

  }
</style>
