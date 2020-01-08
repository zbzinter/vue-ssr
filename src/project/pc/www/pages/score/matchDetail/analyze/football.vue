<!-- 分析页面 -->
<template>
  <div class="match-detail">
    <!-- 右侧固定栏 -->
    <fixed-right :right-navs="rightNavs" />
    <div class="analyze">
      <!-- 交战历史 -->
      <div
        id="history"
        class="history"
      >
        <h3 class="title hack">
          交战历史
        </h3>
        <div class="wrap-inner">
          <MatchHistoryTable
            :titles="titles2"
            :match-data="matchData"
            :self-id="matchData.hostTeamId"
            type="football"
            @getBookNames="getBookNames"
          >
            <template
              slot="yapeiSelect"
              slot-scope="{BookNames, yapeiName, zhiShuChange}"
            >
              <span>亚赔：</span>
              <Select
                v-model="yapeiName"
                size="small"
                style="width:100px"
                @on-change="zhiShuChange(yapeiName, 'yapeiName', 1)"
              >
                <Option
                  v-for="item in BookNames"
                  :key="item.name"
                  :value="item.id"
                >
                  {{ item.name }}
                </Option>
              </Select>
            </template>
            <template
              slot="oupeiSelect"
              slot-scope="{BookNames, oupeiName, zhiShuChange}"
            >
              <span>欧赔：</span>
              <Select
                v-model="oupeiName"
                size="small"
                style="width:100px"
                @on-change="zhiShuChange(oupeiName, 'oupeiName', 2)"
              >
                <Option
                  v-for="item in BookNames"
                  :key="item.name"
                  :value="item.id"
                >
                  {{ item.name }}
                </Option>
              </Select>
            </template>
            <template
              slot="dxSelect"
              slot-scope="{BookNames, daxiaoName, zhiShuChange}"
            >
              <span>大小：</span>
              <Select
                v-model="daxiaoName"
                size="small"
                style="width:100px"
                @on-change="zhiShuChange(daxiaoName, 'daxiaoName', 3)"
              >
                <Option
                  v-for="item in BookNames"
                  :key="item.name"
                  :value="item.id"
                >
                  {{ item.name }}
                </Option>
              </Select>
            </template>
          </MatchHistoryTable>
        </div>
      </div>
      <!-- 近期战绩 -->
      <div
        id="recent"
        class="recent-records"
      >
        <h3 class="title">
          近期战绩
        </h3>
        <div class="wrap-inner">
          <div class="host-team">
            <div class="filter">
              <default-img
                class="logo-left"
                :src="matchData.hostTeamLogo"
                :default-url="defaultImg.football"
              />
              <span class="name">{{ matchData.hostTeamName }}</span>
              <div class="choice">
                <Select
                  v-if="hostLeagueNameArr.length"
                  v-model="matchFilter"
                  size="small"
                  style="width:90px"
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
                      v-model="recentHostCheckAll"
                      @on-change="checkboxChange1"
                    >
                      <Checkbox
                        v-for="(item) in hostLeagueNameArr"
                        :key="item"
                        :value="item"
                        :label="item"
                      />
                    </Checkbox-group>
                  </Option>
                </Select>

                <Select
                  v-model="recentHostSize"
                  size="small"
                  style="width:73px"
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
                  v-model="recentHostComName"
                  size="small"
                  style="width:73px"
                >
                  <Option
                    v-for="item in bookNamesArr"
                    :key="item.name"
                    :value="item.id"
                  >
                    {{ item.name }}
                  </Option>
                </Select>                  
                <Select
                  v-model="recentHostSide"
                  size="small"
                  style="width:73px"
                >
                  <Option
                    v-for="item in sideArr"
                    :key="item.value"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </Option>
                </Select>
              </div>
            </div>
            <RecentTable
              type="Host"
              :size="recentHostSize"
              :titles="titles3"
              :self-id="matchData.hostTeamId"
              :match-data="matchData"
              :recent-data="hostRecentData"
            />
          </div>
          <div class="guest-team">
            <div class="filter">
              <span class="name">
                {{ matchData.guestTeamName }}
                <default-img
                  class="logo-right"
                  :src="matchData.guestTeamLogo"
                  :default-url="defaultImg.football"
                />
              </span>
              <div class="choice">
                <Select
                  v-if="guestLeagueNameArr.length"
                  v-model="matchFilter"
                  size="small"
                  style="width:90px"
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
                      v-model="recentGuestCheckAll"
                      @on-change="checkboxChange2"
                    >
                      <Checkbox
                        v-for="(item) in guestLeagueNameArr"
                        :key="item"
                        :value="item"
                        :label="item"
                      />
                    </Checkbox-group>
                  </Option>
                </Select>
                <Select
                  v-model="recentGuestSize"
                  size="small"
                  style="width:73px"
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
                  v-model="recentGuestComName"
                  size="small"
                  style="width:73px"
                >
                  <Option
                    v-for="item in bookNamesArr"
                    :key="item.name"
                    :value="item.id"
                  >
                    {{ item.name }}
                  </Option>
                </Select>                   
                <Select
                  v-model="recentGuestSide"
                  size="small"
                  style="width:73px"
                >
                  <Option
                    v-for="item in sideArr"
                    :key="item.value"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </Option>
                </Select>
              </div>
            </div>
            <RecentTable
              type="Guest"
              :size="recentGuestSize"
              :titles="titles3"
              :self-id="matchData.guestTeamId"
              :match-data="matchData"
              :recent-data="guestRecentData"
            />
          </div>
        </div>
      </div>
      <!-- 盘路走势 -->
      <div
        id="trend"
        class="trend"
      >
        <h3 class="title">
          盘路走势
        </h3>
        <div class="wrap-inner">
          <div class="host-team">
            <div class="head">
              <span class="name">
                <default-img
                  class="logo-left"
                  :src="matchData.hostTeamLogo"
                  :default-url="defaultImg.football"
                />
                {{ matchData.hostTeamName }}
              </span>
            </div>
            <TrendTable
              :titles="titles4"
              :obj-val="trendHostData"
            />
          </div>
          <div class="guest-team">
            <div class="head">
              <span class="name">
                {{ matchData.guestTeamName }}
                <default-img
                  class="logo-right"
                  :src="matchData.guestTeamLogo"
                  :default-url="defaultImg.football"
                />
              </span>
            </div>
            <TrendTable
              :titles="titles4"
              :obj-val="trendGuestData"
            />
          </div>
        </div>
      </div>
      <!-- 平均统计 -->
      <div
        id="statistics"
        class="avg-statistics trend"
      >
        <h3 class="title">
          平均统计
        </h3>
        <div class="wrap-inner">
          <div class="host-team">
            <div class="head">
              <span class="name">
                <default-img
                  class="logo-left"
                  :src="matchData.hostTeamLogo"
                  :default-url="defaultImg.football"
                />
                {{ matchData.hostTeamName }}
              </span>
            </div>
            <AvgTable
              type="host"
              :row-title="rowTitle5"
              :obj-val="avgData[0]"
              :titles="titles5"
            />
          </div>
          <div class="guest-team">
            <div class="head">
              <span class="name">
                {{ matchData.guestTeamName }}
                <default-img
                  class="logo-right"
                  :src="matchData.guestTeamLogo"
                  :default-url="defaultImg.football"
                />
              </span>
            </div>
            <AvgTable
              type="guest"
              :row-title="rowTitle5"
              :obj-val="avgData[1]"
              :titles="titles5"
            />
          </div>
        </div>
      </div>
      <!-- 进球分布 -->
      <div
        id="distribute"
        class="avg-statistics trend"
      >
        <h3 class="title">
          进球分布
        </h3>
        <div class="wrap-inner">
          <div class="host-team">
            <div class="head">
              <span class="name">
                <default-img
                  class="logo-left"
                  :src="matchData.hostTeamLogo"
                  :default-url="defaultImg.football"
                />
                {{ matchData.hostTeamName }}
              </span>
            </div>
            <DistributeTable
              type="host"
              :row-title="rowTitle6"
              :obj-val="queryGoalStatData[0]"
              :titles="titles6"
            />
          </div>
          <div class="guest-team">
            <div class="head">
              <span class="name">
                {{ matchData.guestTeamName }}
                <default-img
                  class="logo-right"
                  :src="matchData.guestTeamLogo"
                  :default-url="defaultImg.football"
                />
              </span>
            </div>
            <DistributeTable
              type="guest"
              :row-title="rowTitle6"
              :obj-val="queryGoalStatData[1]"
              :titles="titles6"
            />
          </div>
        </div>
      </div>
      <!-- 联赛积分排名 -->
      <div
        id="rank"
        class="rank"
      >
        <h3 class="title">
          积分排名
        </h3>
        <div class="wrap-inner">
          <div class="team">
            <div class="host-name name fl">
              <default-img
                :src="matchData.hostTeamLogo"
                :default-url="defaultImg.football"
              />
              <span>{{ matchData.hostTeamName }}</span>
            </div>
            <div class="guest-name name fr">
              <span>{{ matchData.guestTeamName }}</span>
              <default-img
                :src="matchData.guestTeamLogo"
                :default-url="defaultImg.football"
              />
            </div>
          </div>
          <div class="info-table">
            <div class="host fl">
              <IntegralTable
                :table-data="queryMatchLeagueRankData"
                index="host"
                :titles="titles1"
                :match-data="matchData"
              />
            </div>
            <div class="guest fr">
              <IntegralTable
                :table-data="queryMatchLeagueRankData"
                index="guest"
                :titles="titles1"
                :match-data="matchData"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- 联赛积分榜 -->
      <div
        v-for="(item, index) in queryLeagueRankData"
        id="scoreboard"
        :key="index"
        class="scoreboard"
      >
        <h3 class="title">
          积分榜 {{ queryLeagueRankData.length>1 && item.groupName ? `(${item.groupName})` : '' }}
        </h3>
        <div class="wrap-inner">
          <ScoreboardTable
            :titles="titles7"
            :table-data="item.stat"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DefaultImg from '@src/components/DefaultImg'
import IntegralTable from './widget/IntegralTable'
import MatchHistoryTable from './widget/MatchHistoryTable'
import RecentTable from './widget/RecentTable'
import TrendTable from './widget/TrendTable'
import ScoreboardTable from './widget/ScoreboardTable'
import AvgTable from './widget/AvgTable'
import DistributeTable from './widget/DistributeTable'
import mixins from './widget/mixins.js'
import FixedRight from './widget/FixedRight'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations } = createNamespacedHelpers('analyze')
import {
  Select,
  Option,
  CheckboxGroup,
  Checkbox
} from 'iview'
export default {
  name: 'FootballAnalyze',
  components: {
    FixedRight,
    DefaultImg,
    IntegralTable,
    Select,
    Option,
    CheckboxGroup,
    Checkbox,
    MatchHistoryTable,
    RecentTable,
    TrendTable,
    ScoreboardTable,
    AvgTable,
    DistributeTable
  },
  mixins: [mixins],
  props: [
    'matchData'
  ],
  data () {
    return {
      matchFilter: [],
      bookNamesArr: [], //公司名
      guestRecentData: [],
      hostRecentData: [], // 主队近期战绩的数据
      hostLeagueNameArr: [],  // 主队赛名的集合
      guestLeagueNameArr: [],
      tempScroll: 0,
      queryLeagueRankData: [],
      queryMatchLeagueRankData: {},
      queryGoalStatData: [],
      avgData: [],
      tempRecentGuest: [],
      tempRecentHost: [],
      recentGuestCheckAll: [],
      recentHostCheckAll: [],
      recentHostSize: 10,
      recentGuestSize: 10,
      recentHostSide: 0,
      recentGuestSide: 0,
      recentHostComName: '0',
      recentGuestComName: '0',
      trendHostData: [],
      trendGuestData: [],
      rightNavs: {
        'history': '交战历史',
        'recent': '近期战绩',
        'trend': '盘路走势',
        'statistics': '平均统计',
        'distribute': '进球分布',
        'rank': '积分排名',
        'scoreboard': '积分榜'
      },
      navs: [
        '数据分析',
        '主流欧赔',
        '亚盘对比',
        '大小指数',
        '三合一',
        '比赛直播'
      ],
      titles1: ['全部', '比赛', '胜', '平', '负', '得', '失', '净胜', '积分', '排名', '胜率'],
      titles2: ['赛事', '比赛日期', '主队', '比分', '客队', '半场', 'yapeiSelect', 'oupeiSelect', 'dxSelect', '盘路', '大小'],
      titles3: ['全部', '比赛日期', '主队', '比分', '客队', '半场', '盘口', '盘路', '大小'],
      titles4: ['', '比赛', '赢盘', '走盘', '输盘', '赢盘率', '大球', '大球率', '小球', '小球率'],
      titles5: ['赛事', '总平均数', '主场', '客场'],
      titles6: ['', '0-10′', '10-20′', '20-30′', '30-40′', '40-50′', '50-60′', '60-70′', '70-80′', '90+′'],
      titles7: ['排名', '球队', '比赛', '胜', '平', '负', '得', '失', '净胜', '胜率', '平率', '负率', '均得', '均失', '积分'],
      rowTitle5: {
        Goal: '平均入球',
        LostGoal: '平均失球',
        Corner: '平均角球'
      },
      rowTitle6: {
        all: '总',
        host: '主',
        guest: '客',
      }
    }
  },
  computed: {
    ...mapState(['queryOddByMatchIds'])
  },
  watch: {
    recentHostSide() {
      this.getRecentRecordsData()
    },
    recentGuestSide() {
      this.getRecentRecordsData('guest')
    },
    recentHostSize() {
      this.getRecentRecordsData()
    },
    recentGuestSize(){
      this.getRecentRecordsData('guest')
    },
    recentHostComName(val){
      if(val === '0') {
        this.getRecentRecordsData()
        return
      }
      this.getQueryOddByMatchIds(val, 1, this.hostRecentData.matches, 'recent')
    },
    recentGuestComName(val){
      if(val === '0') {      
        this.getRecentRecordsData('guest')
        return
      }
      this.getQueryOddByMatchIds(val, 1, this.guestRecentData.matches, 'recent')
    }
  },
  created () {
    this.$emit('setNavs', this.navs)
    this.afterMatchData()
  },
  beforeDestroy () {
    this.revert()
  },
  methods: {
    revert(){
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
    },
    getBookNames(arr){
      this.bookNamesArr = [{id: '0', name: '全部'}, ...arr]
      
    },
    afterMatchData(){
      // 获取主队近期战绩
      this.getRecentRecordsData()
      // 获取客队近期战绩
      this.getRecentRecordsData('guest')
      // 获取联赛盘路走势
      this.getQueryMatchOddTrend(this.matchData.hostTeamId)
      this.getQueryMatchOddTrend(this.matchData.guestTeamId, 'guest')
      // 平均统计
      this.getQueryTeamGoalByMatchId()
      // 进球分布
      this.getQueryGoalStat()
      // 积分排名
      this.getQueryMatchLeagueRank()
      // 联赛积分排名榜
      this.getQueryLeagueRank (1)

    },
    checkboxChange1(val){
      this.hostRecentData.matches = this.tempRecentHost.filter(item=>{
        return val.includes(item.leagueName)
      })
    },
    checkboxChange2(val){
      this.guestRecentData.matches = this.tempRecentGuest.filter(item=>{
        return val.includes(item.leagueName)
      })
    },
    getRecentRecordsData(type = 'host'){ // 获取近期战绩的数据
      let teamId = type == 'guest' ? this.matchData.guestTeamId : this.matchData.hostTeamId
      let size = type == 'guest' ? this.recentGuestSize : this.recentHostSize
      let side = type == 'guest' ? this.recentGuestSide : this.recentHostSide
      side = side === 0 ? 'all' : side === 1 ? 'host' : 'guest'
      let params = {
        teamId,
        matchId: this.matchData.matchId,
        side,
        size
      }
      if (this.recentLeague) params.leagueId = this.matchData.leagueId
      if (this.recentFixed) params.side = type === 'guest' ? type : 'host'
      if(this.$requireParams({matchId: this.matchData.matchId, teamId})) return
      this.$get('/v4/team/recentRecords', params).then(res => {
        if (res.data) {
          if (type === 'guest') {
            this.recentGuestCheckAll = []
            this.guestRecentData = res.data
            this.guestLeagueNameArr = this.handlerLeagueName(res.data.matches)
            this.tempRecentGuest = [...res.data.matches]
            this.$nextTick(()=>{
              this.recentGuestCheckAll = [...this.guestLeagueNameArr]
            })
          } else {
            this.recentHostCheckAll = []
            this.hostRecentData = res.data
            this.hostLeagueNameArr = this.handlerLeagueName(res.data.matches)
            this.tempRecentHost = [...res.data.matches]
            this.$nextTick(()=>{
              this.recentHostCheckAll = [...this.hostLeagueNameArr]
            })
          }
        }
      })
    },
    getQueryMatchOddTrend (teamId, type = 'host') { // 联赛盘路走势
      let params = { 
        teamId,
        matchId: this.matchData.matchId
      }
      if(this.$requireParams({matchId: this.matchData.matchId, teamId})) return
      this.$get('/v7/queryMatchOddTrend', params).then(res => {
        if (res.data) {
          if (type === 'host') this.trendHostData = res.data
          if (type === 'guest') this.trendGuestData = res.data
        }
      })
    },
    getQueryTeamGoalByMatchId () { // 平均统计
      let params = {
        matchId: this.matchData.matchId
      }
      if(this.$requireParams({matchId: this.matchData.matchId})) return
      this.$get('/v8/queryTeamGoalByMatchId', params).then(res => {
        if (res.data) {
          this.avgData = res.data
        }
      })
    },
    getQueryGoalStat (currentMatch = false) { // 进球分布
      let params = {
        matchId: this.matchData.matchId,
        currentMatch // 默认查询当前赛季的，true查询本场比赛的。
      }
      if(this.$requireParams({matchId: this.matchData.matchId})) return
      this.$get('/v8/queryGoalStat', params).then(res => {
        if (Array.isArray(res.data)) {
          this.queryGoalStatData = [[], []]
          this.queryGoalStatData[0] = res.data.filter((item) => item.teamFlag == 1).sort((a, b)=> a.type-b.type)
          this.queryGoalStatData[1] = res.data.filter((item) => item.teamFlag == 2).sort((a, b)=> a.type-b.type)
          console.log(this.queryGoalStatData, 'this.queryGoalStatData')
        } else {
          this.queryGoalStatData = [[],[]]
        }
      })
    },
    getQueryLeagueRank (type = 1) { // 联赛积分榜
      let params = {
        seasonId: this.matchData.seasonId,
        type
      }
      if(this.$requireParams(params)) return
      this.$get('/v4/league/teamRank', params).then(res => {
        if (res.data) {
          this.queryLeagueRankData = res.data
          if(!this.queryLeagueRankData.length){
            this.$delete(this.rightNavs, 'scoreboard')
          }
        }
      })
    },
    getQueryMatchLeagueRank () { // 积分排名
      let params = {
        matchId: this.matchData.matchId
      }
      if(this.$requireParams(params)) return
      this.$get('/v8/queryMatchLeagueRank', params).then(res => {
        if (res.data) {
          this.queryMatchLeagueRankData = res.data
        }
      })
    },

  }
}
</script>

<style scoped lang="scss">
  .ellipsis {
		overflow: hidden;
		text-overflow: ellipsis;
    white-space: nowrap;
	};
  .red{
    color: #F06151;
  }
  .blue{
    color: #3683FF;

  }
  .green{
    color: #80A963;
  }
  i{
    font-style: normal
  }
  .match-detail{
    .logo-left, .logo-right{
      width: 30px;
      height: 30px;
      vertical-align:middle;
      &.logo-left{
        margin-right: 8px;
      }
      &.logo-right{
        margin-left: 8px;
      }
    }
    .title{
      font-family: PingFangSC-Semibold;
      font-size: 24px;
      color: #333333;
      letter-spacing: 0;
      font-weight: 600;
      padding-left: 36px;
      padding-top: 44px;
      padding-bottom: 10px;
      line-height: 33px;
      &.hack{
        padding-top: 28px;
        background: #fff;
      }
    }
    .wrap-inner{
      padding: 27px 20px 40px;
      box-shadow: 0 6px 24px 0 rgba(0, 0, 0, 0.03);
      background: #fff;
      &.hack{
        padding: 20px 30px 25px;
      }
    }
    .analyze{
      margin: 0 auto;
      width: 1200px;
      .rank{
        .team{
          height: 60px;
          line-height: 60px;
          margin-bottom: 11px;
          img{
            height: 30px;
          }
          .name{
            font-family: PingFangSC-Medium;
            font-size: 16px;
            letter-spacing: 0;
            &.host-name{
              color: $blue;
              span{
                margin-left: 8px;
                display: inline-block;
                min-height: 30px;
              }
            }
            &.guest-name{
              color: $blue;
              span{
                margin-right: 8px;
              }
            }
          }
        }
        .info-table{
          overflow: hidden;
          .host, .guest{
            width: 574px;
            &.host{
              margin-right: 12px;
            }
            .integral-table:nth-child(2){
              margin-top: 37px;
            }
          }
        }
      }

      .recent-records{
        .wrap-inner{
          overflow: hidden;
          position: relative;
        }
        .host-team,.guest-team{
          width:  574px;
          float: left;
          overflow: hidden;
          .filter{
            margin-bottom: 16px;
            line-height: 24px;
            overflow: hidden;
            font-size: 14px;
            .name{
              font-family: PingFangSC-Medium;
              font-size: 16px;
              color: $blue;
              letter-spacing: 0;
              line-height: 24px;
              display: inline-block;
              vertical-align: sub;
            }
            /deep/ .ivu-radio-wrapper{
              margin-right: 12px;
              &:last-child{
                margin-right: 16px;
              }
            }
          }
          &.host-team{
            margin-right: 12px;
            .choice{
              display: inline-block;
              margin-left: 12px;
              line-height: 30px;
            }
            .ivu-checkbox-group{
              margin-right: 12px;
              display: inline-block;
            }
          }
          &.guest-team{
            .name{
              color:  $blue;
              float: right;
            }
            .choice{
              float: right;
              margin-right: 12px;
              line-height: 30px;
            }
            .ivu-checkbox-group{
              margin-right: 16px;
              display: inline-block;
            }
          }
        }
      }
      .trend{
        .wrap-inner{
          overflow: hidden;
          .host-team,.guest-team{
            width:  574px;
            float: left;
            .head{
              margin-bottom: 16px;
              line-height: 30px;
              height: 30px;
              overflow: hidden;
              font-size: 14px;
              .name{
                font-family: PingFangSC-Medium;
                font-size: 16px;
                color: $blue;
                letter-spacing: 0;
                line-height: 24px;
                display: inline-block;
                vertical-align: middle;
              }
            }

            &.host-team{
              margin-right: 12px;
            }
            &.guest-team{
              .name{
                color: $blue;
                float: right;
              }
            }
          }
        }
      }
      .scoreboard{
        .wrap-inner{
          padding-left: 0;
          padding-right: 0;
        }
      }
    }
  }

  .match-filter{
    /deep/ {
      .ivu-select-placeholder{
        color: #515a6e;
        padding-right: 4px;
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
