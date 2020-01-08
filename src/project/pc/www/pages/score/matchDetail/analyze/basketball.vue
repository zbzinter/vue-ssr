<!-- 分析页面 -->
<template>
  <div class="match-detail">
    <!-- 右侧固定栏 -->
    <fixed-right :right-navs="rightNavs" />
    <div class="analyze">
      <!-- 联赛积分排名 -->
      <div
        id="rank-id"
        class="rank"
      >
        <h3 class="title hack">
          联赛积分排名
        </h3>
        <div class="wrap-inner">
          <div class="team">
            <div class="guest-name name fl">
              <default-img
                :src="matchData.guestTeamLogo"
                :default-url="defaultImg.basketball"
              />
              <span>{{ matchData.guestTeamName }}</span>
            </div>
            <div class="host-name name fr">
              <span>{{ matchData.hostTeamName }}</span>
              <default-img
                :src="matchData.hostTeamLogo"
                :default-url="defaultImg.basketball"
              />
            </div>
          </div>
          <div class="info-table">
            <div class="guest fl">
              <IntegralRankTable
                :table-data="querySeasonRankData[matchData.guestTeamId] || {}"
                :titles="titles1"
              />
            </div>
            <div class="host fr">
              <IntegralRankTable
                :table-data="querySeasonRankData[matchData.hostTeamId] || {}"
                :titles="titles1"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- 历史交锋 -->
      <div
        id="history-id"
        class="history"
      >
        <h3 class="title">
          历史交锋
        </h3>
        <div class="wrap-inner">
          <HistoryRecentTable
            :titles="titles2"
            :match-data="matchData"
            :self-id="matchData.hostTeamId"
            type="history"
            @getBookNames="getBookNames"
          />
        </div>
      </div>
      <!-- 近期战绩 -->
      <div
        id="recent-id"
        class="recent-records"
      >
        <h3 class="title">
          近期战绩
        </h3>
        <div class="wrap-inner">
          <HistoryRecentTable
            :titles="titles2"
            :match-data="matchData"
            :self-id="matchData.guestTeamId"
            type="recent"
            :team-name="matchData.guestTeamName"
            team-type="host"
            @getBookNames="getBookNames"
          />
        </div>
        <div class="wrap-inner">
          <HistoryRecentTable
            :titles="titles2"
            :match-data="matchData"
            :self-id="matchData.hostTeamId"
            type="recent"
            :team-name="matchData.hostTeamName"
            team-type="guest"
            @getBookNames="getBookNames"
          />
        </div>
      </div>

      <!-- 让分盘路比较 -->
      <div
        id="tape-compare"
        class="tape-compare"
      >
        <h3 class="title">
          让分盘路比较
        </h3>
        <div class="wrap-inner">
          <div class="guest-team">
            <TapeCompareHead
              :match-data="matchData"
              team-type="guest"
              :type="1"
            />
            <TapeCompareTable
              :titles="titles41"
              :obj-val="trendGuestData"
              type="asia"
              :match-data="matchData"
              team-type="guest"
              :is-all-filed="true"
            />
            <TapeCompareTable
              :titles="titles42"
              :obj-val="trendGuestDataHalf"
              type="asia"
              :match-data="matchData"
              team-type="guest"
              :is-all-filed="false"
            />
          </div>
          <div class="host-team">
            <TapeCompareHead
              :match-data="matchData"
              team-type="host"
              :type="1"
            />
            <TapeCompareTable
              :titles="titles41"
              :obj-val="trendHostData"
              type="asia"
              :match-data="matchData"
              team-type="host"
              :is-all-filed="true"
            />
            <TapeCompareTable
              :titles="titles42"
              :obj-val="trendHostDataHalf"
              type="asia"
              :match-data="matchData"
              team-type="host"
              :is-all-filed="false"
            />
          </div>
          <div class="clearfix" />
          <h3
            v-if="trendGuestDataYapan.length > 0 || trendHostDataYapan.length > 0"
            class="title"
          >
            相同历史盘口
          </h3>
          <SameHistory
            :arr-val="trendGuestDataYapan"
            :team-name="matchData.guestTeamName"
            :self-id="matchData.guestTeamId"
            :way="1"
          />
          <SameHistory
            :arr-val="trendHostDataYapan"
            :team-name="matchData.hostTeamName"
            :self-id="matchData.hostTeamId"
            :way="1"
          />
        </div>
      </div>
      <!-- 总分盘路比较 -->
      <div
        id="total-tape"
        class="tape-compare"
      >
        <h3 class="title">
          总分盘路比较
        </h3>
        <div class="wrap-inner">
          <div class="guest-team">
            <TapeCompareHead
              :match-data="matchData"
              team-type="guest"
              :type="2"
            />
            <TapeCompareTable
              :titles="titles41"
              :obj-val="trendGuestData"
              type="dx"
              :match-data="matchData"
              team-type="guest"
              :is-all-filed="true"
            />
            <TapeCompareTable
              :titles="titles42"
              :obj-val="trendGuestDataHalf"
              type="dx"
              :match-data="matchData"
              team-type="guest"
              :is-all-filed="false"
            />
          </div>
          <div class="host-team">
            <TapeCompareHead
              :match-data="matchData"
              team-type="host"
              :type="2"
            />
            <TapeCompareTable
              :titles="titles41"
              :obj-val="trendHostData"
              type="dx"
              :match-data="matchData"
              team-type="host"
              :is-all-filed="true"
            />
            <TapeCompareTable
              :titles="titles42"
              :obj-val="trendHostDataHalf"
              type="dx"
              :match-data="matchData"
              team-type="host"
              :is-all-filed="false"
            />
          </div>
          <div class="clearfix" />
          <h3
            v-if="trendGuestDataDx.length > 0 || trendHostDataDx.length > 0"
            class="title"
          >
            相同历史盘口
          </h3>
          <SameHistory
            :arr-val="trendGuestDataDx"
            :team-name="matchData.guestTeamName"
            :self-id="matchData.guestTeamId"
            :way="3"
          />
          <SameHistory
            :arr-val="trendHostDataDx"
            :team-name="matchData.hostTeamName"
            :self-id="matchData.hostTeamId"
            :way="3"
          />
        </div>
      </div>
      <!-- 技术统计 -->
      <div
        id="skill-statistics"
        class="rank"
      >
        <h3 class="title">
          技术统计
        </h3>
        <div class="wrap-inner w60">
          <!-- <div class="team">
            <div class="guest-name name fl">
              <default-img :src="matchData.guestTeamLogo" />
              <span>{{ matchData.guestTeamName }}</span>
            </div>
            <div class="host-name name fr">
              <span>{{ matchData.hostTeamName }}</span>
              <default-img :src="matchData.hostTeamLogo" />
            </div>
          </div> -->
          <div class="info-table">
            <div class="guest fl">
              <SkillTable
                :table-data="skillStatGuestData"
                team-type="guest"
                :titles="titles5"
                :match-data="matchData"
              />
            </div>
            <div class="host fr">
              <SkillTable
                :table-data="skillStatHostData"
                team-type="host"
                :titles="titles5"
                :match-data="matchData"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- 未来赛事 -->
      <div
        id="uncoming-id"
        class="uncoming"
      >
        <h3 class="title">
          未来赛事
        </h3>
        <div class="wrap-inner w60">
          <div class="info-table">
            <div class="guest fl">
              <UncomingTable
                :table-data="guestUncoming3"
                team-type="guest"
                :titles="titles6"
                :match-data="matchData"
              />
            </div>
            <div class="host fr">
              <UncomingTable
                :table-data="hostUncoming3"
                team-type="host"
                :titles="titles6"
                :match-data="matchData"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- 伤停情况 -->
      <div
        v-if="injuryList.length"
        id="injury-id"
        class="injury"
      >
        <h3 class="title">
          伤停情况
        </h3>
        <div class="wrap-inner">
          <InjuryTable :injury-data="injuryList" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DefaultImg from '@src/components/DefaultImg'
import IntegralRankTable from './widget/basketball/IntegralRankTable'
import TapeCompareHead from './widget/basketball/TapeCompareHead'
import TapeCompareTable from './widget/basketball/TapeCompareTable'
import SameHistory from './widget/basketball/SameHistory'
import HistoryRecentTable from './widget/basketball/HistoryRecentTable'
import InjuryTable from './widget/basketball/InjuryTable'
import SkillTable from './widget/basketball/SkillTable'
import UncomingTable from './widget/basketball/UncomingTable'
import mixins from './widget/mixins.js'
import FixedRight from './widget/FixedRight'
export default {
  name: 'BasketballAnalyze',
  components: {
    FixedRight,
    DefaultImg,
    IntegralRankTable,
    TapeCompareHead,
    TapeCompareTable,
    SameHistory,
    SkillTable,
    UncomingTable,
    HistoryRecentTable,
    InjuryTable
  },
  mixins: [mixins],
  props: [
    'matchData'
  ],
  data () {
    return {
      bookNamesArr: [], //公司名
      guestRecentData: [],
      hostRecentData: [], // 主队近期战绩的数据
      hostLeagueNameArr: [],  // 主队赛名的集合
      guestLeagueNameArr: [],
      tempScroll: 0,
      queryLeagueRankData: [],
      querySeasonRankData: {},
      avgData: [],
      tempRecentGuest: [],
      tempRecentHost: [],
      // recentGuestCheckAll: [],
      // recentHostCheckAll: [],
      // recentHostSize: 10,
      // recentGuestSize: 10,
      // recentHostSide: 0,
      // recentGuestSide: 0,
      // recentHostComName: '0',
      // recentGuestComName: '0',
      trendHostData: [],
      trendGuestData: [],
      trendHostDataHalf: [],
      trendGuestDataHalf: [],
      trendHostDataYapan: [],
      trendHostDataDx: [],
      trendGuestDataYapan: [],
      trendGuestDataDx: [],
      skillStatGuestData: [],
      skillStatHostData: [],
      guestUncoming3: [],
      hostUncoming3: [],
      rightNavs: {
        'rank-id': '积分排名',
        'history-id': '历史交锋', // 历史交锋
        'recent-id': '近期战绩',
        'tape-compare': '让分盘路',
        'total-tape': '总分盘路',
        'skill-statistics': '技术统计',
        'uncoming-id': '未来赛事'
      },
      scoreboardNavs: ['总积分榜', '主场积分榜', '客场积分榜'],
      scoreboardNavActiveIndex: 0,
      titles1: ['全场', '赛', '胜', '负', '得', '失', '净胜', '排名', '胜率'],
      titles2: ['赛事', '比赛日期', '客队', 'field', '主队', '胜负', '分差', '让分盘', '盘路', '总分', '总分盘', '盘路'],
      titles41: ['全场', '赛', '赢盘', '走水', '输盘', '赢盘率', '详情'],
      titles42: ['半场', '赛', '赢盘', '走水', '输盘', '赢盘率', '详情'],
      titles5: ['', '投篮命中率', '三分命中率', '平均篮板', '平均助攻', '平均抢断', '平均失误'],
      titles6: ['赛事', '时间', '客队', '比分', '主队', '与本场相隔'],
      rowTitle5: {
        Goal: '平均入球',
        LostGoal: '平均失球',
        Corner: '平均角球'
      },
      rowTitle6: {
        all: '总',
        host: '主',
        guest: '客',
      },
      injuryList: [] // 伤停名单
    }
  },
  watch: {
    // recentHostSide() {
    //   this.getRecentRecordsData()
    // },
    // recentGuestSide() {
    //   this.getRecentRecordsData('guest')
    // },
    // recentHostSize() {
    //   this.getRecentRecordsData()
    // },
    // recentGuestSize(){
    //   this.getRecentRecordsData('guest')
    // },
    // recentHostComName(val){
    //   if(val === '0') {
    //     this.getRecentRecordsData()
    //     return
    //   }
    //   this.getQueryOddByMatchIds(val, 1, this.hostRecentData.matches, 'recent')
    // },
    // recentGuestComName(val){
    //   if(val === '0') {      
    //     this.getRecentRecordsData('guest')
    //     return
    //   }
    //   this.getQueryOddByMatchIds(val, 1, this.guestRecentData.matches, 'recent')
    // }
  },
  created () {
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
      // this.getRecentRecordsData()
      // 获取客队近期战绩
      // this.getRecentRecordsData('guest')
      // 让分、大小统计 全场和半场
      this.getQueryMatchOddTrend(this.matchData.hostTeamId, 'host', 1)
      this.getQueryMatchOddTrend(this.matchData.guestTeamId, 'guest', 1)
      this.getQueryMatchOddTrend(this.matchData.hostTeamId, 'host', 2)
      this.getQueryMatchOddTrend(this.matchData.guestTeamId, 'guest', 2)
      // 篮球让分、大小分 历史相同盘口
      this.getQueryHistorySameOdd(1)
      this.getQueryHistorySameOdd(3)
      // 平均统计
      this.getQueryTeamGoalByMatchId()
      // 积分排名
      this.getQuerySeasonRank()
      // 联赛积分排名榜
      this.getQueryLeagueRank (2)
      this.getQueryLeagueRank (3)
      // 技术统计
      this.getQuerySeasonTechStat(this.matchData.hostTeamId)
      this.getQuerySeasonTechStat(this.matchData.guestTeamId, 'guest')
      // 获取未来三场数据
      this.getUncoming3()
      this.getUncoming3('guest')
      // 获取伤停名单
      this.getInjuryList()
    },

    goNav(index, navActiveIndex = 'navActiveIndex') {
      if(index !== 0 && navActiveIndex === 'navActiveIndex') {
        this.$tip('暂未开发，敬请期待')
        return
      }
      this[navActiveIndex] = index
      if(navActiveIndex === 'scoreboardNavActiveIndex'){
        this.getQueryLeagueRank(index+1)
      }
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
    // getRecentRecordsData(type = 'host'){ // 获取近期战绩的数据
    //   let teamId = type == 'guest' ? this.matchData.guestTeamId : this.matchData.hostTeamId
    //   let size = type == 'guest' ? this.recentGuestSize : this.recentHostSize
    //   let side = type == 'guest' ? this.recentGuestSide : this.recentHostSide
    //   side = side === 0 ? 'all' : side === 1 ? 'host' : 'guest'
    //   let params = {
    //     teamId,
    //     matchId: this.matchData.matchId,
    //     side,
    //     size
    //   }
    //   if (this.recentLeague) params.leagueId = this.matchData.leagueId
    //   if (this.recentFixed) params.side = type === 'guest' ? type : 'host'
    //   if(this.$requireParams({matchId: this.matchData.matchId, teamId})) return
    //   this.$get('/v4/team/recentRecords', params).then(res => {
    //     if (res.data) {
    //       if (type === 'guest') {
    //         this.recentGuestCheckAll = []
    //         this.guestRecentData = res.data
    //         this.guestLeagueNameArr = this.handlerLeagueName(res.data.matches)
    //         this.tempRecentGuest = [...res.data.matches]
    //         this.$nextTick(()=>{
    //           this.recentGuestCheckAll = [...this.guestLeagueNameArr]
    //         })
    //       } else {
    //         this.recentHostCheckAll = []
    //         this.hostRecentData = res.data
    //         this.hostLeagueNameArr = this.handlerLeagueName(res.data.matches)
    //         this.tempRecentHost = [...res.data.matches]
    //         this.$nextTick(()=>{
    //           this.recentHostCheckAll = [...this.hostLeagueNameArr]
    //         })
    //       }
    //     }
    //   })
    // },
    getQueryHistorySameOdd (way = 1, size = 10) { // 让分和大小分 历史相同盘口接口
      let rate = way === 1 ? this.matchData.asiaRate : way === 3 ? this.matchData.dxRate : ''
      let params = {
        rate,
        matchId: this.matchData.matchId,
        aggr: true,
        type: way,
        size
      }
      if(this.$requireParams({rate: params.rate, matchId: this.matchData.matchId})) return
      this.$get('/v9/queryHistorySameOdd', params).then(res => {
        if (res.data) {
          if(way === 1) {
            this.trendHostDataYapan = res.data[this.matchData.hostTeamId].slice(0, size)
            this.trendGuestDataYapan = res.data[this.matchData.guestTeamId].slice(0, size)
          } else if(way === 3) {
            this.trendHostDataDx = res.data[this.matchData.hostTeamId].slice(0, size)
            this.trendGuestDataDx = res.data[this.matchData.guestTeamId].slice(0, size)
          }
        }
      })
    },
    getQueryMatchOddTrend (teamId, type = 'host', way = 1, size = 10) { // way 全场或者半场
      let params = { 
        teamId,
        matchId: this.matchData.matchId,
        type: way,
        size
      }
      if(this.$requireParams({matchId: this.matchData.matchId, teamId})) return
      this.$get('/v7/queryMatchOddTrend', params).then(res => {
        if (res.data) {
          if(way === 1) {
            if (type === 'host') this.trendHostData = res.data
            if (type === 'guest') this.trendGuestData = res.data
          } else if(way === 2) {
            if (type === 'host') this.trendHostDataHalf = res.data
            if (type === 'guest') this.trendGuestDataHalf = res.data
          }
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
    getQueryLeagueRank (type = 1) { // 联赛积分榜
      let params = {
        seasonId: this.matchData.seasonId,
        type
      }
      if(this.$requireParams(params)) return
      this.$get('/v8/queryLeagueRank', params).then(res => {
        if (res.data) {
          this.queryLeagueRankData = res.data
        }
      })
    },
    getQuerySeasonRank () { // 积分排名
      let params = {
        matchId: this.matchData.matchId
      }
      if(this.$requireParams(params)) return
      this.$get('/v9/querySeasonRank', params).then(res => {
        if (res.data) {
          this.querySeasonRankData = res.data
        }
      })
    },
    getQuerySeasonTechStat (teamId, type) { // 篮球技术统计
      let params = {
        seasonId: this.matchData.seasonId,
        teamId
      }
      if(this.$requireParams(params)) return
      this.$get('/v9/querySeasonTechStat', params).then(res => {
        if (res.data) {
          if(type === 'guest') {
            this.skillStatGuestData = res.data
          } else {
            this.skillStatHostData = res.data
          }
          
        }
      })
    },
    getUncoming3 (type) { // 获取未来三场数据
      let teamId = type === 'guest' ? this.matchData.guestTeamId : this.matchData.hostTeamId
      let params = {
        teamId,
        matchId: this.matchData.matchId,
        currentMatchDate: this.dayjs(this.matchData.matchTime).format('YYYY-MM-DD')
      }
      if(this.$requireParams({matchId: this.matchData.matchId, teamId})) return
      this.$get('/v4/team/uncoming3', params).then(res => {
        if (res.data && res.data.matches) {
          type === 'guest'
            ? this.guestUncoming3 = res.data.matches
            : this.hostUncoming3 = res.data.matches
        }
      })
    },
    getInjuryList() {
      let params = {
        matchId: this.matchData.matchId
      }
      this.$get('/v21/query/match/injured', params).then(res => {
        this.injuryList = res.data
        if(Array.isArray(this.injuryList) && this.injuryList.length) {
          this.rightNavs['injury-id'] = '伤停情况'
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
$blue: #3683FF;
.ellipsis{
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
      padding: 27px 30px 40px;
      box-shadow: 0 6px 24px 0 rgba(0, 0, 0, 0.03);
      background: #fff;
      &.hack{
        padding: 20px 30px 25px;
      }
      &+.wrap-inner{
        padding-top: 0;
      }
      &.w60{
        padding-left: 60px;
        padding-right: 60px;
      }
    }
    .analyze{
      margin: 0 auto;
      width: 1200px;
      .rank{
        .team{
          height: 60px;
          line-height: 60px;
          margin-bottom: 18px;
          img{
            height: 60px;
          }
          .name{
            font-family: PingFangSC-Medium;
            font-size: 22px;
            letter-spacing: 0;
            &.guest-name{
              color: $blue;
              span{
                margin-left: 12px;
                display: inline-block;
                min-height: 30px;
              }
            }
            &.host-name{
              color: $blue;
              span{
                margin-right: 12px;
              }
            }
          }
        }
        .info-table{
          overflow: hidden;
          .host, .guest{
            width: 520px;
            &.guest{
              margin-right: 20px;
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
          width:  520px;
          float: left;
          overflow: hidden;
          .filter{
            margin-bottom: 16px;
            padding: 0 14px;
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
              margin-right: 32px;
              &:last-child{
                margin-right: 16px;
              }
            }
          }
          &.host-team{
            margin-right: 20px;
            .choice{
              float: right;
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
            .chioce{
              float: left;
            }
            .ivu-checkbox-group{
              margin-right: 16px;
              display: inline-block;
            }
          }
        }
      }
      .tape-compare{
        .wrap-inner{
          padding-left: 30px;
          padding-right: 30px;
          overflow: hidden;
          .title{
            padding-left: 0;
            padding-bottom: 0;
          }
          .host-team,.guest-team{
            width:  520px;
            &.guest-team{
              float: left;
              margin-left: 30px;
            }
            &.host-team{
              float: right;
              margin-right: 30px;
            }
          }
        }
      }
      .scoreboard{
        .wrap-inner{
          padding-left: 0;
          padding-right: 0;
          .navs{
            height: 28px;
            margin: 0 30px 10px;
            li{
              height: 28px;
              line-height: 28px;
              float: left;
              font-family: PingFangSC-Medium;
              font-size: 16px;
              color: #5E5E5E;
              letter-spacing: 0;
              margin-right: 26px;
              line-height: 28px;
              padding: 0 9px;
              cursor: pointer;
              position: relative;
              text-align: center;
              &.active{
                background: $blue;
                color:#fff;
                cursor: default;
                border-radius: 14px;
              }
            }
          }
        }
      }
      .uncoming{
        .wrap-inner{
          overflow: hidden;
        }
        .guest, .host{
          width: 520px;
        }
        .team{
          overflow: hidden;
          margin-bottom: 12px;
        }
      }
    }
  }
</style>
