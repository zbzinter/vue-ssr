<!-- 交战历史 -->
<template>
  <div class="history-inner">
    <div class="filter">
      <Select
        v-if="type !== 'basketball'"
        v-model="historyFixed"
        size="small"
        style="width:100px"
      >
        <Option
          v-for="item in isDiffHostArr"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </Option>
      </Select>
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
      <Select
        v-model="matchFilter"
        size="small"
        style="width:110px"
        multiple
        placeholder="赛事筛选"
        class="match-filter"
        @on-change="(e)=>{matchFilter = []}"
      >
        <Option
          v-for="item in [1]"
          :key="item"
          :value="item"
        >
          <Checkbox-group
            v-if="type !== 'basketball'"
            v-model="checkAllGroup"
            @on-change="checkboxChange"
          >
            <Checkbox
              v-for="(item) in getLeagueName"
              :key="item"
              :value="item"
              :label="item"
            />
          </Checkbox-group>
        </Option>
      </Select>
      <Checkbox-group
        v-if="type === 'basketball'"
        v-model="checkAllGroupMatchType"
        @on-change="checkboxChangeMatchType"
      >
        <Checkbox
          v-for="(item) in basketMatchTypeArr"
          :key="item"
          :value="item"
          :label="item"
        />
      </Checkbox-group>
      <Radio-group
        v-if="type === 'basketball'"
        v-model="checkRadioType"
        style="float: right"
      >
        <Radio
          v-for="(item) in basketRadioTypeArr"
          :key="item"
          :label="item"
        />
      </Radio-group>
    </div>
    <table class="history-table">
      <thead>
        <tr>
          <th
            v-for="(title, index) in titles"
            :key="index"
            :class="[{'select': title==='oupeiSelect'||title==='yapeiSelect'||title==='dxSelect'}, type]"
          >
            <div
              v-if="title === 'yapeiSelect'"
              class="select"
            >
              <slot
                name="yapeiSelect"
                :BookNames="BookNames"
                :yapeiName="yapeiName"
                :zhiShuChange="zhiShuChange"
              />
            </div>
            <div
              v-else-if="title === 'oupeiSelect'"
              class="select"
            >
              <slot
                name="oupeiSelect"
                :BookNames="BookNames"
                :oupeiName="oupeiName"
                :zhiShuChange="zhiShuChange"
              />
            </div>
            <div
              v-else-if="title === 'dxSelect'"
              class="select"
            >
              <slot
                name="dxSelect"
                :BookNames="BookNames"
                :daxiaoName="daxiaoName"
                :zhiShuChange="zhiShuChange"
              />
            </div>
            <div v-else>
              {{ title }}
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in setHistoryData"
          :key="index"
        >
          <td :class="[type]">
            <div
              class="ellipsis league-name"
              :title="item.leagueName"
            >
              {{ item.leagueName }}
            </div>
          </td>
          <td :class="[type]">
            <div>{{ dayjs(item.matchTime).format('YYYY-MM-DD') }}</div>
          </td>
          <td :class="[type, 'host-team', selfId===item.hostTeamId && (item.hostTeamNormalScore>item.guestTeamNormalScore ? 'red' : item.hostTeamNormalScore<item.guestTeamNormalScore ? 'green' : '')]">
            <div>{{ item.hostTeamName }}</div>
          </td>
          <td :class="[type, 'score']">
            <div>
              <span>{{ item.hostTeamNormalScore }}</span>
              <i>:</i>
              <span>{{ item.guestTeamNormalScore }}</span>
            </div>
          </td>
          <td :class="[type, 'guest-team', selfId===item.guestTeamId && (item.guestTeamNormalScore>item.hostTeamNormalScore ? 'red' : item.guestTeamNormalScore<item.hostTeamNormalScore ? 'green' : '')]">
            <div>{{ item.guestTeamName }}</div>
          </td>
          <td
            v-if="type !== 'basketball'"
            :class="[type, 'score']"
          >
            <div>{{ item.hostTeamHalfScore }} : {{ item.guestTeamHalfScore }}</div>
          </td>
          <td
            v-if="type !== 'basketball'"
            :class="[type]"
          >
            <div>
              <span>{{ getZhiShu(item, 'valueForType1', 1) }}</span>
              <span>{{ getZhiShu(item, 'ovalue', 1) }}</span>
              <span>{{ getZhiShu(item, 'valueForType2', 1) }}</span>
            </div>
          </td>
          <td
            v-if="type !== 'basketball'"
            :class="[type]"
            class="football"
          >
            <div>
              <span>{{ getZhiShu(item, 'valueForType1', 2) }}</span>
              <span>{{ getZhiShu(item, 'valueForTypeX', 2) }}</span>
              <span>{{ getZhiShu(item, 'valueForType2', 2) }}</span>
            </div>
          </td>
          <td
            v-if="type !== 'basketball'"
            :class="[type]"
          >
            <div>
              <span>{{ getZhiShu(item, 'valueForType1', 3) }}</span>
              <span>{{ getZhiShu(item, 'valueForTypeX', 3) }}</span>
              <span>{{ getZhiShu(item, 'valueForType2', 3) }}</span>
            </div>
          </td>
          <td :class="[type]">
            <div :class="[item.tape]">
              {{ item.tapeDesc }}
            </div>
          </td>
          <td :class="[type]">
            <div :class="[item.dx]">
              {{ item.dxDesc }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <no-data v-if="!setHistoryData.length" />
    <p
      v-else
      class="statistics"
    >
      <span>近{{ historyData.totalNum }}场交战</span>
      <span>{{ matchData.hostTeamName }}</span>
      <span><i class="red">{{ historyData.hostWinNum }}胜</i> <i class="blue">{{ historyData.hostDrawNum }}平</i> <i class="green">{{ historyData.hostLoseNum }}负</i></span>
      <span>胜率<i class="red">{{ historyData.hostWinRate }}%</i></span>
      <span>赢盘率<i class="red">{{ getTapeRate.victory }}</i></span>
      <span>大球率<i class="red">{{ getTapeRate.largeRate }}</i></span>
    </p>
  </div>
</template>

<script>
import {
  Select,
  Option,
  CheckboxGroup,
  Checkbox,
  RadioGroup,
  Radio,
} from 'iview'
import { Decimal } from 'decimal.js'
import NoData from '@src/components/NoData'
import mixins from './mixins'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations } = createNamespacedHelpers('analyze')
export default {
  name: 'MatchHistoryTable',
  components: {
    Select,
    Option,
    RadioGroup,
    Radio,
    CheckboxGroup,
    Checkbox,
    NoData
  },
  mixins: [mixins],
  props: [
    'titles',
    'matchData',
    'selfId',
    'type'
  ],
  data () {
    let comNameId = '31'
    return {
      matchFilter: [],
      matchIds: [],
      historyFixed: 0,
      oupeiName: comNameId,
      yapeiName: comNameId,
      daxiaoName: comNameId,
      historySize: 10,
      bookId: 31,
      getLeagueName: [],
      checkAllGroup: [],
      checkAllGroupMatchType: ['季后赛', '常规赛'], // 仅篮球
      checkRadioType: '全让分、总分', // 仅篮球
      tempHistory: [],
      historyData: {
        matches: []
      },
      Model2: 2,
      diffModel1: 1,
      BookNames: []
    }
  },
  computed: {
    ...mapState(['queryOddByMatchIds']),
    setHistoryData(){
      return this.historyData.matches || []
    },
    getTapeRate () { // 赢盘率
      let teamId = this.selfId // 交战历史只有一组主队列表
      let hasAsiaRateArr = [] // 有asiaRate的item 数组
      let victory = [] // 赢盘的数组
      let hasDxRateArr = [] // 有dxRate的item 数组
      let largeRateArr = [] // 大球率
      this.historyData.matches.forEach(item => {
        let isAsiaRate = !!item.asiaRate || item.asiaRate === 0
        let isDxRate = !!item.dxRate || item.dxRate === 0
        if (isAsiaRate) hasAsiaRateArr.push(item)
        if (isDxRate) hasDxRateArr.push(item)
        this.addItem({item, teamId, sportId: 'football'})
        if (teamId === item.hostTeamId) {
          if ((item.hostTeamNormalScore - item.asiaRate > item.guestTeamNormalScore) && isAsiaRate) victory.push(item)
        } else if (teamId === item.guestTeamId) {
          if ((item.guestTeamNormalScore + item.asiaRate > item.hostTeamNormalScore) && isAsiaRate) victory.push(item)
        }
        if (((item.hostTeamNormalScore + item.guestTeamNormalScore) > item.dxRate) && isDxRate) largeRateArr.push(item)        
      })
      return {
        largeRate: hasDxRateArr.length ? `${new Decimal(largeRateArr.length*100).dividedBy(hasDxRateArr.length).toFixed(1)}%` : '-',
        victory: hasAsiaRateArr.length ? `${new Decimal(victory.length*100).dividedBy(hasAsiaRateArr.length).toFixed(1)}%` : '-'
      }
    }
  },
  created(){
    // 获取交战历史的数据
    this.getHistoryData()
    this.getQueryBook()
  },
  methods: {
    ...mapMutations(['addOdd', 'resetOdd']),
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
    getHistoryData (fixed, leagueId){
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
    getQueryBook(){
      this.BookNames = []
      this.$get('/v8/queryBook', {}).then(res => {
        if (res.data) {
          for (const [index, item] of Object.entries(res.data)) {
            this.BookNames.push({id: index, name: item})
          }
          this.$emit('getBookNames', this.BookNames)
        }
      })
    }
  },
  watch: {
    matchData(){
      // 获取交战历史的数据
      this.getHistoryData()
      this.getQueryBook()
    },
    historyFixed(val){
      this.getHistoryData(val)
    },
    historySize(){
      this.getHistoryData()
    }
  }
}
</script>

<style lang="scss" scoped>

	.ellipsis {
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
    color: $green
  }
  i{
    font-style: normal
  }
  table.history-table{
    width: 100%;
    thead{
      th{
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #888888;
        letter-spacing: 0;
        text-align: left;
        width: 130px;
        height: 42px;
        line-height: 42px;
        background: #FAFAFA;
        font-weight: normal;
        &:nth-of-type(1){
          padding-left: 14px;
          /* border-radius: 31px 0 0 31px; */
        }
        &:nth-last-of-type(1){
          /* border-radius: 0 31px 31px 0; */
        }
        .select{
          width: 180px;
          font-weight: 400;
        }
        /* 对其方式 */
        &:nth-of-type(3){
          text-align: right;
          padding-right: 26px;
        }
        /* &:nth-of-type(4){
          width: 60px;
        } */
        &.football:nth-of-type(7)>div,&.football:nth-of-type(8)>div,&.football:nth-of-type(9)>div{
            padding: 0 19px;
        }
      }
    }
    tbody{
      tr{
        &:nth-of-type(1){
          td>div{
            margin-top: 26px;
          }
        }
        &:not(:last-child){
          td>div{
            padding-bottom: 29px;
          }
        }
        &:nth-last-of-type(1){
          td{
            padding-bottom: 0;
          }
        }
        td.football:nth-of-type(6)>div,td.football:nth-of-type(7)>div,td.football:nth-of-type(8)>div{
            border-right: 1px solid #E9E9E9;
            padding-right: 24px;
        }
        td.football:nth-of-type(7)>div,td.football:nth-of-type(8)>div,td.football:nth-of-type(9)>div{
            padding-left: 19px;
            padding-right: 19px;
            span{
              display: inline-block;
            }
            span:nth-of-type(1){
              width: 30%;
              float: left;
              text-align:left;
            }
            span:nth-of-type(2){
              width: 40%;
              text-align:center;
            }
            span:nth-of-type(3){
              width: 30%;
              float: right;
              text-align:right;
            }
        }
        td{
          line-height: 20px;
          font-size: 12px;
          color: #333;
          &.score{
            i{
              padding: 0 3px;
            }
          }
          &.host-team,&.guest-team{
            @extend .ellipsis;
          }

          &:nth-of-type(1){
            padding-left: 14px;
            letter-spacing: 0;
            .league-name{
              color: #3683FF;
            }
            div{
              max-width: 65px;
              padding-right:4px;
            }
          }
          /* 对其方式 */
          &:nth-of-type(3){
            text-align: right;
            padding-right: 26px;
          }
        }
      }
    }
  }

  .history-inner{
    .filter{
      margin-bottom: 21px;
      padding: 0 14px;
      .ivu-select{
        margin-right: 26px;
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
      span{
        margin-right: 16px;
      }
    }
  }
  .match-filter{
    /deep/ {
      .ivu-select-placeholder{
        color: #515a6e;

      }
      .ivu-select-dropdown{
        padding: 0;
        .ivu-select-item{
          padding: 0;
          &.ivu-select-item-focus{
            background: none;
          }
          .ivu-checkbox-group{
            padding: 12px 0 5px;
            margin-right: 0 !important;
            width: 100%;
            label{
              display: block;
              margin-bottom: 12px;
              margin-left: 8px;
              &:hover{
                color: $blue;
              }
            }
          }
        }
      }
    }
  }


</style>
