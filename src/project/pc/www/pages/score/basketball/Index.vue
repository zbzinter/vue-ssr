
<template>
  <div class="score">
    <div class="score-header">
      <div class="tab-area">
        <div
          id="point"
          class="header-tab__left"
        >
          <span
            v-for="({name, key}, index) in tab"
            :key="index"
            class="tab"
            :class="index === selectTabActive ? 'active' : ''"
            @click="selectTab(index)"
          >{{ name }}</span>
        </div>
        <div
          v-show="isNow"
          class="header-tab__right"
        >
          <span
            v-for="{name, key, selected} in timelySort"
            :key="key"
            class="sort"
            :class="{active: selected}"
            @click="selectTimelySort(key)"
          >{{ name }}</span>
        </div>
      </div>
      <div class="filter-area">
        <div class="filter-list">
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
                :class="['ivu-icon', {'ivu-icon-md-arrow-dropup': visible, 'ivu-icon-md-arrow-dropdown': !visible}]"
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

          <div
            v-show="isNow"
            class="guess"
          >
            <Select v-model="bookId">
              <Option
                v-for="({id, title}) in companys"
                :key="id"
                :value="id"
              >
                {{ title }}
              </Option>
            </Select>
          </div>
          <span
            v-for="(nav, index) in filterTab"
            :key="index"
            class="filter-nav"
            :class="{active: filterTabActive === index}"
            @click="choice(nav.leagueName, index)"
          >{{ nav.leagueName }}</span>
          <span class="total">共计&nbsp;<i class="total-count">{{ allCount }}</i>&nbsp;场&nbsp;&nbsp;&nbsp;隐藏&nbsp;<i class="hide-count">{{ hideCount }}</i>&nbsp;场</span>
        </div>
      </div>
    </div>

    <div class="score-inner">
      <div
        class="filter-title clearfix"
        :class="{'no-padding': !isNow}"
      >
        <DayList
          v-if="!isNow"
          class="basketball-day-list"
          :status="selectTabActive === 1 ? 3 : 1"
          :start-time="activeDate"
          placement="bottom"
          @changeDate="changeDate"
        />
      </div>
      
      <!-- <div class="advertising" /> -->

      <div class="score-inner__main loading">
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
        <div
          v-if="matchData"
          class="score-inner__list"
        >
          <MatchList
            v-if="stickMatches.length"
            type="stick"
            :matches="stickMatches"
            :book-id="bookId"
            :scroll-top="scrollTop"
          />
          <div
            v-if="timelySort[0].selected"
          >
            <MatchList
              v-if="showData.going && showData.going.matches.length"
              type="going"
              :matches="showData.going.matches"
              :stick-list="stickList"
              :select-tab-active="selectTabActive"
              :book-id="bookId"
              :scroll-top="scrollTop"
            />

            <MatchList
              v-if="showData.uncoming && showData.uncoming.matches.length"
              type="uncoming"
              :matches="showData.uncoming.matches"
              :stick-list="stickList"
              :select-tab-active="selectTabActive"
              :book-id="bookId"
              :scroll-top="scrollTop"
            />

            <MatchList
              v-if="showData.finished && showData.finished.matches.length"
              type="finished"
              :matches="showData.finished.matches"
              :stick-list="stickList"
              :select-tab-active="selectTabActive"
              :book-id="bookId"
              :scroll-top="scrollTop"
            />
            <MatchList
              v-if="showData.unknown && showData.unknown.matches.length"
              type="unknown"
              :matches="showData.unknown.matches"
              :stick-list="stickList"
              :select-tab-active="selectTabActive"
              :book-id="bookId"
              :scroll-top="scrollTop"
            />
          </div>

          <div
            v-else
          >
            <MatchList
              v-for="(attr, key) in showData"
              :key="key"
              :group-name="key"
              :matches="attr"
              :select-tab-active="selectTabActive"
              :book-id="bookId"
              :scroll-top="scrollTop"
            />
          </div>

          <div
            v-if="!spinShow && noData" 
            class="empty-listempty-list"
          >
            暂无数据……
          </div>
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
      <!-- <div
        class="return-top-container"
        :class="{'is-arrive-bottom': isArriveBottom}"
      >
        <div
          v-if="isShowReturnTop"
          class="return-top"
          @click="returnTop"
        >
          <div class="return-top__img" />
        </div>
      </div> -->
    </div>

    <!-- 底部说明 -->
    <div class="bottom-explanation">
      <span>说明：第一行为客场球队，第二行为主场球队。</span>
    </div>
    <!-- 侧边工具栏 -->
    <SideTools
      :no-o-player="true"
      :immediate-top="true"
    />
  </div>
</template>
<script>
import MqttBase from '@utils/MqttBase'
import dateFormate from '@utils/dateFormate'
import { groupBy } from '@/comm/utils/common'
import { Dropdown, DropdownMenu, Select, Option, Affix, Spin, Icon } from 'iview'
import CompetitionList from '../components/CompetitionList'
import MatchList from './components/MatchList'
import mixin from './../mixins'
import DayList from './../components/DayList'
import SideTools from '../../home/components/SideTools'
import _ from 'lodash'
const subscribeList = ['topic_mq/match/*/compareOdds', 'topic_mq/match/*/loOddsData', 'topic_mq/match/*/score', 'topic_mq/match/*/status', 'topic_mq/match/*/matchScoreBasketball']

export default {
  components: {
    CompetitionList,
    MatchList,
    Dropdown,
    DropdownMenu,
    Select,
    Option,
    DayList,
    Affix,
    Spin,
    Icon,
    SideTools
  },
  mixins: [mixin],
  data() {
    return {
      scrollTop: 0,
      isArriveBottom: false,
      tempReturnTopFunc: null,
      isShowReturnTop: false,
      visible: false,
      // 即使比分，完场比分，未来赛事tab
      selectTabActive: 0,
      // 快捷筛选tab
      filterTabActive: 0,
      filterData: [],
      filterTab: [
        {
          leagueName: '全部',
          leagueId: ''
        },
        {
          leagueName: 'NBA',
          leagueId: 580
        },
        {
          leagueName: 'CBA',
          leagueId: 673
        }
      ],
      timely: '',
      timelySort: [
        { name: '时间', key: 'time', selected: true },
        { name: '赛事', key: 'game', selected: false }
      ],
      competitionName: [],
      isShow: false,
      matchData: [],
      // 置顶数组
      stickList: [],
      companys: [],
      bookId: '31',
      // 单选
      selectLeague: '全部',
      // 多选
      selects: [],
      // 走单选还是多选 1单选 2多选
      oneOrMore: '',
      activeDate: '',
      // 选中状态临时存储
      tempHideList: [],
      // 隐藏赛事列表
      hideList: [],
      spinShow: false,
      allCount: 0,
      all: '全部'
    }
  },
  computed: {
    noData(){
      return !this.allShowMatch.length
    },
    // 是否是即时比分
    isNow () {
      return this.selectTabActive === 0
    },

    // 隐藏场次
    hideCount () {
      if (this.allCount === 0) return 0
      let showCount = 0
      if (this.timelySort[0].selected) {
        showCount = this.showData.going.matches.length 
          + this.showData.uncoming.matches.length 
          + this.showData.finished.matches.length 
          + this.showData.unknown.matches.length
        if (showCount === 0) {
          return 0
        }
      } else {
        for (let attr in this.showData) {
          showCount += this.showData[attr].length
        }
        if (showCount === 0) {
          return 0
        }
      }
      return this.allCount - showCount
    },
    allShowMatch () {
      let arr = Object.keys(this.showData).length && [].concat.apply([], Object.values(this.showData).map(item => item.matches))
      return arr || []
    },
    allMatch () {
      let arr = this.matchData.going && this.matchData.going.matches.concat(
        this.matchData.unknown.matches,
        this.matchData.finished.matches,
        this.matchData.uncoming.matches
      )
      if (this.matchData.cancel) {
        arr = arr.concat(this.matchData.cancel.matches)
      }
      return arr || []
    },
    showData () {
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
      
      // let arr = {'NBA': [], 'CBA': [], 'WNBA': [], 'NCAA': []}
      if (!this.oneOrMore) {
        if (this.hideList.length) {
          Object.keys(this.matchData).forEach((item) => {
            const matches = this.matchData[item].matches
            matches.map((ele) => {
              if(!this.hideList.includes(ele.matchId)){
                temp[item].matches.push(ele)
              } else {
                this.$set(ele, 'isChecked', false)
              }
            })
          })
          if (this.timelySort[0].selected) {
            return temp
          } else {
            // 赛事排序
            let arr = temp.going.matches.concat(
              temp.unknown.matches,
              temp.finished.matches,
              temp.uncoming.matches
            )
            return groupBy(arr, 'leagueName')
          }
        }
        
        // 时间排序
        if (this.timelySort[0].selected) {
          return this.matchData
        } else {
          // 赛事排序
          return groupBy(this.allMatch, 'leagueName')
        }
        
      }
      Object.keys(this.matchData).forEach((item) => {
        const matches = this.matchData[item].matches
        matches.map((ele) => {

          // 选择赛事全部,点击确定
          if (this.oneOrMore === 2) {
            if (this.selects.length && this.selects.includes(Number(ele.matchId))) {
              if(!this.hideList.includes(ele.matchId)){
                temp[item].matches.push(ele)
              } else {
                this.$set(ele, 'isChecked', false)
              }
            }
          }

          //  CBA NBA 全部
          if(this.oneOrMore === 1) {
            console.log(new RegExp(this.selectLeague, 'g').test(ele.leagueName))
            if (this.selectLeague === this.all ||  new RegExp(this.selectLeague, 'g').test(ele.leagueName)) {
              if (this.hideList.length && !this.hideList.includes(ele.matchId)) {
                temp[item].matches.push(ele)
              } else {
                temp[item].matches.push(ele)
              }
              if(this.hideList.includes(ele.matchId)){
                this.$set(ele, 'isChecked', false)
              }
            }
          }
        })
      })
      
      if (this.timelySort[0].selected) {
        return temp
      } else {
        // 赛事排序
        let arr = temp.going.matches.concat(
          temp.unknown.matches,
          temp.finished.matches,
          temp.uncoming.matches
        )
        return groupBy(arr, 'leagueName')
      }
          
    },
    // 赛事赛选
    groupLeague () {
      let arr = {'NBA': [], 'CBA': [], 'WNBA': [], 'NCAA': []}
      console.log('this.selects', this.selects, this.oneOrMore, 'oneOrMore')
      let matchArr = groupBy(this.allMatch, 'leagueName')
      if (this.selectLeague === this.all) {
        return arr = {...matchArr}
      }
      this.allMatch.forEach(match => {
        let flag = true
        if (this.oneOrMore === 1) {
          flag = !this.selectLeague || match.leagueName === this.selectLeague
        } else if (this.oneOrMore === 2) {
          flag = !this.selects.length || this.selects.indexOf(match.matchId) !== -1
        }
        if (flag) {
          if (arr[match.leagueName]) {
            arr[match.leagueName].push(match)
          } else {
            arr[match.leagueName] = []
            arr[match.leagueName].push(match)
          }
        }
      })

      if (this.selectLeague !== this.all) {
        // NBA CBA 有值
        if (matchArr[this.selectLeague]) {
          arr[this.selectLeague] = matchArr[this.selectLeague]
        } else {
          arr = {'NBA': [], 'CBA': [], 'WNBA': [], 'NCAA': []}
        }
      }

      return arr
    },
    stickMatches () {
      let arr = []
      if (!this.stickList.length) return arr
      this.allMatch.forEach(match => {
        if (this.stickList.indexOf(match.matchId) !== -1 && this.hideList.indexOf(match.matchId) === -1) {
          arr.push(match)
        }
      })
      return arr
    }
  },
  watch: {
    bookId () {
      this.getQueryAllByStatus()
    }
  },
  mounted() {
    // 获取指数公司列表
    this.queryBook()
    // 获取赛选列表
    this.queryFilter()
    this.activeDate = this.dateFormate(new Date(), 'yyyy-MM-dd')
    this.setMqtt()
    this.getQueryAllByStatus()
    document.onclick = () => {
      this.visible = false
    }
    const dom = document.querySelector('.ivu-select-dropdown')
    if (dom) {
      dom.onclick = (ev) => {
        ev.stopPropagation()
      }
    }
    this.tempReturnTopFunc = _.debounce(this.isShowReturnTopFunc, 400)
    window.addEventListener('scroll', this.tempReturnTopFunc)
    
    this.bus.$on('stickAdd', match => {
      this.stickList.push(match.matchId)
    })
    this.bus.$on('stickDel', match => {
      this.stickList.splice(this.stickList.indexOf(match.matchId), 1)
    })
  },
  beforeDestroy () {
    this.mqtt.unsubscribe(subscribeList)
    window.removeEventListener('scroll', this.tempReturnTopFunc)
  },
  methods: {
    isShowReturnTopFunc(){
      let bottomHeight = document.querySelector('.footer').clientHeight + 50
      let wrapEle = document.documentElement || document.body
      this.scrollTop = wrapEle.scrollTop
      this.isShowReturnTop = wrapEle.scrollTop > 0
      if (wrapEle.scrollHeight-wrapEle.scrollTop-wrapEle.clientHeight < bottomHeight) {
        this.isArriveBottom = true
      } else {
        this.isArriveBottom = false
      }
    },
    changeDate (date) {
      let status = this.selectTabActive === 1 ? 3 : 1
      this.activeDate = date
      this.selectLeague = this.all
      this.getQueryAllByStatus({ status, date: this.activeDate })
      this.queryFilter({ status, date: this.activeDate })
    },
    cancelSelect () {
      this.visible = false
    },
    check (match) {
      if (this.oneOrMore === 1) {
        return !this.selectLeague || match.matchId === this.selectLeague
      } else if (this.oneOrMore === 2) {
        return !this.selects.length || this.selects.indexOf(match.matchId !== -1)
      }
    },
    choice (leagueName, index) {
      this.oneOrMore = 1
      this.filterTabActive = index
      this.selectLeague = leagueName
    },
    // 切换数据源公司
    changeCompany() {
      this.sureMatchIds = []
    },

    resetFilter () {
      this.choice(this.all, 0)
      this.selects = []
      this.oneOrMore = ''
    },

    queryBook() {
      return this.$get('v8/queryBook').then(res => {
        let { data } = res

        // 对象转换为数组
        if (!Array.isArray(data)) {
          data = Object.keys(data).reduce((pre, curr) => {
            pre.push({
              id: curr,
              title: data[curr]
            })
            return pre
          }, [])
        }

        // 设置默认公司 bet365
        let index = data.findIndex(({ title }) => /bet365/i.test(title)) || 0
        this.bookId = data[index].id
        this.companys = data
      })
    },

    // 获取赛事筛选列表
    queryFilter (params = {}) {
      params.sportType = 2
      params.date = params.date || dateFormate(new Date(), 'yyyy-MM-dd')
      params.bookId = this.bookId
      this.$get('/v8/queryLeagueRateInfo', params)
        .then(res => {
          let obj = res.data.alpha
          if (obj) {
            this.competitionName = obj
          } else {
            this.competitionName = []
          }
        })

    },

    handleOpen () {
      if(!this.competitionName.length) {
        this.$tip('暂无数据')
        return
      }
      this.visible = true
    },

    selectTab(index) {
      this.selectTabActive = index
      if (index === 0) {
        this.getQueryAllByStatus()
        this.queryFilter()
      } else {
        this.activeDate = this.dateFormate(new Date(), 'yyyy-MM-dd')
        this.selectTimelySort('time')
        let status = index === 1 ? 3 : 1
        this.getQueryAllByStatus({ status, date: this.activeDate })
        this.queryFilter({ status, date: this.activeDate })
      }
    },

    selectTimelySort(key) {
      this.timelySort.forEach(item => {
        if (item.key === key) {
          item.selected = true
        } else {
          item.selected =false
        }
      })
    },

    // 获取比赛列表
    getQueryAllByStatus(params = {}) {
      this.spinShow = true
      params.date = params.date || dateFormate(new Date(), 'yyyy-MM-dd')
      params.sportType = 2
      params.bookId = this.bookId
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
    getMessage (topic, mqttMsg) {
      if(mqttMsg.sportId != 2) return
      console.log('topic',topic, 'mqttMsg==', mqttMsg)
      if(Object.prototype.toString.call(mqttMsg) === '[object Object]' && mqttMsg.sportId==2){ // 处理推送数据类型变化的问题
        mqttMsg.matchId = mqttMsg.matchId && parseInt(mqttMsg.matchId)
        mqttMsg.sportId = mqttMsg.sportId && parseInt(mqttMsg.sportId)
        mqttMsg.status = mqttMsg.status && parseInt(mqttMsg.status)
      }
      if (mqttMsg.mqttName === 'score' && mqttMsg.sportId == 2) {
        // if (mqttMsg.sportType !== 2) return
        this.allMatch.some(item => {
          if (item.matchId == mqttMsg.matchId) {
            if(mqttMsg.hostTeamScore>item.hostTeamScore) {
              this.$set(item, 'hostGoalScore', true)
            } else if(mqttMsg.guestTeamScore>item.guestTeamScore) {
              this.$set(item, 'guestGoalScore', true)
            }
            setTimeout(()=>{
              item && this.$delete(item, 'hostGoalScore')
              item && this.$delete(item, 'guestGoalScore')
            }, 8000)
            // let newMatch = Object.assign(item, {
            //   hostTeamScore: mqttMsg.hostTeamScore,
            //   guestTeamScore: mqttMsg.guestTeamScore,
            //   timePlayed: mqttMsg.timePlayed
            // })
            // item = newMatch
            item.hostTeamScore = mqttMsg.hostTeamScore || item.hostTeamScore
            item.guestTeamScore = mqttMsg.guestTeamScore || item.guestTeamScore
            item.hostHalfScore = mqttMsg.hostHalfScore || item.hostHalfScore
            item.guestHalfScore = mqttMsg.guestHalfScore || item.guestHalfScore
            return true
          }
        })
      } else if (mqttMsg.mqttName === 'matchScoreBasketball') {
        this.changePeriod(mqttMsg)
      } else if(mqttMsg.mqttName === 'status' && mqttMsg.sportId == 2) {
        // status 比赛状态code 1-未开始 2-进行中 3-已结束 
        // 详见 https://yapi.qiuhui.com/project/32/interface/api/1323
        let allMatchList = this.allMatch.filter(Boolean)
        let findItem = allMatchList.find(item => item.matchId == mqttMsg.matchId)
        if(findItem){
          this.pushToList(findItem, mqttMsg)
          findItem.matchStatusDesc = mqttMsg.statusDesc
          findItem.statusDesc = mqttMsg.statusDesc
          findItem.timePlayed = Math.abs(mqttMsg.timePlayed)
          findItem.status = mqttMsg.status
          findItem.statusCode = mqttMsg.statusCode
        }
      }
      let oddsPush = (typeId, mqttMsg) => {
        this.allMatch.some(match => {
          if (match.matchId == mqttMsg.matchId) {
            let attr = mqttMsg.typeId
            if (!match.odds) this.$set(match, 'odds', {})
            if (match.odds[attr]) {
              let val1 = match.odds[attr].valueForType1 || match.odds[attr].value0ForType1 || 0
              let val2 = match.odds[attr].valueForType2 || match.odds[attr].value0ForType2 || 0
              let tmp1 = mqttMsg.valueForType1
              let tmp2 = mqttMsg.valueForType2
              if (val1 > tmp1) {
                mqttMsg.status1 = 'iconca_el'
              }
              if (val1 < tmp1) {
                mqttMsg.status1 = 'iconca_ei'
              }
              if (val2 > tmp2) {
                mqttMsg.status2 = 'iconca_el'
              }
              if (val2 < tmp2) {
                mqttMsg.status2 = 'iconca_ei'
              }
            }
            if (!match.odds[attr]) this.$set(match.odds, attr, {})
            match.odds[attr] = Object.assign(match.odds[attr], mqttMsg)
            match.odds = {...match.odds}
            // this.$set(match.odds, attr, match.odds[attr])
            setTimeout(()=>{
              this.$delete(match.odds[attr], 'status1')
              this.$delete(match.odds[attr], 'status2')
            }, 5000)
            return true
          }
        })
      } 
      if (mqttMsg.mqttName === 'compareOdds' && this.bookId == mqttMsg.bookId ) {
        oddsPush(mqttMsg.typeId, mqttMsg)
      }
      if (mqttMsg.mqttName === 'loOddsData' && this.bookId == mqttMsg.bookId) {
        Array.isArray(mqttMsg.loOdds) && mqttMsg.loOdds.forEach(item => {
          item.matchId = mqttMsg.matchId
          oddsPush(item.typeId, item)
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
      switch(item.status){
      case 1: bunchList = this.matchData.uncoming.matches;break
      case 2: bunchList = this.matchData.going.matches;break
      case 3: bunchList = this.matchData.finished.matches;break
      default: bunchList = this.matchData.unknown.matches
      }
      if(/^(40|41|42|43|44)$/.test(item.statusCode)) {
        bunchList = this.matchData.unknown.matches
      }
      return bunchList
    },
    // 找到状态变更的赛事 并添加至对应的数据列表中
    findMatch (arr, arr2, data) {
      let flag = false
      if (!Array.isArray(arr2)) arr2 = []
      if (Array.isArray(arr) && arr.length) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].matchId == data.matchId) {
            let newMatch = Object.assign(arr[i], data)
            arr.splice(i, 1)
            arr2.push(newMatch)
            arr = [...arr]
            arr2 = [...arr2]
            flag = true
            break
          }
        }
      } 
      return flag
    },

    // 修改篮球四节比分数据
    changePeriod (data) {
      this.allMatch.some(match => {
        if (match.matchId == (data.Normaltime && data.Normaltime.matchId ? data.Normaltime.matchId : '')) {
          if(!match.period) this.$set(match, 'period', {})
          match.period = Object.assign(match.period, data)
          return true
        }
      })
    },

    setMqtt() {
      const mqtt = new MqttBase(this.getMessage)
      this.mqtt = mqtt
      this.mqtt.subscribe(subscribeList)
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
      let showList = this.allShowMatch.filter(item => item.isChecked).map(item=>item.matchId)
      this.hideList = this.allMatch.filter(item => !showList.includes(item.matchId)).map(item=>item.matchId)
      this.tempHideList = [...this.hideList, ...showList]
      this.$refs.CompetitionList.bindHideList(1)
    },
    cancelHideList () {
      this.hideList = []
      this.tempHideList = []
      this.$refs.CompetitionList.bindHideList()
    },
    selectCompetition(selectId) {
      this.oneOrMore = 2
      this.visible = false
      this.selects = selectId
      this.filterTabActive = 0
      this.selectLeague = this.all
    },
    changeHideList(selectIds){ // 选择赛事确定时重置隐藏列表
      this.hideList = this.allMatch.filter(item=>{
        if(item.isChecked) item.isChecked = false
        return !selectIds.includes(item.matchId)
      }).map(item=>item.matchId)
      this.tempHideList = [...this.hideList]
    },
    cancelSelectCompetition () {
      this.visible = false
    },

    returnTop() {
      let anchor = this.$el.querySelector('#point')
      document.documentElement.scrollTop = anchor.offsetTop
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
    
  }
  

}
</script>
<style scoped lang="postcss">
$red: #E13F3D;
.score {
  position: relative;
  background: #f7f7f8;
  margin-bottom: -50px;
  .empty-listempty-list{
    text-align: center;
    padding-top: 100px;
  }
  &-header {
    width: 1200px;
    margin: auto;
    border-radius: 4px;
    background: #EBEBEB;
    .tab-area{
      position: relative;
      display: flex;
      justify-content: space-between;
      overflow: hidden;
      background: #f7f7f8;
      &:after{
        content: '';
        position: absolute;
        height: 2px;
        background: #3683FF;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10;
      }
    }
    .header-tab__left {
        padding: 17px 0 0;
        line-height: 26px;
    }
    .header-tab__right {
      position: absolute;
      right: -22px;
      padding-top: 17px;
      z-index: 11;
      .sort {
        font-family: PingFangSC-Regular;
        display: inline-block;
        padding: 6px 22px 6px 28px;
        line-height: 20px;
        font-size: 14px;
        text-align: center;
        color: #666666;
        cursor: pointer;
        background: url('../../../assets/score/tennis/tab_label_right1_n@2x.png') no-repeat left/cover;
        border-radius: 2px 6px 0 0;
        &:first-child{
          padding-bottom: 4px;
        }
        &:last-child{
          transform: translateX(-22px);
        }
      }
      .active {
        font-family: PingFangSC-Medium;
        font-weight: 600;
        color: #ffffff;
        background: url('../../../assets/score/tennis/tab_label_right1_s@2x.png') no-repeat left/cover;
        cursor: default;
      }
    }
    .tab {
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
    .filter-area{
      margin-top: 4px;
      padding: 0 0 6px 6px;
      height: 64px;
      background: url('../../../assets/score/img_scorelist_basketball@2x.png') no-repeat right/cover;
      .filter-list{
        height: 100%;
        display: flex;
        align-items: flex-end;
        .filter-nav, .filter-dropdown a {
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
        .filter-nav {
          padding: 0 18px;
          margin-right: 16px;
        }
        .filter-dropdown {
          line-height: initial;
          margin-right: 10px;
          /deep/ .ivu-select-dropdown{
            padding: 0;
          }
          >>> .ivu-checkbox-wrapper .ivu-tooltip-rel {
            width: 84px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: inline-block;
            vertical-align: middle;
          }
          >>> .ivu-tooltip-popper {
            pointer-events: none;
          }
          a {
            padding: 0 26px 0 8px;
            .ivu-icon{
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              right: 8px;
            }
          }
        }
        .guess{
          width: 90px;
          margin-right: 40px;
          /deep/ .ivu-select{
            .ivu-select-selection{
              height: 26px;
              border-radius: 0;
              .ivu-select-selected-value{
                padding: 0 6px 0 8px;
                height: 26px;
                color: #666666;
                font-size: 14px;
                line-height: 26px;
              }
              .ivu-icon-ios-arrow-down{
                right: 6px;
                &::before{
                  font-size: 14px;
                  content: "\f33d";
                }
              }
            }
            &.ivu-select-visible{
              .ivu-select-selection{
                background: #3683FF;
                border: none;
                color: #FFFFFF;
                .ivu-select-selected-value{
                  color: #FFFFFF;
                }
                .ivu-icon{
                  color: #FFFFFF;
                }
              }
            }
          }
        }
        .total{
          font-size: 12px;
          color: #999999;
          line-height: 26px;
          .total-count{
            font-style: normal;
            color: #333333;
          }
          .hide-count {
            font-style: normal;
            color: $red;
          }
        }
        .select-competition {
          width: 386px;
          >>> .ivu-checkbox-wrapper {
            width: 90px;
            margin-right: 0;
            font-size: 14px;
            margin-bottom: 20px;
            margin-right: 20px;
          }
        }
      }
    }
  }
}

.score-inner {
  position: relative;
  margin: auto;
  width: 1200px;
  min-height: 400px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  .advertising {
    width: 1200px;
    height: 115px;
  }

  &__list {
    min-height: 200px;
    position: relative;
  }
  &__main {
    position: relative;
    >>>.ivu-spin-fix .ivu-spin-main {
      top: 100px;
    }
  }
 
  .filter-title {
    overflow: hidden;
    &.no-padding {
      padding: 0;
    }
    .header-select {
      margin-left: 25px;
      /deep/ .ivu-select-selected-value{
        line-height: 25px;
      }
      
      /deep/ .ivu-select-selection {
          height: 26px;
          width: 92px;
          &:hover {
            background: #3683FF;
            color: #fff;
            border: none;
            .ivu-select-arrow {
              color: #fff;
            }
          }
        }
    }
  }
}

.bottom-explanation{
  margin-top: 10px;
  padding-bottom: 24px;
  text-align: center;
  span{
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #666666;
    letter-spacing: 0;
  }
}

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

.iconbb_ca, .iconbe_ca, .iconbd_ca {
  font-size: 10px;
  width: 20px;
  height: 20px;
  display: inline-block;
  margin-top: 8px;
}

.day-section{
  margin: 12px 0 11px;
}
.return-top-container{
  position: fixed;
  bottom: 50px;
  left: 0;
  right: 0;
  height: 48px;
  width: 1200px;
  margin:0 auto;
  z-index: 10;
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
  &.is-arrive-bottom{
    position: absolute;
    bottom: 0;
  }
}

.iconbk_ce {
  font-size: 8px;
  background: #EEEEEE;
}
.total {
  display: inline-block;
  font-size: 12px;
}

/deep/ .ivu-icon-ios-arrow-down {
  text-align: center;
  color: #666;
  &:before {
    font-size: 18px;
  } 
  &:hover {
    color: #fff;
  }
}




</style>


