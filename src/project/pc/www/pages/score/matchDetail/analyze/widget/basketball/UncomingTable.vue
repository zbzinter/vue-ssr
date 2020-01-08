<!-- 未来赛事 -->
<template>
  <div class="integral-table">
    <div class="team-name">
      <span>{{ matchData[`${teamType}TeamName`] }}</span>
      <span
        v-if="getTransferArrData.length"
        class="desc"
      >(未来{{ getTransferArrData.length }}场)</span>
    </div>
    <Table
      :columns="columns"
      :data="getTransferArrData"
      size="small"
      border
      class="low-border"
    >
      <template
        slot="score"
        slot-scope="{ row }"
      >
        <div v-if="!row.hostTeamScore && !row.guestTeamScore">
          VS
        </div>
        <div v-else>
          <span>{{ row.hostTeamScore }}</span>
          <i>:</i>
          <span>{{ row.guestTeamScore }}</span>
        </div>
      </template>
    </Table>
  </div>
</template>
<script>
import { Decimal } from 'decimal.js'
import {Table} from 'iview'
import mixins from '../mixins'
export default {
  name: 'UncomingTable',
  components: {
    Table
  },
  mixins: [mixins],
  props: ['titles', 'tableData', 'teamType', 'type', 'matchData'],
  data(){
    return {
      rowTitle: ['总成绩', '主场', '客场']
    }
  },
  computed: {
    columns () {
      // 赛事	时间	客队	比分	主队	与本场相隔
      return [  
        {
          title: '赛事',
          key: 'leagueName',
          width: 100,
          ellipsis: true,
          tooltip: true,
          align: 'center',
          render: (h, {row})=>{
            return h('span', {
            }, this.format(row.leagueName))
          }
        },
        {
          title: '时间',
          key: 'matchTime',
          width: 90,
          align: 'center',
          render: (h, {row})=>{
            return h('span', {
            }, this.format(this.dayjs(row.matchTime).format('YYYY-MM-DD')))
          }
        },
        {
          title: '客队',
          key: 'guestTeamName',
          width: 80,
          ellipsis: true,
          tooltip: true,
          align: 'right',
          render: (h, {row})=>{
            return h('span', {
            }, this.format(row.guestTeamName))
          }
        },
        {
          title: '比分',
          key: 'lost',
          slot: 'score',
          align: 'center',
          width: 80
        },
        {
          title: '主队',
          key: 'hostTeamName',
          width: 80,
          ellipsis: true,
          tooltip: true,
          render: (h, {row})=>{
            return h('span', {
            }, this.format(row.guestTeamName))
          }
        },
        {
          title: '与本场相隔',
          className: 'red',
          key: 'timeInterval',
          ellipsis: true,
          tooltip: true,
          align: 'center',
          render: (h, {row})=>{
            return h('span', {
            }, this.format(row.timeInterval))
          }
        }
      ]
    },
    getTransferArrData () {
      return this.tableData || []
    }
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
@import '../../../Common/detail.scss';
/deep/ {
  .ivu-table-wrapper{
    .ivu-table-cell{
      padding-left: 8px;
      padding-right: 8px;
    }
  }
}
.team-name{
  font-weight: 600;
  width: 520px;
  text-align: center;
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: #3683FF;
  letter-spacing: 0;
  margin-bottom: 12px;
  span.desc{
    margin-left: 8px;
    vertical-align: text-bottom;
    display: inline-block;
    font-weight: normal;
    line-height: 22px;
    height: 22px;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #666666;
    letter-spacing: 0;
  }
}
</style>
