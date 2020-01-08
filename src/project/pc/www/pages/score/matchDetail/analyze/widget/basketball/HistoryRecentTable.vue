<!-- 历史交锋、近期战绩 -->
<template>
  <div class="history-inner">
    <div class="filter">
      <span
        v-if="type!== 'history'"
        class="name"
      >{{ teamName }}</span>
      <Select
        v-model="historySize"
        size="small"
        style="width:100px"
      >
        <Option
          v-for="item in fieldTimeArr"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </Option>
      </Select>
      <i-button
        v-if="type == 'history'"
        :class="['fr', {active: historyFixed}]"
        type="text"
        @click="historyAll(true)"
      >
        主客相同
      </i-button>
      <i-button
        v-if="type == 'history'"
        :class="['fr', {active: !historyFixed}]"
        type="text"
        @click="historyAll(false)"
      >
        全部赛事
      </i-button>
      <Select
        v-if="type=='recent'"
        v-model="hostAndGuest"
        size="small"
        style="width:73px"
        class="fr"
      >
        <Option
          v-for="item in sideArr"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </Option>
      </Select>
      <!-- <Radio-group
        v-if="false"
        v-model="checkMatchRadioType"
        @on-change="changeMatchType"
      >
        <Radio
          v-for="(item) in basketMatchTypeArr"
          :key="item.groupName"
          :label="item.groupName"
        />
      </Radio-group>
      <Radio-group
        v-model="checkRadioType"
        class="fr"
      >
        <Radio
          v-for="(item) in basketRadioTypeArr"
          :key="item"
          :label="item"
        />
      </Radio-group> -->
    </div>
    <Table
      class="no-border"
      :columns="columns"
      :data="getTransferArrData"
      size="small"
    >
      <template
        slot="score-diff"
        slot-scope="{ row }"
      >
        <div v-if="isAllFiled">
          <span class="red bold">{{ row.guestTeamScore }}</span>
          <i>:</i>
          <span class="red bold">{{ row.hostTeamScore }}</span>
          <span>{{ `(${row.guestTeamHalfScore}:${row.hostTeamHalfScore})` }}</span>
        </div>
        <div v-if="!isAllFiled">
          <span class="red bold">{{ row.guestTeamHalfScore }}</span>
          <i>:</i>
          <span class="red bold">{{ row.hostTeamHalfScore }}</span>
        </div>
      </template>
    </Table>
    <p
      v-if="setHistoryData.length"
      class="statistics"
    >
      <span v-if="type === 'history'">两队近{{ setHistoryData.length }}场交锋，{{ matchData.hostTeamName }}队胜{{ setRate.win }}场，</span>
      <span v-if="type === 'recent'">近{{ setHistoryData.length }}场胜{{ setRate.win }}场，</span>
      <!-- <span v-if="type === 'history'">{{ matchData.hostTeamName }}</span> -->
      <!-- <span><i class="red">{{ setRate.win }}胜</i></span> -->
      <span>胜率：<i class="red">{{ setRate.winRate }}</i>，</span>
      <span>赢盘率：<i class="red">{{ setRate.victory }}</i>，</span>
      <span>大分率：<i class="red">{{ setRate.largeRate }}</i></span>
    </p>
  </div>
</template>

<script>
import { Decimal } from 'decimal.js'
import {
  Table,
  Select,
  Option,
  RadioGroup,
  Radio,
  Button
} from 'iview'
import mixins from '../mixins'
import { createNamespacedHelpers } from 'vuex'
import { assertDeclareVariable } from 'babel-types'
const { mapState, mapMutations } = createNamespacedHelpers('analyze')
export default {
  name: 'HistoryRecentTable',
  components: {
    Table,
    Select,
    Option,
    RadioGroup,
    Radio,
    'i-button': Button
  },
  mixins: [mixins],
  props: [
    'titles',
    'matchData',
    'selfId',
    'type',
    'teamName',
    'teamType'
  ],
  data () {
    let comNameId = '31'
    return {
      firstLoad: true,
      basketMatchTypeArr: [],
      matchIds: [],
      oupeiName: comNameId,
      yapeiName: comNameId,
      daxiaoName: comNameId,
      historySize: 10,
      bookId: 31,
      getLeagueName: [],
      checkAllGroup: [],
      checkMatchRadioType: '', // 仅篮球
      checkRadioType: '全场', // 仅篮球
      tempHistory: [],
      historyData: {
        matches: []
      },
      historyFixed: false,
      Model2: 2,
      diffModel1: 1,
      BookNames: [],
      hostAndGuest: 0
    }
  },
  computed: {
    ...mapState(['queryOddByMatchIds']),
    columns () {
      return [  
        {
          title: '赛事',
          key: 'leagueName',
          className: 'blue',
          width: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '比赛日期',
          key: 'matchTime',
          width: 115,
          align: 'center',
          render: (h, {row})=>{
            return h('span', {
            }, this.format(this.dayjs(row.matchTime).format('YYYY-MM-DD')))
          }
        },
        {
          title: '客队',
          key: 'guestTeamName',
          width: 110,
          ellipsis: true,
          tooltip: true,
          align: 'right'
        },
        {
          title: this.isAllFiled ? '比分(半场)' : '半场',
          key: 'score',
          slot: 'score-diff',
          className: 'score-diff',
          width: 140,
          align: 'center'
        },
        {
          title: '主队',
          key: 'hostTeamName',
          width: 110,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '胜负',
          key: 'lostGoal',
          width: 60,
          ellipsis: true,
          align: 'center',
          render: (h, {row})=>{
            return h('span', {
              class: `${row.winLos}`
            }, this.format(row.winLosDesc))
          }
        },
        {
          title: '分差',
          key: 'scorediff',
          width: 60,
          ellipsis: true,
          tooltip: true,
          align: 'center',
          render: (h, {row})=>{
            return h('span', {
            }, this.format(this.isAllFiled?(row.guestTeamScore - row.hostTeamScore):(row.guestTeamHalfScore - row.hostTeamHalfScore)))
          }
        },
        {
          title: '让分盘',
          key: 'asia',
          width: 75,
          ellipsis: true,
          tooltip: true,
          align: 'center',
          render: (h, {row})=>{
            return h('span', {
            }, this.format(this.isAllFiled ? row.asiaRate : row.asiaHalfRate))
          }
        },
        {
          title: '盘路',
          key: 'winRate',
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
          title: '总分',
          key: 'totalScore',
          ellipsis: true,
          tooltip: true,
          align: 'center',
          render: (h, {row})=>{
            return h('span', {
            }, this.format(this.isAllFiled?(row.guestTeamScore + row.hostTeamScore):(row.guestTeamHalfScore + row.hostTeamHalfScore)))
          }
        },
        {
          title: '总分盘',
          key: 'dxRate',
          ellipsis: true,
          tooltip: true,
          align: 'center',
          render: (h, {row})=>{
            return h('span', {
            }, this.format(this.isAllFiled ? row.dxRate : row.dxHalfRate))
          }
        },
        {
          title: '盘路',
          key: 'winRate',
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
      Array.isArray(this.historyData.matches) && this.historyData.matches.forEach(item => {
        this.addItem({item, teamId: this.selfId, sportId: 'basketball', isAllFiled: this.checkRadioType === this.basketRadioTypeArr[0]})
      })
      return this.historyData.matches || []
    },
    isAllFiled(){ // 全场
      return this.checkRadioType === this.basketRadioTypeArr[0]
    },
    setHistoryData(){
      return this.historyData.matches || []
    },
    setRate () {
      return this.getTapeRate({data: this.historyData.matches, teamId: this.selfId, isAllFiled: this.isAllFiled, sportId: 'basketball'})
    }
  },
  watch: {
    matchData(){
      // 获取交战历史的数据
      this.excuteApi()
    },
    historyFixed(){
      this.excuteApi()
    },
    historySize(){
      this.excuteApi()
    },
    hostAndGuest(){
      this.excuteApi()
    }
  },
  created(){
    // 获取交战历史的数据
    this.excuteApi()
  },
  methods: {
    excuteApi(groupId){
      if (this.type === 'history') {
        this.getHistoryData()
      } else if (this.type === 'recent') {
        this.getRecentRecordsData()
      }
    },
    ...mapMutations(['addOdd', 'resetOdd']),
    changeMatchType(val){
      let groupId = this.basketMatchTypeArr.find(item => val === item.groupName).groupId
      this.excuteApi(groupId)
    },
    zhiShuChange(val, type, local = '1'){ // 指数select change
      this[type] = val + ''
      this.getQueryOddByMatchIds(this[type], local, this.historyData.matches)
    },
    getZhiShu(item, type, local) {
      if (!item.rateDetail) return '-'
      let val = item.rateDetail[local] && item.rateDetail[local][type] 
      return (val || val=== 0) ? val : '-'
    },
    handlerLeagueName () { // 获取联队leagueName
      let leagueName = this.historyData.matches.reduce((total,item)=> {
        total.push(item.leagueName || '')
        return total
      },[])
      this.getLeagueName = [...new Set(leagueName)]
    },
    checkboxChange(val){
      this.historyData.matches = this.tempHistory.filter(item=>{
        return val.includes(item.leagueName)
      })
    },
    checkboxChangeMatchType (val) {
    },
    getHistoryData (leagueId){
      let rateDetail = this.bookId === 31
      let params = {
        matchId: this.matchData.matchId,
        hostTeamId: this.matchData.hostTeamId,
        guestTeamId: this.matchData.guestTeamId,
        size: this.historySize,
        fixed: !!this.historyFixed,
        rateDetail
      }
      rateDetail ? params.bookId = this.bookId : ''
      if (typeof leagueId === 'number') params.leagueId = leagueId
      if(this.$requireParams({matchId: this.matchData.matchId})) return
      this.$get('/v4/team/hostAndGuest', params).then(res => {
        if (res.data) {
          this.resetOdd()
          this.historyData = res.data
          this.tempHistory = [...this.historyData.matches]
          this.handlerLeagueName()
          this.checkAllGroup = [...this.getLeagueName]
        }
      })
    },
    getRecentRecordsData(leagueId){ // 获取近期战绩的数据
      let teamId = this.selfId
      let size = this.historySize
      let params = {
        teamId,
        matchId: this.matchData.matchId,
        size
      }
      if(this.type == 'history') params.fixed = this.historyFixed
      if(this.teamType) {
        switch(this.hostAndGuest) {
        case 0 : params.side = 'all';break
        case 1 : params.side = 'host';break
        case 2 : params.side = 'guest';break
        }
      }
      if (typeof leagueId === 'number') params.leagueId = leagueId
      if(this.$requireParams({matchId: this.matchData.matchId, teamId})) return
      this.$get('/v4/team/recentRecords', params).then(res => {
        if (res.data) {
          this.historyData = res.data
          this.tempHistory = [...this.historyData.matches]
          this.handlerLeagueName()
          this.checkAllGroup = [...this.getLeagueName]
        }
      })
    },

    historyAll(fixed){
      this.historyFixed = fixed
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../Common/detail.scss';
  i{
    font-style: normal
  }
  .history-inner{
    .filter{
      overflow: hidden;
      margin-bottom: 21px;
      .ivu-select{
        margin-right: 26px;
        width: 77px;
      }
      .ivu-checkbox-group{
        margin-right: 16px;
        display: inline-block;
      }
    }
    .statistics{
      padding: 24px 0 0 14px;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #848484;
      letter-spacing: 0;
    }
    /deep/ {
      .ivu-radio-wrapper{
        margin-right: 32px;
      }
      .hidden{
        display: none;
      }
      .bold{
        font-family: DINCondensed-Bold;
        &.red{
          font-size: 16px;
        }
      }
    }
  }
  .name{
    font-family: PingFangSC-Medium;
    font-weight: 600;
    font-size: 16px;
    color: #3683FF;
    letter-spacing: 0;
    line-height: 24px;
    display: inline-block;
    vertical-align: sub;
    margin-right: 20px;
  }
</style>
