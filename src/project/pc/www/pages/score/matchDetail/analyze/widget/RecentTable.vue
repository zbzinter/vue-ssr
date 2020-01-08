<!-- 近期战绩table -->
<template>
  <div :class="['recent-inner', {'no-empty': setRecentData.length}]">
    <Table
      :columns="columns"
      :data="getTransferArrData"
      size="small"
    >
      <template
        slot="hostTeamName"
        slot-scope="{ row }"
      >
        <div :class="['host-team', selfId===row.hostTeamId && (row.hostTeamNormalScore>row.guestTeamNormalScore ? 'red' : row.hostTeamNormalScore<row.guestTeamNormalScore ? 'green' : '')]">
          <div class="ellipsis">
            {{ row.hostTeamName || '-' }}
          </div>
        </div>
      </template>
      <template
        slot="score"
        slot-scope="{ row }"
      >
        <div class="score">
          <div><span>{{ row.hostTeamNormalScore }}</span><i>:</i><span>{{ row.guestTeamNormalScore }}</span></div>
        </div>
      </template>
      <template
        slot="guestTeamName"
        slot-scope="{ row }"
      >
        <div :class="['guest-team', selfId===row.guestTeamId && (row.guestTeamNormalScore>row.hostTeamNormalScore ? 'red' : row.guestTeamNormalScore<row.hostTeamNormalScore ? 'green' : '')]">
          <div class="ellipsis">
            {{ row.guestTeamName || '-' }}
          </div>
        </div>
      </template>
    </Table>
    <div
      v-if="setRecentData.length"
      class="bottom-info"
    >
      <div class="progress">
        <ul class="percent-left">
          <li
            v-for="(item, index, ind) in matchOnce"
            :key="index"
          >
            <i-circle
              :percent="setRecentData.length ? item*100/setRecentData.length : 0"
              :size="58"
              :stroke-color="color[ind]"
            >
              <span class="num">{{ item }}</span>
              <span>{{ text1[ind] }}</span>
            </i-circle>
          </li>
        </ul>
        <ul class="percent-right">
          <li>
            <i-circle
              :percent="parseFloat(setRate.winRate)"
              :size="58"
              :stroke-color="color[3]"
            >
              <span class="num">{{ setRate.winRate }}</span>
              <span>{{ text2[0] }}</span>
            </i-circle>
          </li>
          <li>
            <i-circle
              :percent="parseFloat(setRate.victory)"
              :size="58"
              :stroke-color="color[3]"
            >
              <span class="num">{{ setRate.victory }}</span>
              <span>{{ text2[1] }}</span>
            </i-circle>
          </li>
          <li>
            <i-circle
              :percent="parseFloat(setRate.largeRate)"
              :size="58"
              :stroke-color="color[3]"
            >
              <span class="num">{{ setRate.largeRate }}</span>
              <span>{{ text2[2] }}</span>
            </i-circle>
          </li>
        </ul>
      </div>
      <p class="statistics">
        <span class="notmr"><span class="ellipsis">{{ type === 'Host' ? matchData.hostTeamName : matchData.guestTeamName }}</span>：近<i>{{ size }}</i>场战绩</span>
        <span class="red"><i>{{ matchOnce.win }}</i>胜</span>
        <span class="blue"><i>{{ matchOnce.flat }}</i>平</span>
        <span class="green mr"><i>{{ matchOnce.loser }}</i>负</span>
        <span><i class="">得</i><i>{{ getAndLostBall.getHost }}</i>球</span>
        <span class="notmr"><i class="">失</i><i>{{ getAndLostBall.loseHost }}</i>球; </span>
        <span class="notmr">胜率<i class="red">{{ setRate.winRate }}</i>; </span>
        <span class="notmr">赢盘率<i class="red">{{ setRate.victory }}</i>; </span>
        <span class="notmr">大球率<i class="red">{{ setRate.largeRate }}</i>; </span>
      </p>
    </div>
  </div>
</template>

<script>
import {
  Circle,
  Table
} from 'iview'
import { Decimal } from 'decimal.js'
import mixins from './mixins'
export default {
  name: 'RecentTable',
  components: {
    'i-circle': Circle,
    Table
  },
  mixins: [mixins],
  props: [
    'selfId',
    'titles',
    'matchData',
    'recentData',
    'size',
    'type'
  ],
  data () {
    return {
      text1: ['胜', '平', '输'],
      text2: ['胜率', '赢盘率', '大球率'],
      color: ['#F06151', '#80A963', '#979797', '#3683FF'],
      getAndLostBall: {
        getHost: 0,
        getGuest: 0,
        loseHost: 0,
        loseGuest: 0,
      }
    }
  },
  computed: {
    columns () {
      return [  
        {
          title: '赛事',
          key: 'leagueName',
          width: 80,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '比赛日期',
          key: 'matchTime',
          width: 90,
          align: 'center',
          render: (h, {row})=>{
            return h('span', {
            }, this.format(this.dayjs(row.matchTime).format('YYYY-MM-DD')))
          }
        },
        {
          title: '主队',
          slot: 'hostTeamName',
          width: 80,
          ellipsis: true,
          tooltip: true,
          align: 'right'
        },
        {
          title: '比分',
          slot: 'score',
          className: 'score-diff',
          minWidth: 50,
          align: 'center'
        },
        {
          title: '客队',
          slot: 'guestTeamName',
          width: 80,
          ellipsis: true,
          tooltip: true,
          align: 'left'
        },
        {
          title: '半场',
          minWidth: 50,
          ellipsis: true,
          tooltip: true,
          align: 'center',
          render: (h, {row})=>{
            return h('span', {
            }, `${row.hostTeamHalfScore}:${row.guestTeamHalfScore}`)
          }
        },
        {
          title: '胜负',
          key: 'winLosDesc',
          minWidth: 45,
          ellipsis: true,
          tooltip: true,
          align: 'center',
          render: (h, {row})=>{
            return h('span', {
              class: row.winLos
            }, this.format(row.winLosDesc))
          }
        },
        {
          title: '盘路',
          minWidth: 45,
          key: 'tapeDesc',
          ellipsis: true,
          tooltip: true,
          align: 'center',
          render: (h, {row})=>{
            return h('span', {
              class: row.tape
            }, this.format(row.tapeDesc))
          }
        },
        {
          title: '大小',
          minWidth: 45,
          key: 'dxDesc',
          ellipsis: true,
          tooltip: true,
          align: 'center',
          render: (h, {row})=>{
            return h('span', {
              class: row.dx
            }, this.format(row.dxDesc))
          }
        },
      ]
    },
    getTransferArrData(){
      Array.isArray(this.recentData.matches) && this.recentData.matches.forEach(item => {
        if(!item.asiaRateStr) item.asiaRateStr = '-'
        this.addItem({item, teamId: this.selfId, sportType: 'football', isAllFiled: true})
      })
      return this.recentData.matches || []
    },
    setRecentData(){
      this.getRate(this.recentData, this.selfId, this.type.toLocaleLowerCase())
      return this.recentData.matches || []
    },
    matchOnce(){
      let win = []
      let loser = []
      let flat = []
      this.setRecentData.forEach(item => {
        if(this.selfId===item.hostTeamId){
          item.hostTeamNormalScore>item.guestTeamNormalScore ? win.push(item) :
            item.hostTeamNormalScore<item.guestTeamNormalScore ? loser.push(item) : 
              flat.push(item)
        } else if(this.selfId===item.guestTeamId){
          item.guestTeamNormalScore>item.hostTeamNormalScore ? win.push(item) :
            item.guestTeamNormalScore<item.hostTeamNormalScore ? loser.push(item) : 
              flat.push(item)
        }
      })
      return {
        win: win.length,
        flat: flat.length,
        loser: loser.length
      }
    },
    setRate () {
      return this.getTapeRate({data: this.getTransferArrData, teamId: this.selfId, isAllFiled: true, sportId: 'football'})
    }
  },
  created () {
    this.init()
  },
  mounted () {
  },
  methods: {
    init() {
    },
    getRate(data, teamId, type = 'host') { // 赢盘率、胜率、得球、失球、大球率
      let hasAsiaRateArr = [] // 有asiaRate的item 数组
      let hasDxRateArr = [] // 有dxRate的item 数组
      let victory = [] // 分差大于asiaRate的数组
      let winNumArr = []
      this.getAndLostBall.getHost = 0
      this.getAndLostBall.loseHost = 0
      if(!data.matches) return
      data.matches.forEach(item => {
        let isAsiaRate = !!item.asiaRate || item.asiaRate === 0
        let isDxRate = !!item.dxRate || item.dxRate === 0
        if (isAsiaRate) hasAsiaRateArr.push(item)
        if (isDxRate) hasDxRateArr.push(item)
        if (type === 'host') {
          if (teamId === item.hostTeamId) {
            if ((item.hostTeamNormalScore - item.asiaRate > item.guestTeamNormalScore) && isAsiaRate) victory.push(item)
            if (item.hostTeamNormalScore - item.guestTeamNormalScore > 0) {
              winNumArr.push(item)
            } 
            this.getAndLostBall.getHost += item.hostTeamNormalScore
            this.getAndLostBall.loseHost += item.guestTeamNormalScore
          } else if (teamId === item.guestTeamId) {
            if ((item.guestTeamNormalScore + item.asiaRate > item.hostTeamNormalScore) && isAsiaRate) victory.push(item)
            if (item.guestTeamNormalScore - item.hostTeamNormalScore > 0) {
              winNumArr.push(item)
            }
            this.getAndLostBall.getHost += item.guestTeamNormalScore
            this.getAndLostBall.loseHost += item.hostTeamNormalScore
          }
        } else if (type === 'guest') {
          if (teamId === item.guestTeamId) {
            if ((item.guestTeamNormalScore + item.asiaRate > item.hostTeamNormalScore) && isAsiaRate) victory.push(item)
            if (item.guestTeamNormalScore - item.hostTeamNormalScore > 0) {
              winNumArr.push(item)
            }
            this.getAndLostBall.getHost += item.guestTeamNormalScore
            this.getAndLostBall.loseHost += item.hostTeamNormalScore
          } else if (teamId === item.hostTeamId) {
            if ((item.hostTeamNormalScore - item.asiaRate > item.guestTeamNormalScore) && isAsiaRate) victory.push(item)
            if (item.hostTeamNormalScore - item.guestTeamNormalScore > 0) {
              winNumArr.push(item)
            }
            this.getAndLostBall.getHost += item.hostTeamNormalScore
            this.getAndLostBall.loseHost += item.guestTeamNormalScore
          }           
        }
      })
    },
  }
}
</script>

<style scoped lang="scss">
@import '../../Common/detail.scss';
.ellipsis{
		overflow: hidden;
		text-overflow: ellipsis;
    white-space: nowrap;
};
  .red{
    color: #F06151 !important;
  }
  .blue{
    color: #3683FF !important;

  }
  .green{
    color: $green;
  }
  i{
    font-style: normal
  }
  table.recent-table{
    width: 100%;
    thead{
      th{
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #666666;
        letter-spacing: 0;
        text-align: left;
        width: 130px;
        height: 42px;
        line-height: 42px;
        background: #FAFAFA;
        &:nth-of-type(1){
          padding-left: 14px;
          border-radius: 31px 0 0 31px;
        }
        &:nth-last-of-type(1){
          border-radius: 0 31px 31px 0;
        }
        &:nth-of-type(3){
          text-align: right;
          padding-right: 24px;
        }
      }
    }
    tbody{
      tr{
        &:nth-of-type(1){
          td>div{
            margin-top: 30px;
          }
        }
        &:not(:last-child){
          td>div{
            padding-bottom: 29px;
          }
        }
      td{
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #333333;
          letter-spacing: 0;
          &.host-team div,&.guest-team div{
              @extend .ellipsis;
              max-width:90px;
              padding-right: 4px;
              font-weight: 600;
          }
          &:nth-of-type(1){
            padding-left: 14px;
            letter-spacing: 0;
            div{
              max-width: 65px;
              padding-right:4px;
            }
          }
          &:nth-of-type(3){
            div{
              text-align: right;
              padding-right: 0;
              margin-right: 24px;
            }
          }
          &:nth-of-type(2) div{
            width: 68px;
          }
          &:nth-of-type(4) div{
            max-width: 60px;
          }
          &.same div{
            max-width: 45px;
            padding-right: 4px;
          }
          &.same.score div{
            max-width: 70px;
          }
        }
      }
    }
  }
  .progress{
    overflow: hidden;
  }
  .statistics{
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #848484;
    letter-spacing: 0;
    white-space: nowrap;
    span{
      display:inline-block;
      vertical-align:middle;
      &:not(.notmr){
        margin-right: 6px;
      }
      &.ellipsis{
        max-width: 85px;
        display:inline-block
      }
    }
  }
  .recent-inner.no-empty{
    padding-bottom: 134px;
  }
  .bottom-info{
    position: absolute;
    padding: 24px 0 0 14px;
    bottom: 20px;
    width: 574px;
  }
  .percent-left, .percent-right{
      height: 58px;
      width: 50%;
      margin-top: 30px;
      margin-bottom: 25px;
      li{
        display: inline-block;
        span{
          display: block;
          line-height: 17px;
          font-size: 12px;
          color: #333333;
          &.num{
            font-family: PingFangSC-Semibold;
            font-weight: 600;
          }
        }
      }
      &.percent-left{
        float: left;
        li{
          margin-right: 20px;
        }
      }
      &.percent-right{
        float: right; 
        text-align: right;
        li{
          margin-left: 20px;
        }
      }
    }
  /deep/ {
    .ivu-table-cell{
      padding-left: 8px;
      padding-right: 8px;
    }
  }
</style>
