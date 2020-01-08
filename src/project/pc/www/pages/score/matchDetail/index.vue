<!-- 分析页面 -->
<template>
  <div class="analyze">
    <!-- 头部 -->
    <div
      v-if="spinShow"
      class="page-inner integral-rank-wrap"
    >
      <div class="team">
        <!-- <div class="league-info">
          <default-img :src="matchData.leagueLogo" />
          <span>{{ dayjs(matchData.matchTime).format('YYYY-MM') }} </span>
          {{ `${ matchData.sportId === 2 ? matchData.leagueNick : matchData.leagueNick + matchData.round || '联赛' }` }}
        </div> -->
        <div :class="['host-name', 'name', {'tip-basketball': sportType.isBasketball}]">
          <span class="ellipsis">{{ sportType.isFootball ? matchData.hostTeamName : matchData.guestTeamName }}</span>
          <default-img 
            :src="sportType.isFootball ? (matchData.hostTeamLogo || defaultImg.football) : (matchData.guestTeamLogo || defaultImg.basketball)" 
            :default-type="sportType.isFootball ? 1 : sportType.isBasketball ? 2 : ''"
          />
        </div>
        <div class="score">
          <!-- 比赛类型及赛况信息 -->
          <p class="league-name">
            {{ `${ (matchData.sportId === 2 ? matchData.leagueNick : `${matchData.leagueNick || ''}` + `${matchData.round || ''}`) || '联赛' }` }}
            &nbsp;
            {{ showTime ? `${ matchData.matchStatusDesc } ${ matchData.sportId === 2 ? playedBasketball : ''} ${ matchData.sportId === 1 ? played : '' }` : matchStatus }}
            <span>&nbsp;{{ (showTime && matchData.sportId == 2) ? 'live' : '' }}</span>
          </p>
          <!-- 比分 -->
          <p
            v-if="matchData.matchStatus !== 1"
            class="team-score"
          >
            <span>{{ sportType.isFootball ? matchData.hostTeamNormalScore : matchData.guestTeamScore }}</span>
            <span class="ii">:</span>
            <span>{{ sportType.isFootball ? matchData.guestTeamNormalScore : matchData.hostTeamScore }}</span>
          </p>
          <p
            v-else
            class="team-score"
          >
            VS
          </p>
          <!-- 比赛开始时间 -->
          <p class="match-time">
            {{ dayjs(matchData.matchTime).format('YYYY-MM-DD HH:mm') }}
          </p>
        </div>
        <div :class="['guest-name', 'name', {'tip-basketball': sportType.isBasketball}]">
          <default-img :src="sportType.isFootball ? (matchData.guestTeamLogo || defaultImg.football) : (matchData.hostTeamLogo || defaultImg.basketball)" />
          <span
            v-show="matchData.hostTeamName"
            class="ellipsis"
          >{{ sportType.isFootball ? matchData.guestTeamName : matchData.hostTeamName + '(主)' }}</span>
        </div>
      </div>
      <ul class="navs">
        <li
          v-for="(nav, index) in navs"
          :key="index"
          :class="['nav', {'active': navActiveIndex === index}]"
          @click="goNav(nav, index)"
        >
          {{ nav.name }}
        </li>
      </ul>
    </div>
    <Spin
      v-else
      fix
    >
      <Icon
        type="ios-loading"
        size="18"
        class="spin-icon-load"
      />
      <div>Loading</div>
    </Spin>
    <router-view
      v-if="matchDataLength"
      :match-data.sync="matchData"
      @setNavs="setNavs"
    />
    <!-- 侧边工具栏 -->
    <side-tools :no-o-player="true" />
  </div>
</template>

<script>
import { Spin, Icon } from 'iview'
import navs from './navs.js'
import MqttBase from '@utils/MqttBase'
import SideTools from '../../home/components/SideTools'
let subscribeList = ['topic_mq/match/*/score', 'topic_mq/match/*/status', 'topic_mq/match/*/compareOdds', 'topic_mq/match/*/loOddsData']
export default {
  name: 'ScoreDetailIndex',
  components: {
    Spin,
    Icon,
    SideTools
  },
  data () {
    return {
      spinShow: false,
      navs: [],
      sportType: {
        isFootball: false,
        isBasketball: false
      },
      matchDataLength: 0,
      matchData: {},
      navActiveIndex: 0,
      time: '',
      timer: null,
      setSecond: null,
      timerBasketball: null
    }
  },
  computed: {
    matchStatus () {
      let status = this.matchData.matchStatus
      if (status === 1 || status === 4) return '未'
      if (status === 3) return '完'
      return '未知'
    },
    showTime () {
      return this.matchData.matchStatus === 2
    },
    played () {
      if (this.setSecond || this.setSecond === 0) {
        if (this.time > 90) return '90\'+'
        return this.time + '\'' + this.setSecond + '\'\''
      }
      return ''
    },
    playedBasketball(){
      return this.matchData.timePlayed ? this.dayjs(this.matchData.timePlayed*1000).format('mm:ss') : ''
    }
  },
  created () {
    let sportId = /football/.test(this.$route.path) ? 1 : 2 //临时
    this.setSportId(sportId)
    //this.init()
  },
  mounted(){
    this.init()
  },
  beforeDestroy () {
    clearInterval(this.timer)
    clearInterval(this.timerBasketball)
    this.mqtt.unsubscribe(subscribeList)
  },
  methods: {
    setSportId(sportId){
      switch(sportId){
      case 1 : this.sportType.isFootball = true;break
      case 2 : this.sportType.isBasketball = true;break
      }
    },
    init () {
      if(this.$requireParams({matchId: this.$route.params.matchId})) return
      this.$get('/v5/match/match', {id: this.$route.params.matchId}).then(res => { // 获取matchData初始数据
        if (res.data) {
          this.matchData = res.data
          subscribeList = subscribeList.map(item => item.replace('*', this.matchData.matchId))
          this.setMqtt()
          this.matchData.timePlayed = Math.abs(this.matchData.timePlayed)
          this.matchDataLength = Object.keys(this.matchData).length
          if (this.matchData.matchStatus === 2) {
            if(this.matchData.sportId === 1) {
              this.startTime()
            } else if(this.matchData.sportId === 2) {
              this.startTimeBasketball()
            }
          }
          this.setSportId(res.data.sportId)
        } else {
          // console.log('获取数据失败')
        }
        this.setNavs()
      }).finally(() => {
        this.spinShow = true
      })
    },
    setMqtt() {
      const mqtt = new MqttBase(this.getMessage)
      this.mqtt = mqtt
      this.mqtt.subscribe(subscribeList)
    },
    getMessage (topic, mqttMsg) {
      // console.log('topic Obj', mqttMsg)
      if (mqttMsg.mqttName === 'score' && mqttMsg.matchId === this.matchData.matchId) {
        if(mqttMsg.sportId === 1) {
          this.matchData = {
            ...this.matchData,
            hostTeamNormalScore: mqttMsg.hostTeamScore,
            guestTeamNormalScore: mqttMsg.guestTeamScore
          }
        }
        if(mqttMsg.sportId === 2) {
          this.matchData = {
            ...this.matchData,
            hostTeamScore: mqttMsg.hostTeamScore,
            guestTeamScore: mqttMsg.guestTeamScore,
            timePlayed: Math.abs(mqttMsg.timePlayed)
          }
        }
      } 
      if (mqttMsg.sportId === 2 && mqttMsg.mqttName === 'status') {
        this.matchData = {
          ...this.matchData,
          matchStatusDesc: mqttMsg.statusDesc,
          timePlayed: Math.abs(mqttMsg.timePlayed)
        }
      } 
    },
    setNavs () {
      if (this.$route.matched[0].name === 'footballDetail') {
        this.navs = navs(this.matchData.matchId).football
      } else if (this.$route.matched[0].name === 'basketballDetail') {
        this.navs = navs(this.matchData.matchId).basketball
      }
      this.navActiveIndex = this.navs.findIndex(item => item.url === this.$route.path)
    },
    startTime () {
      clearInterval(this.timer)
      if (this.matchData.timePlayed) {
        let matchStatusCode = this.matchData.matchStatusCode
        let useTime = Math.floor(this.matchData.timePlayed / 60)
        this.setSecond = Math.floor(this.matchData.timePlayed % 60)
        if (useTime < 0) useTime = 0
        this.time = useTime
        this.timer = setInterval(() => {
          this.setSecond = this.setSecond + 1
          if (this.setSecond === 60) {
            this.setSecond = 0
            this.time += 1
          }
        }, 1000)
      }
    },
    startTimeBasketball(){
      clearInterval(this.timerBasketball)
      if (this.matchData.timePlayed) {
        let useTime = Math.floor(Math.abs(this.matchData.timePlayed / 60)) // 分钟
        this.setSecond = Math.floor(Math.abs(this.matchData.timePlayed % 60)) // 秒
        if (useTime < 0) useTime = 0
        this.time = useTime
        this.timerBasketball = setInterval(() => {
          
          if (this.setSecond === 0) {
            this.setSecond = 60
            this.time -= 1
          }
          this.setSecond = this.setSecond - 1
        }, 1000)
      }
    },
    goNav(nav, index) {
      // console.log(nav, index)
      // if(index !== 0) {
      //   this.$tip('暂未开发，敬请期待')
      //   return
      // }
      if(nav.key !== 'live') {
        this.navActiveIndex = index
      }
      this.$router[nav.key === 'live' ? 'openNewPage' : 'push'](nav.url)
    }
  }
}
</script>

<style lang="scss" scoped>
      $red: #E15756;
      $blue: #3683FF;
      .ellipsis{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      };
      /deep/ .ivu-spin-fix{
        z-index: 0;
        .ivu-spin-main{
          top: 30%;
        }
      }
    .integral-rank-wrap{
      overflow: hidden;
      margin: auto;
      width: 1200px;
      height: 227px;
      background-color: #fff;
      margin-top: 74px;
      margin-bottom: 15px;
      .team{
        overflow: hidden;
        position: relative;
        height: 156px;
        margin-top: 13px;
        border-bottom: 1px solid #F4F4F4;
        .league-info{
          position: absolute;
          left: 28px;
          top: 20px;
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: #666666;
          letter-spacing: 0;
          text-align: center;
          img{
            width: 30px;
            height: 30px;
            margin-right: 14px;
          }
        }
        .name{
          font-family: PingFangSC-Semibold;
          font-size: 28px;
          color: #333333;
          letter-spacing: 0;
          text-align: right;
          line-height: 90px;
          padding: 44px 0 22px;
          position: absolute;
          span{
            display: inline-block;
            vertical-align: middle;
            max-width: 340px;
            font-family: PingFangSC-Semibold;
            font-weight: 600;
            font-size: 28px;
            color: #333333;
          }
          &.host-name{
            right: 50%;
            margin-right: 131px;
            span{
              margin-right: 16px;
            }
          }
          &.guest-name{
            left: 50%;
            margin-left: 131px;
            span{
              margin-left: 16px;
            }
          }
          img{
            height: 90px;
          }
        }
        .score{
          position: absolute;
          left: 0;
          right: 0;
          text-align: center;
          .league-name{
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #A6A6A6;
            letter-spacing: 0;
            text-align: center;
            line-height: 14px;
            margin-top: 26px;
            span{
              color: #E99392;
            }
          }
          .match-time{
            margin-top: 13px;
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #A6A6A6;
            line-height: 12px;
          }
          .team-score{
            line-height: 48px;
            height: 48px;
            margin-top: 22px;
            font-family: DINCondensed-Bold;
            font-size: 62px;
            color: #333333;
            letter-spacing: 0;
            text-align: center;
            box-sizing: border-box;
            span{
              display: inline-block;
              line-height: 48px;
              height: 48px;
            }
            span.ii{
              width: 22px;
              margin: 0 15px 0 15px;
              font-size: 40px;
              color: #666666;
              font-style: normal;
              position: relative;
              top: -9px;
            }
          }
        }
      }
      .navs{
        height: 58px;
        display: flex;
        justify-content: center;
        li{
          height: 58px;
          position: relative;
          font-family: PingFangSC-Regular;
          font-size: 20px;
          color: #878787;
          margin-right: 79px;
          padding: 16px 0 14px;
          cursor: pointer;
          white-space: nowrap;
          &:last-child{
            margin-right: 0;
          }
          &.active, &:hover{
            color: $blue;
            font-weight: 600;
            cursor: default;
            &.active{
              &:after{
                position: absolute;
                content: '';
                height: 3px;
                background: $blue;
                left: -4px;
                right: -4px;
                bottom: 0;
              }
            }
          }
        }
      }
    }
</style>
