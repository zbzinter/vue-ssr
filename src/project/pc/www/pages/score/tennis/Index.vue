<!-- 网球 -->
<template>
  <div class="tennis-score-page">
    <audio
      id="ring-audio"
      ref="ringAudio"
      controls="controls"
      preload="auto"
      hidden="true"
    >
      <source
        src="../../../static/assets/tennis_goal.mp3"
        type="audio/ogg"
      >
      <source
        src="../../../static/assets/tennis_goal.mp3"
        type="audio/mpeg"
      >
      您的浏览器不支持 audio 元素。
    </audio>
    <div class="filter">
      <!-- 赛事状态及提示音选择 -->
      <div
        id="point"
        class="status-select"
      >
        <ul>
          <li
            v-for="({name, key}, index) in tab"
            :key="index"
            class="tab"
            :class="index === selectTabActive ? 'active' : ''"
            @click="selectTab(index)"
          >
            {{ name }}
          </li>
        </ul>
        <div
          v-if="isNow"
          :class="['tip-audio', {close: closeAudio}]"
          @click="closeAudioHandler()"
        >
          提示音 {{ closeAudio ? 'ON' : 'OFF' }}
        </div>
      </div>
      <!-- 选择赛事 -->
      <div class="select-match">
        <div class="match">
          <Dropdown
            class="filter-dropdown"
            trigger="custom"
            :visible="visible"
            placement="bottom-start"
          >
            <a
              :class="{ active: visible }"
              href="javascript:void(0)"
              @click.stop="handleOpen"
            >
              选择赛事
              <i
                class="ivu-icon ivu-icon-ios-arrow-down"
              />
            </a>
            <Dropdown-menu slot="list">
              <CompetitionList
                v-if="competitionName.length"
                ref="CompetitionList"
                :is-show="true"
                :competition-name="competitionName"
                :select-league="selectLeague"
                :temp-hide-list="tempHideList"
                :hide-list="hideList"
                :all-match="allMatch"
                @selectCompetition="selectCompetition"
                @changeHideList="changeHideList"
                @cancel="cancelSelectCompetition"
              />
            </Dropdown-menu>
          </Dropdown>
          <span class="total">共计<i class="total-count"> {{ allMatch.length }} </i>场，隐藏<i class="hide-count"> {{ allMatch.length - allShowMatch.length }} </i>场</span>
        </div>
      </div>
      <DayList
        v-if="!isNow"
        :status="selectTabActive === 1 ? 3 : 1"
        :start-time="activeDate"
        placement="bottom"
        @changeDate="changeDate"
      />
    </div>
    <div :class="['list', 'loading', {'no-data': noData}]">
      <Spin
        v-if="spinShow"
        fix
      >
        <Icon
          type="ios-loading"
          size="18"
          class="spin-icon-load" 
        />
        <div>Loading</div>
      </Spin>
      <div v-if="matchData">
        <MatchList
          v-if="stickMatches.length"
          type="stick"
          :matches="stickMatches"
          :scroll-top="scrollTop"
          :select-tab-active="selectTabActive"
        />
        <MatchList
          v-if="showData.going && showData.going.matches.length"
          type="going"
          title-name="进行中"
          :title-img="require('@src/assets/score/av_bj.png')"
          :matches="showData.going.matches"
          :stick-list="stickList"
          :select-tab-active="selectTabActive"
          :scroll-top="scrollTop"
        />
        <MatchList
          v-if="showData.uncoming && showData.uncoming.matches.length"
          type="uncoming"
          title-name="未开始"
          :title-img="require('@src/assets/score/aw_bj.png')"
          :matches="showData.uncoming.matches"
          :stick-list="stickList"
          :select-tab-active="selectTabActive"
          :scroll-top="scrollTop"
        />
        <MatchList
          v-if="showData.finished && showData.finished.matches.length"
          type="finished"
          title-name="已完场"
          :title-img="require('@src/assets/score/ax_bj.png')"
          :matches="showData.finished.matches"
          :stick-list="stickList"
          :select-tab-active="selectTabActive"
          :scroll-top="scrollTop"
        />
        <MatchList
          v-if="showData.unknown && showData.unknown.matches.length"
          type="unknown"
          title-name="异常的比赛"
          :title-img="require('@src/assets/score/ay_bj.png')"
          :matches="showData.unknown.matches"
          :stick-list="stickList"
          :select-tab-active="selectTabActive"
          :scroll-top="scrollTop"
        />
      </div>
      <div
        v-if="!spinShow && noData" 
        class="empty-listempty-list"
      >
        暂无数据
      </div>
    </div>
    <div class="hide-wrap">
      <Affix
        :offset-top="200"
      >
        <ul class="hide-list">
          <li @click="saveList()">
            <p class="retain" />
          </li>
          <li
            @click="addHideList()"
          >
            <div class="hide" />
          </li>
          <li
            @click="cancelHideList()"
          >
            <div class="all" />
          </li>
        </ul>
      </Affix>
    </div>
    <!-- 返回顶部 -->
    <!-- <div :class="['return-top-container', {'is-arrive-bottom': isArriveBottom}]">
      <div
        v-if="isShowReturnTop"
        class="return-top"
        @click="returnTop"
      >
        <div class="return-top__img" />
      </div>
    </div> -->
    <!-- 侧边工具栏 -->
    <SideTools
      :no-o-player="true"
      :immediate-top="true"
    />
  </div>
</template>
<script>
import MqttBase from '@utils/MqttBase'
import mixin from './../mixins'
import MatchList from './components/MatchList'
import DayList from '../components/DayList'
import CompetitionList from '../components/CompetitionList'
import _ from 'lodash'
import { Dropdown, DropdownMenu, Spin, Icon, Affix } from 'iview'
import SideTools from '../../home/components/SideTools'
const subscribeList = ['topic_mq/match/*/sportScoreStatus']
export default {
  components: {
    Dropdown, 
    DropdownMenu,
    MatchList,
    Spin,
    Icon,
    DayList,
    CompetitionList,
    Affix,
    SideTools
  },
  mixins: [mixin],
  props: [

  ],
  data() {
    return {
      scrollTop: 0,
      mqtt: null,
      isShowReturnTop: false,
      isArriveBottom: false,
      // start 选择赛事相关参数
      visible: false,
      selectTabActive: 0,
      competitionName: [],
      selectLeague: '全部', // 单选（扩展）
      closeAudio: false,
      // end 选择赛事
      selects: [], // 选择赛事，确定后的赛事ID
      tempHideList: [], // 选中状态没确定前的临时存储
      hideList: [], // 隐藏赛事列表
      spinShow: false,
      matchData: [],
      filterData: [],
      allCount: 0,
      stickList: []
    }
  },
  computed: {
    stickMatches () {
      let arr = []
      if (!this.stickList.length) return arr
      this.allMatch.forEach(match => {
        if (this.stickList.indexOf(match.matchId) !== -1 && this.hideList.indexOf(match.matchId) === -1) {
          arr.push(match)
        }
      })
      return arr
    },
    // 是否是即时比分
    isNow () {
      return this.selectTabActive === 0
    },
    noData(){
      return !this.allShowMatch.length
    },
    allShowMatch () {
      let arr = Object.keys(this.showData).length && [].concat.apply([], Object.values(this.showData).map(item => item.matches))
      return arr || []
    },
    allMatch () {
      let arr = Object.keys(this.matchData).length && [].concat.apply([], Object.values(this.matchData).map(item => item.matches))
      return arr || []
    },
    // competitionName(){
    //   let competitionName = []
    //   this.allMatch.forEach((item) =>{
    //     if(!competitionName.map(ele=>ele.leagueId).includes(item.leagueId)) {
    //       competitionName.push({
    //         leagueId: item.leagueId,
    //         leagueName: item.leagueName,
    //         matches: [item.matchId]
    //       })
    //     } else {
    //       competitionName.find(ele=>ele.leagueId === item.leagueId).matches.push(item.matchId)
    //     }
    //   })
    //   return competitionName
    // },
    showData(){ // 当前显示的数据（过滤，和matchData的数据结构一致）
      let temp = {
        going: {
          matches: []
        },
        uncoming: {
          matches: []
        },
        finished: {
          matches: []
        },
        unknown: {
          matches: []
        }
      }
      for (const [index, item] of Object.entries(this.matchData)) {
        item.matches.map((ele) => {
          // 选择赛事,点击确定
          if(!this.hideList.includes(ele.matchId)){
            temp[index].matches.push(ele)
          } else {
            this.$set(ele, 'isChecked', false)
          }
        })
      }
      return temp
    }
  },
  mounted() {
    this.$nextTick(()=>{
      this.init()
    })
  },
  beforeDestroy () {
    this.mqtt.unsubscribe(subscribeList)
    window.removeEventListener('scroll', this.tempReturnTopFunc)
  },
  methods: {
    init(){
      this.setMqtt()
      document.onclick = () => {
        this.visible = false
      }
      document.querySelector('.ivu-select-dropdown').onclick = (ev) => {
        ev.stopPropagation()
      }
      this.getQueryAllByStatus()
      // 获取赛选列表
      this.queryFilter()
      this.activeDate = this.dateFormate(new Date(), 'yyyy-MM-dd')
      this.tempReturnTopFunc = _.debounce(this.isShowReturnTopFunc, 200)
      window.addEventListener('scroll', this.tempReturnTopFunc)
      this.bus.$on('stickAdd', match => {
        this.stickList.push(match.matchId)
      })
      this.bus.$on('stickDel', match => {
        this.stickList.splice(this.stickList.indexOf(match.matchId), 1)
      })
    },
    isInVisibleArea(elem){
      if(!elem || !elem.getBoundingClientRect) return false

      var rect = elem.getBoundingClientRect()
    
      if(rect.top < window.innerHeight && rect.bottom > 0 &&
        rect.left < window.innerWidth && rect.right > 0){
        return true
      }else{
        return false
      }
    },
    isShowReturnTopFunc(){
      let bottomHeight = document.querySelector('.footer').clientHeight + 50
      let wrapEle = document.documentElement || document.body
      this.scrollTop = wrapEle.scrollTop
      this.isShowReturnTop = wrapEle.scrollTop>0
      if (wrapEle.scrollHeight-wrapEle.scrollTop-wrapEle.clientHeight < bottomHeight) {
        this.isArriveBottom = true
      } else {
        this.isArriveBottom = false
      }
    },
    returnTop() {
      let anchor = this.$el.querySelector('#point')
      document.documentElement.scrollTop = anchor.offsetTop
      this.scrollTop = 0
    },
    selectTab(index) {
      this.selectTabActive = index
      if (index === 0) {
        this.getQueryAllByStatus()
        this.queryFilter()
      } else {
        this.activeDate = this.dateFormate(new Date(), 'yyyy-MM-dd')
        let status = index === 1 ? 3 : 1
        this.getQueryAllByStatus({ status, date: this.activeDate })
        this.queryFilter({ status, date: this.activeDate })
      }
    },
    selectCompetition(selectIds) {
      this.visible = false
      this.selects = selectIds
    },
    changeHideList(selectIds){ // 选择赛事确定时重置隐藏列表
      this.hideList = this.allMatch.filter(item=>{
        if(item.isChecked) item.isChecked = false
        return !selectIds.includes(item.matchId)
      }
      ).map(item=>item.matchId)
      this.tempHideList = [...this.hideList]
    },
    cancelSelectCompetition () {
      this.visible = false
    },
    handleOpen () {
      if(!this.competitionName.length) {
        this.$tip('暂无数据')
        return
      }
      this.visible = true
    },
    closeAudioHandler(){
      this.closeAudio = !this.closeAudio
    },
    // 获取比赛列表
    getQueryAllByStatus(params = {}) {
      this.spinShow = true
      params.date = params.date || this.dayjs(new Date()).format('YYYY-MM-DD')
      params.sportType = 5
      params.bookId = 31
      this.$get('/v8/queryAllByStatus', params)
        .then(res => {
          this.spinShow = false
          const { code, data } = res
          if (this.$judgeCode(code)) {
            this.matchData = data
            this.filterData = data
            // 用reduce
            this.allCount = 0
            Object.keys(data).forEach(item => {
              this.allCount += data[item].count
            })
          } else {
            this.matchData = []
            this.filterData = []
            this.allCount = 0
          }
        })
        .catch(() => {
          this.spinShow = false
        })
    },
    // 获取赛事筛选列表
    queryFilter (params = {}) {
      params.sportType = 5
      params.date = params.date || this.dayjs(new Date()).format('YYYY-MM-DD')
      params.bookId = 31
      this.$get('/v8/queryLeagueRateInfo', params)
        .then(res => {
          let obj = [].concat.apply([], Object.values(res.data.alpha))
          if (obj) {
            this.competitionName = obj
          } else {
            this.competitionName = []
          }
        })
    },
    changeDate (date) {
      let status = this.selectTabActive === 1 ? 3 : 1
      this.activeDate = date
      this.getQueryAllByStatus({ status, date: this.activeDate })
      this.queryFilter({ status, date: this.activeDate })
    },
    tempHide(isChecked, id) {
      if(isChecked){
        this.tempHideList.push(id)
      } else {
        let ind = this.tempHideList.findIndex(matchId=>matchId === id)
        this.tempHideList.splice(ind, 1)
      }
      this.tempHideList = Array.from(new Set(this.tempHideList))
    },
    addHideList () {
      if(this.hideList.length === this.tempHideList.length) {
        this.$tip('请选择隐藏的赛事！')
        return
      }
      this.hideList = [...this.tempHideList]
      this.$refs.CompetitionList.bindHideList()
    },
    saveList(){
      if(this.hideList.length === this.tempHideList.length) {
        this.$tip('请选择保留的赛事！')
        return
      }
      let showList = this.allShowMatch.filter(item => item.isChecked).map(item=>{
        return item.matchId
      })
      this.hideList = this.allMatch.filter(item => !showList.includes(item.matchId)).map(item=>item.matchId)
      this.tempHideList = [...this.hideList, ...showList]
      this.$refs.CompetitionList.bindHideList(1)
    },
    cancelHideList () {
      this.hideList = []
      this.tempHideList = []
      this.$refs.CompetitionList.bindHideList()
    },
    setMqtt() {
      this.mqtt = new MqttBase(this.getMessage)
      this.mqtt.subscribe(subscribeList)
    },
    getMessage (topic, mqttMsg) {
      if(mqttMsg.sportId != 5) return
      if(Object.prototype.toString.call(mqttMsg) === '[object Object]'){ // 处理推送数据类型变化的问题
        mqttMsg.matchId = mqttMsg.matchId && parseInt(mqttMsg.matchId)
        mqttMsg.sportId = mqttMsg.sportId && parseInt(mqttMsg.sportId)
        mqttMsg.status = mqttMsg.status && parseInt(mqttMsg.status)
        mqttMsg.statusCode = mqttMsg.status && parseInt(mqttMsg.statusCode)
      }
      if (mqttMsg.mqttName === 'sportScoreStatus') {
        this.allMatch.filter(Boolean).some((item, index) => {
          if (item.matchId == mqttMsg.matchId) {
            if(mqttMsg.gameScore!=item.gameScore){
              mqttMsg.matchId = parseInt(mqttMsg.matchId)
              mqttMsg.sportId = parseInt(mqttMsg.sportId)
              let itemScore = item.gameScore.split(':')
              let mqttScore = mqttMsg.gameScore.split(':')
              if(itemScore[0]!=mqttScore[0] && mqttScore[0]!=0) {
                this.$set(item, 'isChangeHostScore', true)
              } else if(itemScore[1]!=mqttScore[1] && mqttScore[1]!=0) {
                this.$set(item, 'isChangeGuestScore', true)
              }
              let changeScore = setTimeout(()=>{
                item && this.$delete(item, 'isChangeHostScore')
                item && this.$delete(item, 'isChangeGuestScore')
                clearTimeout(changeScore)
              }, 3000)
              if(!this.closeAudio && this.isNow){
                this.$nextTick(()=>{
                  let audio = this.$refs.ringAudio
                  try {
                    audio.play()
                  } catch(e){
                    console.warn(e)
                  }
                })
              }
            }
            let reg = /^(40|41|42|43|44)$/
            let itemAbnormal = reg.test(item.statusCode)
            let mqttMsgAbnormal = reg.test(mqttMsg.statusCode)
            let abnormalChanged = (itemAbnormal && !mqttMsgAbnormal) || (!itemAbnormal && mqttMsgAbnormal)
            if(item.status != mqttMsg.status || (item.status == mqttMsg.status && abnormalChanged)) {
              this.pushToList(item, mqttMsg)
              item.matchStatusDesc = mqttMsg.statusDesc
              item.statusDesc = mqttMsg.statusDesc
              item.timePlayed = Math.abs(mqttMsg.timePlayed)
              item.status = mqttMsg.status
              item.statusCode = mqttMsg.statusCode
            }
            item = Object.assign(item, mqttMsg)
            return true
          }
        })
      }
    },
    pushToList(findItem, mqttMsg){
      // 排除重复的推送
      let reg = /^(40|41|42|43|44)$/
      if(!reg.test(findItem.statusCode) && !reg.test(mqttMsg.statusCode) && (findItem.status == mqttMsg.status)) { // 都不在异常列表, 状态相同时return
        return
      }
      if(reg.test(findItem.statusCode) && reg.test(mqttMsg.statusCode)) { // 都在异常列表
        return
      }
      let curArrList = this.getBunchList(findItem)
      let curIndex = curArrList.findIndex((per)=>per.matchId == findItem.matchId)
      let newArrList = this.getBunchList(mqttMsg)
      if(curIndex === -1) return
      if(!reg.test(mqttMsg.statusCode) && mqttMsg.status == 2) { // 不在异常列表且状态更新在比赛进行中的用push
        newArrList.push(curArrList.splice(curIndex, 1)[0])
      } else {
        newArrList.unshift(curArrList.splice(curIndex, 1)[0])
      }
      console.log('更改列表成功')
    },
    getBunchList(item){
      let bunchList = null
      switch(parseInt(item.status)){
      case 1: bunchList = this.matchData.uncoming.matches;break
      case 2: bunchList = this.matchData.going.matches;break
      case 3: bunchList = this.matchData.finished.matches;break
      default: bunchList = this.matchData.unknown.matches
      }
      if(/^(40|41|42|43|44)$/.test(item.statusCode)) {
        bunchList = this.matchData.unknown.matches
      }
      return bunchList
    }
  }
}
</script>
<style scoped lang="scss">
.tennis-score-page{
  width: 1200px;
  margin: 0 auto;
  position: relative;
  i{
    font-style: normal;
  }
  .loading{
    position: relative;
    min-height: 400px;
    /deep/ .ivu-spin-fix .ivu-spin-main {
      top: 100px;
    }
    &.no-data{
      background: #fff;
    }
  }
  .empty-listempty-list{
    
    text-align: center;
    padding-top: 100px;
  }

  .select-competition {
    /deep/ .ivu-checkbox-wrapper {
      margin-right: 0;
      font-size: 14px;
      margin-bottom: 20px;
      margin-right: 20px;
      width: auto;
    }
    /deep/ .ivu-checkbox-group{
      margin-right: 12px;
    }
  }
  .filter-dropdown {
    line-height: initial;
      margin-right: 24px;
    /deep/ .ivu-select-dropdown{
      padding: 0;
    }
    /deep/ .ivu-checkbox-wrapper .ivu-tooltip-rel {
      // @include ellipsis(auto, 120px);
      vertical-align: text-top;
      white-space: pre-wrap;
    }
    /deep/ .ivu-tooltip-popper {
      pointer-events: none;
    }
    a {
      padding: 0 12px;
    }
  }

  .filter{
    .status-select{
      position: relative;
      overflow: hidden;
      margin-top: 20px;
      margin-bottom: 4px;
      &::before{
        content: '';
        position: absolute;
        z-index: 10;
        width: 100%;
        height: 2px;
        background: $blue;
        bottom: 0;
        left: 0;
      }
      ul{
        height: 34px;
        float: left;
        li{
          position: relative;
          float: left;
          height: 32px;
          line-height: 32px;
          width: 102px;
          border-radius: 2px 8px 0 0;
          font-family: PingFangSC-Medium;
          font-size: 14px;
          letter-spacing: 0;
          background:  url('../../../assets/score/tab_label_left_n@2x.png') no-repeat center/cover;
          color: #666666;
          cursor: pointer;
          padding-left: 14px;
          &:nth-of-type(1){
            z-index: 3
          }
          &:nth-of-type(2){
            left: -14px;
            z-index: 2
          }
          &:nth-of-type(3){
            left: -28px;
            z-index: 1
          }
          &.active, &:hover{
            background: url('../../../assets/score/tab_label_left_s@2x.png') no-repeat center/cover;
            color: #FFFFFF;
            cursor: default;
          }
        }
      }
      .tip-audio{
        cursor: pointer;
        padding-left: 56px;
        position: relative;
        bottom: -4px;
        float: right;
        height: 28px;
        line-height: 28px;
        font-family: PingFangSC-Medium;
        font-size: 12px;
        color: #FFFFFF;
        letter-spacing: 0;
        width: 138px;
        background: url('../../../assets/score/tennis/fu_dj@2x.png') no-repeat 30px center/16px 15px,
        url('../../../assets/score/tennis/tab_label_right1_s@2x.png') no-repeat center/cover;
        &.close{
          background: url('../../../assets/score/tennis/ft_dj@2x.png') no-repeat 30px center/16px 15px,
          url('../../../assets/score/tennis/tab_label_right1_n@2x.png') no-repeat center/cover;
          color: #666666;
        }
      }
    }
    .select-match{
      background: #FFFFFF url('../../../assets/score/tennis/img_scorelist_tennis@2x.png') no-repeat center/cover;
      height: 64px;
      position: relative;
    .match{
      position: absolute;
      left: 6px;
      bottom: 4px;
    }
    .filter-dropdown {
        line-height: initial;
        margin-right: 24px;
        /deep/ .ivu-tooltip-popper {
          pointer-events: none;
        }
        a {
          box-sizing: border-box;
          padding: 0 8px;
          height: 26px;
          font-size: 14px;
          transition: .2s;
          line-height: 26px;
          border: 1px solid #dcdee2;
          color: #666;
          display: inline-block;
          cursor: pointer;
          background: #fff;
          &:hover {
            background: #3683FF;
            color: #fff;
            border: 1px solid #3683FF;
            .ivu-icon-ios-arrow-down {
              color: #fff;
            }
          }
          &.active {
            background: #3683FF;
            color: #fff;
            border: 1px solid #3683FF;
            .ivu-icon-ios-arrow-down {
              color: #fff;
            }
          }
        }
      }
      .total{
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #999999;
        letter-spacing: 0;
        line-height: 17px;
        .total-count{
          color: #333333;
        }
        .hide-count{
          color: #FF5A34 ;
        }
      }
    }
  }
}


// 保留 隐藏 完整
.retain {
  width: 48px;
  height: 48px;
  background: url('../../../assets/score/football/retain.jpg') no-repeat;
  background-size: 48px;
  &:hover {
    background: url('../../../assets/score/football/retain-h.jpg') no-repeat;
    background-size: 48px;
  }
}
.hide-wrap {
  position: absolute;
  width: 48px;
  left: -80px;
  top: 200px;
  z-index: 10;
}

.hide-list {
  font-size: 12px;
  color: #999999;
  text-align: center;
  li {
    display: inline-block;
    transition: .2s;
    border-radius: 8px;
    margin-bottom: 12px;
    cursor: pointer;
    overflow: hidden;
  }

  .hide {
    width: 48px;
    height: 48px;
    background: url('../../../assets/score/football/hide.png') no-repeat;
    background-size: 48px;
    &:hover {
      background: url('../../../assets/score/football/hide-h.png') no-repeat;
      background-size: 48px;
    }
  }

  .all {
    width:48px;
    height: 48px;
    background: url('../../../assets/score/football/all.png') no-repeat;
    background-size: 48px;
    &:hover {
      background: url('../../../assets/score/football/all-h.png') no-repeat;
      background-size: 48px;
    }
  }
}

// 返回顶部
.return-top-container{
  position: fixed;
  bottom: 50px;
  left: 0;
  right: 0;
  height: 48px;
  width: 1200px;
  margin:0 auto;
  z-index: 10;
  &.is-arrive-bottom{
    position: absolute;
    bottom: 0;
  }
  .return-top {
    position: absolute;
    width: 48px;
    height: 48px;
    right: -88px;
    top: 0;
    cursor: pointer;
    &__img {
      width:48px;
      height: 48px;
      background: url('../../../assets/score/football/top.png') no-repeat;
      background-size: 48px;
      &:hover {
        background: url('../../../assets/score/football/top-h.png') no-repeat;
        background-size: 48px;
      }
    }
  }
}
</style>
