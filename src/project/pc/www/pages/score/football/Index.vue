<template>
  <div class="football-score">
    <div class="score-header">
      <div class="tab-area">
        <div
          id="point"
          class="header-tab__left"
        >
          <span
            class="tab"
            :class="status === '' ? 'active' : ''"
            @click="changeStatus('')"
          >即时比分</span>
          <span
            class="tab"
            :class="status === 3 ? 'active' : ''"
            @click="changeStatus(3)"
          >完场比分</span>
          <span
            class="tab"
            :class="status === 1 ? 'active' : ''"
            @click="changeStatus(1)"
          >未来赛事</span>
        </div>
        <div class="header-tab__right">
          <span
            class="sort"
            :class="{active: oddType === 0}"
            @click="changeOddType(0)"
          >完整</span>
          <span
            class="sort"
            :class="{active: oddType === 1}"
            @click="changeOddType(1)"
          >竞彩</span>
          <span
            class="sort"
            :class="{active: oddType === 2}"
            @click="changeOddType(2)"
          >北单</span>
          <span
            class="sort"
            :class="{active: oddType === 3}"
            @click="changeOddType(3)"
          >足彩</span>
        </div>
      </div>
      
      <div class="filter-area">
        <ul class="third-tabs">
          <li class="select">
            <Poptip
              v-model="isShowAlpha"
              placement="bottom"
              width="458"
            >
              <a>
                选择赛事
                <Icon type="md-arrow-dropdown" />
              </a>
              <div
                slot="content"
                class="select-content select-match"
              >
                <CheckboxGroup v-model="alphaIds">
                  <ul class="checkbox-section">
                    <li
                      v-for="(item, w) in alphaList"
                      :key="w"
                    >
                      <div class="checkbox-inner">
                        <p class="world">
                          {{ w }}
                        </p>
                        <div class="checkbox-list">
                          <p
                            v-for="(subItem, index) in item"
                            :key="index"
                          >
                            <Checkbox :label="subItem.leagueId">
                              {{ subItem.leagueName }}<span
                                v-if="Array.isArray(subItem.matches)"
                                class="checkbox-num"
                              >({{ subItem.matches.length }})</span>
                            </Checkbox>
                          </p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </CheckboxGroup>

                <ul class="filter-checkbox">
                  <li
                    :class="{active: typeId === 2}"
                    @click="changeTypeId(1)"
                  >
                    <a>五大联赛</a>
                  </li>
                  <li
                    :class="[{active: typeId === 3}, 'fr']"
                    @click="changeTypeId(2)"
                  >
                    <a>一级赛事</a>
                  </li>
                </ul>
                <ul class="checkbox-buttons">
                  <li
                    class="btn-all"
                    @click="changeAlpha(1)"
                  >
                    <a>全选</a>
                  </li>
                  <li
                    class="btn-anti-all"
                    @click="changeAlpha(2)"
                  >
                    <a>反选</a>
                  </li>
                  <li class="active-button">
                    <a @click="toCheckedAlpha">确定</a>
                  </li>
                  <li class="gray-button">
                    <a @click="isShowAlpha = false">取消</a>
                  </li>
                </ul>
              </div>
            </Poptip>
          </li>

          <li class="select tape">
            <Poptip
              v-model="isShowDxAndAsia"
              placement="bottom"
              width="358"
            >
              <a>
                选择盘路
                <Icon type="md-arrow-dropdown" />
              </a>
              <div
                slot="content"
                class="select-content"
              >
                <ul class="checkbox-buttons dish-buttons">
                  <li
                    class="gray-button"
                    :class="{'active-button': dxFlg === 2}"
                    @click="dxFlg = 2"
                  >
                    <a>让球</a>
                  </li>
                  <li
                    class="gray-button"
                    :class="{'active-button' :dxFlg === 1}"
                    @click="dxFlg = 1"
                  >
                    <a>进球数</a>
                  </li>
                </ul>
                <!-- 进球数 -->
                <div v-show="dxFlg === 1">
                  <CheckboxGroup v-model="dxIds">
                    <ul class="checkbox-section dish-list">
                      <li
                        v-for="(item, index) in dxList"
                        :key="index"
                      >
                        <Checkbox :label="item.ids">
                          {{ transformData(item.rateDesc) }}({{ item.matches.length }})
                        </Checkbox>
                      </li>
                    </ul>
                  </CheckboxGroup>
                </div>

                <!-- 让球 -->
                <div v-show="dxFlg === 2">
                  <CheckboxGroup v-model="asiaIds">
                    <ul class="checkbox-section dish-list">
                      <li
                        v-for="(item, index) in asiaList"
                        :key="index"
                      >
                        <Checkbox :label="item.ids">
                          {{ item.rateDesc }}({{ item.matches.length }})
                        </Checkbox>
                      </li>
                    </ul>
                  </CheckboxGroup>
                </div>

                <ul class="checkbox-buttons">
                  <li
                    class="btn-all"
                    @click="changeDx(1)"
                  >
                    <a>全选</a>
                  </li>
                  <li
                    class="btn-anti-all"
                    @click="changeDx(2)"
                  >
                    <a>反选</a>
                  </li>
                  <li class="active-button">
                    <a @click="toCheckedDxAndAsia">确定</a>
                  </li>
                  <li class="gray-button">
                    <a @click="isShowDxAndAsia = false">取消</a>
                  </li>
                </ul>
              </div>
            </Poptip>
          </li>
        </ul>
        <ul class="date-select gamble-select">
          <li class="select">
            <Select
              v-model="bookId"
              size="small"
              @on-change="changeCompany"
            >
              <Option
                v-for="({id, title}) in companys"
                :key="id"
                :value="id"
              >
                {{ title }}
              </Option>
            </Select>
          </li>
        </ul>

        <p class="total">
          共计&nbsp;<span class="count">{{ totalData.total }}</span>&nbsp;场，
          隐藏&nbsp;<span class="hidden">{{ totalData.hideTotal }}</span>&nbsp;场
        </p>
        
        <Poptip
          v-model="isShowSetting"
          class="setting-poptip"
          placement="bottom"
        >
          <Button
            class="setting"
          >
            设置
          </Button>
          <div
            slot="content"
            class="setting-content"
          >
            <ul>
              <li
                v-for="(item, index) in settingData"
                v-show="index !== 2"
                :key="index"
              >
                <span>
                  {{ item.name }}
                </span>
                <span
                  v-if="item.isChecked"
                  class="ic_checked_cf icon"
                  @click="changeSetting(item)"
                />
                <span
                  v-else
                  class="iconbs_cf icon"
                  @click="changeSetting(item)"
                />
              </li>
            </ul>
            <div>
              <Button
                size="small"
                @click="cancelSetting()"
              >
                取消
              </Button>
              <Button
                size="small"
                type="primary"
                class="fr"
                @click="okSetting()"
              >
                确认
              </Button>
            </div>
          </div>
        </Poptip>
      </div>
    </div>
    
    <div class="page-inner score-page">
      <div
        v-if="status !== ''"
        class="day-wraper"
      >
        <DayList
          class="football-day-list"
          :status="status"
          :start-time="dateStr"
          @changeDate="changeDate"
        />
      </div>

      <div class="loading">
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
        <div class="league-wraper">
          <LeagueList
            :book-id="bookId"
            :main-list="mainList"
            :top-list="topList"
            :is-show-header="true"
            :is-checked-all="isCheckedAll"
            :checked-hides="checkedHides"
            :status="status"
            :odd-type="oddType"
            :top-ids-list="topIdsList"
            :list="[]"
            :scroll-top="scrollTop"
            :is-interface-update="isInterfaceUpdate"
            @toTop="toggleTopId"
            @toCheck="checkedOne"
          />
        </div>

        <div
          v-if="status === ''"
          class="league-wraper"
        >
          <div v-if="Array.isArray(topList) && topList.length > 0">
            <LeagueList
              :book-id="bookId"
              :is-checked-all="isCheckedAll"
              :checked-hides="checkedHides"
              :status="status"
              :odd-type="oddType"
              :top-ids-list="topIdsList"
              :list="topList"
              :temp-setting-data="tempSettingData"
              :scroll-top="scrollTop"
              :is-interface-update="isInterfaceUpdate"
              @toTop="toggleTopId"
              @toCheck="checkedOne"
            />
          </div>
        </div>

        <div
          v-if="oddType === 0 && status === ''"
          class="league-wraper"
        >
          <div v-if="Array.isArray(mainList.going) && mainList.going.length > 0">
            <MatchStatus status="1" />
            <LeagueList
              :book-id="bookId"
              :is-checked-all="isCheckedAll"
              :checked-hides="checkedHides"
              :status="status"
              :odd-type="oddType"
              :top-ids-list="topIdsList"
              :list="mainList.going"
              :temp-setting-data="tempSettingData"
              :scroll-top="scrollTop"
              :is-interface-update="isInterfaceUpdate"
              @toTop="toggleTopId"
              @toCheck="checkedOne"
            />
          </div>

          <div v-if="Array.isArray(mainList.uncoming) && mainList.uncoming.length > 0">
            <MatchStatus status="2" />
            <LeagueList
              :book-id="bookId"
              :is-checked-all="isCheckedAll"
              :checked-hides="checkedHides"
              :status="status"
              :odd-type="oddType"
              :top-ids-list="topIdsList"
              :list="mainList.uncoming"
              :temp-setting-data="tempSettingData"
              :scroll-top="scrollTop"
              :is-interface-update="isInterfaceUpdate"
              @toTop="toggleTopId"
              @toCheck="checkedOne"
            />
          </div>
          <div v-if="Array.isArray(mainList.finished) && mainList.finished.length > 0">
            <MatchStatus status="3" />
            <LeagueList
              :book-id="bookId"
              :is-checked-all="isCheckedAll"
              :checked-hides="checkedHides"
              :status="status"
              :odd-type="oddType"
              :top-ids-list="topIdsList"
              :list="mainList.finished"
              :temp-setting-data="tempSettingData"
              :scroll-top="scrollTop"
              :is-interface-update="isInterfaceUpdate"
              @toTop="toggleTopId"
              @toCheck="checkedOne"
            />
          </div>
          <div v-if="Array.isArray(mainList.unknown) && mainList.unknown.length > 0">
            <MatchStatus status="4" />
            <LeagueList
              :book-id="bookId"
              :is-checked-all="isCheckedAll"
              :checked-hides="checkedHides"
              :status="status"
              :odd-type="oddType"
              :top-ids-list="topIdsList"
              :list="mainList.unknown"
              :temp-setting-data="tempSettingData"
              :scroll-top="scrollTop"
              :is-interface-update="isInterfaceUpdate"
              @toCheck="checkedOne"
              @toTop="toggleTopId"
            />
          </div>
          <div
            v-if="isFetched && topList.length + mainList.going.length + 
              mainList.uncoming.length + mainList.finished.length + mainList.unknown.length === 0" 
            class="empty-list"
          >
            暂无数据……
          </div>
        </div>
        <div
          v-else
          class="league-wraper"
        >
          <div v-if="Array.isArray(mainList) && mainList.length > 0">
            <LeagueList
              :book-id="bookId"
              :is-checked-all="isCheckedAll"
              :checked-hides="checkedHides"
              :status="status"
              :odd-type="oddType"
              :top-ids-list="topIdsList"
              :list="mainList"
              :temp-setting-data="tempSettingData"
              :scroll-top="scrollTop"
              :is-interface-update="isInterfaceUpdate"
              @toTop="toggleTopId"
              @toCheck="checkedOne"
            />
          </div>
          <div
            v-else
            class="empty-list"
          >
            暂无数据……
          </div>
        </div>
      </div>

      <div class="hide-wrap">
        <Affix
          v-if="status===''"
          :offset-top="200"
        >
          <ul class="hide-list">
            <li @click="toHideList(1)">
              <p class="retain" />
            </li>
            <li @click="toHideList(2)">
              <!-- <p>
                <span class="iconbe_ca " />
              </p> -->
              <p class="hide" />
            </li>
            <li @click="toHideList(3)">
              <p class="all" />
            </li>
          </ul>
        </Affix>
      </div>
    </div>

    <!-- 底部图例说明 -->
    <div class="graph-explanation">
      <h2>图例说明：</h2>
      <div class="graph-item">
        <img src="../../../assets/score/football/an_bj.png">
        <span>进球</span>
      </div>
      <div class="graph-item">
        <img src="../../../assets/score/football/ao_bj.png">
        <span>进点球</span>
      </div>
      <div class="graph-item">
        <img src="../../../assets/score/football/ap_bj.png">
        <span>乌龙球</span>
      </div>
      <div class="graph-item">
        <img src="../../../assets/score/football/as_bj.png">
        <span>两黄换一红</span>
      </div>
      <div class="graph-item">
        <img src="../../../assets/score/football/aq_bj.png">
        <span>黄牌</span>
      </div>
      <div class="graph-item">
        <img src="../../../assets/score/football/ar_bj.png">
        <span>红牌</span>
      </div>
      <div class="graph-item">
        <img src="../../../assets/score/football/at_bj.png">
        <span>换人</span>
      </div>
    </div>

    <audio
      id="ring-audio"
      ref="ringAudio"
      controls="controls"
      preload="auto"
      hidden="true"
    >
      <source
        src="../../../static/assets/ring.mp3"
        type="audio/ogg"
      >
      <source
        src="../../../static/assets/ring.mp3"
        type="audio/mpeg"
      >
      您的浏览器不支持 audio 元素。
    </audio>
    <!-- 侧边工具栏 -->
    <SideTools
      :no-o-player="true"
      :immediate-top="true"
    />
  </div>
</template>
<script>
import {
  Icon,
  CheckboxGroup,
  Checkbox,
  Select,
  Option,
  Poptip,
  Affix,
  Spin,
  Button,
  Notice
} from 'iview'

import MqttBase from '@utils/MqttBase'
import dayjs from 'dayjs'
import DayList from './../components/DayList'
import LeagueList from '../../../components/LeagueList'
import MatchStatus from '../../../components/MatchStatus'
import SideTools from '../../home/components/SideTools'
import _ from 'lodash'
import Http from '@utils/Http'
const http = new Http()
// 左側操作按鈕說明：
// 保留：除了勾選的，其他都隱藏
// 隱藏：隱藏已勾選的
// 完整：都顯示

// 盘路选择-不是matchId选择，规则待完善

// 置顶sessionId
const topIdsSessionId = '_topIdsSessionId_'
const subscribeList = ['topic_mq/match/*/soccerScoreStatic', 'topic_mq/match/*/compareOdds', 'topic_mq/match/*/loOddsData', 'topic_mq/match/*/score', 'topic_mq/match/*/status']


// topic_mq/match/12345/soccerScoreStatic

export default {
  components: {
    Icon,
    CheckboxGroup,
    Checkbox,
    DayList,
    LeagueList,
    MatchStatus,
    Poptip,
    Select,
    Option,
    Affix,
    Spin,
    Button,
    SideTools
  },
  data() {
    return {
      isInterfaceUpdate: true,
      scrollTop: 0,
      tempReturnTopFunc: null,
      isShowSetting: false,
      tempSettingData: [],
      settingData: [
        {
          name: '进球提示声',
          isChecked: false,
        },
        {
          name: '进球弹框提示',
          isChecked: true,
        },
        {
          name: '显示排名',
          isChecked: false,
        },
        {
          name: '显示红黄牌',
          isChecked: true,
        }
      ],
      // 0全部,1足球,2篮球
      sportType: 1,

      // 选择时间字符串
      dateStr: '',

      // 1 全部赛事 2五大联赛 3 一级赛事 4 让球 5大小球 6竞彩 7北单 8足彩,20篮球全部，21篮球竞彩，22 NBA,23,CBA,24 WCBA
      typeId: 1,

      // 是否显示赛事下拉选择框
      isShowAlpha: false,

      // 选择赛事 下拉列表项
      alphaList: [],
      tempAlphaList: {},

      // 选择赛事 下拉列表选中项id 展示用，非确定值
      alphaIds: [],

      // 选择赛事 确定选择的id
      sureCheckedAlphaIds: [],

      // 是否显示盘路下拉框
      isShowDxAndAsia: false,

      // 选择五大联赛或一级赛事的levelId
      levelIds: [],

      // 盘路下拉框-进球数列表项
      dxList: [],

      // 盘路选中项id-进球
      dxIds: [],

      // 盘路下拉框-让球列表项
      asiaList: [],

      // 盘路选中列表-让球
      asiaIds: [],

      // 确定-盘路下拉项id（进球数、让球）
      sureDxAndAsiaIds: [],

      // 五大联赛 leagueId
      five: [3, 9, 15, 20, 21],

      sureFiveIds: [],

      // 一级赛事 level，实际显示二级的level
      levelOne: [1],

      // 盘路下拉显示项 1：进球数，2：让球
      dxFlg: 2,

      companys: {},

      // 公司id
      bookId: '',
      // 公司id
      bookIdBet365: 31,

      // '' 即时比分, 1,未来赛事 2,正在进行 3,完场比分,
      status: '',

      // 0,全部 1,竞彩、2北单、3足彩
      oddType: 0,

      going: [],

      uncoming: [],

      finished: [],

      unknown: [],

      // cancel: [],

      // 竞彩，北单，足彩数据
      oddList: [],

      // 置顶列表
      topIdsList: [],

      // 隐藏赛事列表
      hiddenIdsList: [],

      // 当前选中的列表
      checkedHides: [],

      // 是否全都选择
      isCheckedAll: false,

      mqtt: null,

      isFetched: false,

      time: Date.now(),

      timmer: null,
      
      isInit: false,

      isChangeDate: false,

      // leagueIds: [],
      changeStatusTimer: null,
      loading: false,
      // 缓存推送前的列表数据
      tempPreList: {},
      spinShow: false,
    }
  },
  computed: {
    // 当前所有列表数据
    currList() {
      let {
        oddType,
        status,
        going,
        uncoming,
        finished,
        unknown,
        // cancel,
        oddList
      } = this
      let result = [...oddList]

      if (oddType === 0) {
        if (status === '') {
          return {
            uncoming: [...uncoming],
            going: [...going],
            finished: [...finished],
            unknown: [...unknown]
            // cancel: [...cancel]
          }
        }
        const statusData = {
          1: uncoming,
          3: finished,
          4: unknown
        }
        result = [...statusData[status]]
      }
      return result
    },

    // 顶级赛事列表
    topList() {
      let {
        currList,
        topIdsList,
        hiddenIdsList,
        sureCheckedAlphaIds,
        sureDxAndAsiaIds,
        levelIds,
        sureFiveIds,
        status
      } = this
      let result = []
      function isItem(item) {
        // 非顶级赛事
        if (
          status === '' &&
          !topIdsList.some(topId => topId === item.matchId)
        ) {
          return false
        }
        if (hiddenIdsList.some(hideId => hideId == item.matchId)) {
          return false
        }
        if (
          !sureCheckedAlphaIds.some(sureId => sureId == item.leagueId)
        ) {
          return false
        }
        if (
          sureDxAndAsiaIds.length > 0 &&
          !sureDxAndAsiaIds.some(sureId => sureId == item.matchId)
        ) {
          return false
        }
        if (
          levelIds.length > 0 &&
          !levelIds.some(levelId => levelId == item.level)
        ) {
          return false
        }
        if (
          sureFiveIds.length > 0 &&
          !sureFiveIds.some(leagueId => leagueId == item.leagueId)
        ) {
          return false
        }
        return true
      }
      if (Array.isArray(currList)) {
        currList.forEach(item => {
          if (isItem(item)) {
            result.push(item)
          }
        })
      } else {
        Object.keys(currList).forEach(k => {
          currList[k].forEach(item => {
            if (isItem(item)) {
              result.push(item)
            }
          })
        })
      }
      return result
    },

    // 排除顶级赛事，隐藏项，筛选项后的数据
    mainList() {
      let {
        currList,
        topIdsList,
        hiddenIdsList,
        sureCheckedAlphaIds,
        sureDxAndAsiaIds,
        levelIds,
        sureFiveIds,
        status
      } = this

      function isItem(item) {
        // 非顶级赛事
        if (status === '' && topIdsList.some(topId => topId === item.matchId)) {
          return false
        }
        if (hiddenIdsList.some(hideId => hideId == item.matchId)) {
          return false
        }
        if (
          !sureCheckedAlphaIds.some(sureId => sureId == item.leagueId)
        ) {
          return false
        }

        if (
          sureDxAndAsiaIds.length > 0 &&
          !sureDxAndAsiaIds.some(sureId => sureId == item.matchId)
        ) {
          return false
        }

        if (
          levelIds.length > 0 &&
          !levelIds.some(levelId => levelId == item.level)
        ) {
          return false
        }

        if (
          sureFiveIds.length > 0 &&
          !sureFiveIds.some(leagueId => leagueId == item.leagueId)
        ) {
          return false
        }

        return true
      }

      if (Array.isArray(currList)) {
        return currList.reduce((pre, cur) => {
          if (isItem(cur)) {
            pre.push(cur)
          }
          return pre
        }, [])
      } else {
        return Object.keys(currList).reduce((pre, cur) => {
          pre[cur] = currList[cur].filter(item => {
            return isItem(item)
          })

          return pre
        }, {})
      }
    },

    // 显示项的matchId列表
    allShowMatches() {
      let { mainList, topList } = this
      let arr = []
      if (!Array.isArray(mainList)) {
        arr = Object.keys(mainList).reduce((pre, cur) => {
          pre = [...pre, ...mainList[cur]]
          return pre
        }, [])
      } else {
        arr = [...mainList]
      }

      return [...arr, ...topList].reduce((pre, curr) => {
        pre.push(curr.matchId)
        return pre
      }, [])
    },

    totalData() {
      let {
        currList,
        allShowMatches
      } = this

      let total = 0
      let hideTotal = 0

      if (Array.isArray(currList)) {
        total = currList.length
      } else {
        Object.keys(currList).forEach(k => {
          total = total + currList[k].length
        })
      }

      hideTotal = total - allShowMatches.length

      return {
        total,
        hideTotal: hideTotal > 0 ? hideTotal : 0
      }
    }
  },
  mounted() {
    this.tempSettingData = JSON.parse(JSON.stringify(this.settingData))
    this.setMqtt()
    this.setInitTime()
    this.getTopIdsList()
    this.init()
    // this.setNow()
  },
  beforeDestroy() {
    clearInterval(this.timmer)
    this.mqtt.unsubscribe(subscribeList)
    window.removeEventListener('scroll', this.tempReturnTopFunc)
  },
  methods: {
    renderFunc (mqttMsg = {}, obj) {
      let {timePlayed, hostTeamName, guestTeamName, hostTeamScore, guestTeamScore} = mqttMsg
      Notice.open({
        duration: 8,
        render: h => {
          return h('div', {
            class: 'goal-notice-info'
          },[
            h('span', {class: 'red time'}, timePlayed ? obj.curTime || `${Math.floor(timePlayed/60)}\`` : ''),
            h('img', {
              attrs:{
                src: '../../../static/assets/es_fj.png'
              }
            }),
            h('div', {class: 'team-name'},[
              h('div', {class: `${obj.hostGoalScore && 'red'} host ddd`}, hostTeamName),
              h('div', {class: `${obj.guestGoalScore && 'red'} guest`}, guestTeamName),
            ], ),
            h('span', {class: 'goal'}, '进球'),
            h('div', {class: 'team-score'},[
              h('span', {class: `${obj.hostGoalScore && 'red'}`}, hostTeamScore),
              h('span', {class: `${obj.guestGoalScore && 'red'}`}, ` - ${guestTeamScore}`),
            ], )
          ])
        },
        onClose: ()=>{
          setTimeout(()=>{ // 挡住了搜索框，关闭时隐藏ivu-notice wrap栏
            if(!document.querySelectorAll('.goal-notice-info').length) {
              document.querySelector('.ivu-notice') && (document.querySelector('.ivu-notice').style.zIndex = 0)
              Notice.destroy()
            }
          }, 600)
        }
      })
    },
    changeSetting(item){
      item.isChecked = !item.isChecked
    },
    cancelSetting(){
      this.isShowSetting = false
    },
    okSetting(){
      this.tempSettingData = JSON.parse(JSON.stringify(this.settingData))
      this.isShowSetting = false
    },
    transformData (data) {
      if (data.indexOf('.') !== -1) {
        let arr = data.split('.')
        if (arr[1].length > 1) {
          return arr[0] + '/' + arr[0] + '.' + arr[1]  
        } else {
          return data
        }
      } else {
        return data
      }
    },
    
    setMqtt() {
      const mqtt = new MqttBase(this.getMessage)
      this.mqtt = mqtt
      this.mqtt.subscribe(subscribeList)
    },
    // setNow() {
    //   this.timmer = setInterval(() => {
    //     this.time = this.time + 1
    //   }, 60000)
    // },

    // 初始化时间字符串
    setInitTime(time = Date.now()) {
      const date = isNaN(time) ? time : Number(time)
      this.dateStr = dayjs(date).format('YYYY-MM-DD')
    },

    // 获取置顶赛事列表
    getTopIdsList() {
      this.topIdsList =
        JSON.parse(sessionStorage.getItem(topIdsSessionId)) || []
    },

    // 置顶或取消置顶赛事
    toggleTopId(id) {
      let { topIdsList } = this
      if (topIdsList.some(itemId => itemId === id)) {
        // 取消置顶
        topIdsList = topIdsList.filter(topId => topId !== id)
      } else {
        topIdsList = [id, ...topIdsList]
      }
      sessionStorage.setItem(topIdsSessionId, JSON.stringify(topIdsList))
      this.topIdsList = topIdsList
    },

    // 初始化数据
    init() {
      // 获取数据源公司列表
      this.queryBook().then(() => {
        // 查询列表数据
        this.getCompetitionHandicapList()
        this.queryLeagueRateInfo('true')
      })
      this.queryFiveLeagueId()
      this.tempReturnTopFunc = _.debounce(this.isShowReturnTopFunc, 400)
      window.addEventListener('scroll', this.tempReturnTopFunc)
    },
    isShowReturnTopFunc(){
      let wrapEle = document.documentElement || document.body
      this.scrollTop = wrapEle.scrollTop
    },
    // 重置选项
    resetOptions() {
      // this.dxIds = []
      // this.asiaIds = []
      // this.sureDxAndAsiaIds = []
      this.hiddenIdsList = []
      this.checkedHides = []
      // this.levelIds = []
      // this.sureFiveIds = []
      this.setInitChecked()
      this.isCheckedAll = false
    },

    // 获取赛事，盘路筛选信息
    queryLeagueRateInfo() {
      let { sportType, dateStr, status, bookId, isInit } = this

      http.$get('v8/queryLeagueRateInfo', {
        bookId,
        sportType,
        date: dateStr,
        status
      }).then(res => {
        let { alpha, asia, dx } = res.data

        // 选择赛事-下拉列表
        this.alphaList = alpha
        this.tempAlphaList = _.cloneDeep(alpha)
        // 选择盘路-让球-下拉列表
        this.asiaList = asia.reduce((pre, curr)=> {
          let {matches = []} = curr
          pre.push({
            ...curr,
            ids: matches.join(',')
          })
          return pre
        }, [])

        // 选择盘路-进球数-下拉列表
        this.dxList = dx.reduce((pre, curr)=> {
          let {matches = []} = curr
          pre.push({
            ...curr,
            ids: matches.join(',')
          })
          return pre
        }, [])

        if(!isInit){
          this.isInit = true
        }
        this.$nextTick(()=>{
          this.setInitChecked()
        })
      })
    },

    // 赛事，盘路设置全选
    setInitChecked(){
      this.changeAlpha(1)
      this.toCheckedAlpha()

      this.dxFlg = 1
      this.changeDx(1)

      this.dxFlg = 2
      this.changeDx(1)

      this.toCheckedDxAndAsia()
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

        if (data.length > 0) {
          // 设置默认公司 bet365
          let index = data.findIndex(({ title }) => /bet365/i.test(title)) || 0
          this.bookId = data[index].id
          this.companys = data
        }
      })
    },
    queryFiveLeagueId() {
      this.$get('/v21/queryLeagueID').then(res => {
        const data = res.data.fFiveBigLeague || []
        this.five = data.map(item => parseInt(item))
      })
    },
    // type 1 五大联赛，2 一级赛事
    changeTypeId(type) {
      let { typeId, five, levelOne } = this

      // let curr = []
      if (type === 1) {
        // curr = [...five]
        this.sureFiveIds = [...five]
        this.alphaIds = [...five]
      }

      if (type === 2) {
        // 一级赛事需要通过 level 6来筛选，逻辑需要修改
        // curr = [...levelOne]
        this.sureFiveIds = []
        this.levelIds = [...levelOne]
        this.alphaIds = []
        for (const [index, item] of Object.entries(this.currList)) {
          for (const [ind, val] of Object.entries(item)) {
            if(this.allShowMatches.includes(val.matchId)) this.alphaIds.push(val.leagueId)
          }
        }
        this.alphaIds = [...new Set(this.alphaIds)]
      }
      this.typeId = typeId
      this.isShowAlpha = false
      
    },

    // 选择赛事 ，1 全选， 2 反选
    changeAlpha(type) {
      let { alphaList, alphaIds } = this
      this.alphaIds = Object.keys(alphaList).reduce((pre, curr) => {
        alphaList[curr].forEach(({ leagueId }) => {
          if (type === 1) {
            pre.push(leagueId)
          }
          if (type === 2 && !alphaIds.includes(leagueId)) {
            pre.push(leagueId)
          }
        })
        return pre
      }, [])
    },

    // 盘口-type 1 全选， 2 反选
    changeDx(type) {
      let { dxFlg, asiaList, dxList, dxIds, asiaIds } = this
      let currentList = dxFlg === 1 ? dxList : asiaList
      let currentCheckedList = dxFlg === 1 ? dxIds : asiaIds

      let currChecked = currentList.reduce((pre, curr) => {
        let { ids } = curr

        if (type === 1) {
          pre.push(ids)
        }
        if (type === 2 && !currentCheckedList.includes(ids)) {
          pre.push(ids)
        }

        return pre
      }, [])

      if (dxFlg === 1) {
        this.dxIds = currChecked
      }
      if (dxFlg === 2) {
        this.asiaIds = currChecked
      }
    },

    // 切换数据源公司
    changeCompany() {
      this.resetOptions()
      this.getCompetitionHandicapList()
    },

    // 切换 完整，竞彩，北单，足彩
    changeOddType(type) {
      let { oddType } = this
      if (type !== oddType) {
        this.oddType = type
        this.resetOptions()
        this.getCompetitionHandicapList()
      }
    },

    // 获取列表数据
    getCompetitionHandicapList() {
      let { oddType, isChangeDate } = this
      if (oddType === 0) {
        this.queryAll()
      } else {
        // 查询 1,竞彩、2北单、3足彩 数据
        let { dateStr, bookId } = this
        // 为选择日期的时候，date可能不需要传
        this.$get('v8/queryOddMatch', {
          date: isChangeDate ? dateStr : '',
          bookId,
          type: oddType
        }).then(res => {
          let { data = [] } = res
          this.oddList = [...data]
        })
      }
    },

    // 切换日期
    changeDate(time) {
      let {isChangeDate} = this

      this.dateStr = time

      // 重置赛事及盘口信息
      this.queryLeagueRateInfo()

      this.getCompetitionHandicapList()

      if(!isChangeDate){
        this.isChangeDate = true
      }

    },

    // 1,即时比分 2,完场比分,3,未来赛事
    changeStatus(status) {
      let { status: currStatus } = this
      this.status = status

      if (status !== currStatus) {

        // 重置时间
        this.setInitTime()

        this.resetOptions()

        // 重置赛事及盘口信息
        this.getCompetitionHandicapList()
        // 重置选择赛事
        this.queryLeagueRateInfo()
      }
    },

    //  赛事列表
    queryAll() {
      let { sportType, dateStr, bookId, status } = this
      this.spinShow = true
      this.isInterfaceUpdate = true
      http.$get('v8/queryAllByStatus', {
        sportType,
        date: dateStr,
        // matchIds: [],
        // leagueIds: [],
        status,
        bookId
      }).then(res => {
        let { going, uncoming, finished, unknown, cancel } = res.data
        this.going =
          going && Array.isArray(going.matches) ? [...going.matches] : []
        this.setIntervalStatus()
        this.uncoming =
          uncoming && Array.isArray(uncoming.matches)
            ? [...uncoming.matches]
            : []
        this.finished =
          finished && Array.isArray(finished.matches)
            ? [...finished.matches]
            : []

        let unknownArr =
          unknown && Array.isArray(unknown.matches) ? [...unknown.matches] : []
        let cancelArr =
          cancel && Array.isArray(cancel.matches) ? [...cancel.matches] : []

        this.unknown = [...unknownArr, ...cancelArr]
        this.isFetched = true
        Spin.hide()
        this.spinShow = false
        this.tempPreList =  _.cloneDeep(res.data)
        let timer = setTimeout(()=>{
          this.$nextTick(()=>{
            this.isInterfaceUpdate = false
            clearTimeout(timer)
          })
        }, 2000)
      }).catch(() => {
        this.spinShow = false
      })
    },

    // 1分钟执行一次
    setIntervalStatus() {
      if (this.status === '') {
        this.changeStatusTimer = setInterval(() => {
          this.going.map(ele => {
            if (ele.timePlayed > 0) {
              ele.timePlayed += 60
            }
          })
        }, 60000)
      } else {
        clearInterval(this.changeStatusTimer)
      }
    },

    // 确定选择赛事
    toCheckedAlpha() {
      let { alphaIds } = this
      this.levelIds = []
      this.sureFiveIds = []
      this.sureCheckedAlphaIds = [...alphaIds]
      this.isShowAlpha = false
    },

    // 确定选择盘路(进球数，让球)
    toCheckedDxAndAsia() {
      let { dxIds, asiaIds } = this
      this.sureDxAndAsiaIds = [...dxIds, ...asiaIds].reduce(
        (pre, curr) => {
          // 逗号分隔的字符串转换为1维数组
          let itemArr = curr.split(',')
          pre = [...pre, ...itemArr]
          return Array.from(new Set(pre))
        },
        []
      )
      this.isShowDxAndAsia = false
    },

    // 显示隐藏选择
    // id为0时为全选
    checkedOne(matchId) {
      let { checkedHides, allShowMatches } = this
      if (matchId === 0) {
        // checkedAll
        if (checkedHides.length > 0) {
          // 取消所有选择

          this.checkedHides = []
        } else {
          // 全选
          this.checkedHides = [...allShowMatches]
        }
      } else {
        let index = checkedHides.findIndex(id => id === matchId)
        if (index > -1) {
          // 取消选择
          this.checkedHides = checkedHides.filter(id => id !== matchId)
        } else {
          this.checkedHides = [...checkedHides, matchId]
        }
      }
      let allLen = allShowMatches.length

      if (allLen > 0 && this.checkedHides.length === allLen) {
        this.isCheckedAll = true
      } else {
        this.isCheckedAll = false
      }
    },

    // type 1 保留，2 隐藏，3 完整
    toHideList(type) {
      let { checkedHides, hiddenIdsList, allShowMatches } = this
      if (type === 1 && checkedHides.length > 0) {
        let arr = allShowMatches.filter(
          id => !checkedHides.some(checkedId => checkedId === id)
        )
        this.hiddenIdsList = [...hiddenIdsList, ...arr]
        this.isCheckedAll = false
        let filterAlphaList = {}
        for (const [key, item] of Object.entries(this.alphaList)) {
          if(Array.isArray(item)){
            item.forEach(val => {
              if(_.intersection(val.matches, checkedHides).length){
                filterAlphaList[key] = filterAlphaList[key] || []
                filterAlphaList[key].push(val)
              }
            })
          }
        }
        this.alphaList = filterAlphaList
      }
      if (type === 2 && checkedHides.length > 0) {
        this.hiddenIdsList = [...hiddenIdsList, ...checkedHides]
        this.checkedHides = []
        this.isCheckedAll = false
        let filterAlphaList = _.cloneDeep(this.alphaList)
        for (const [key, item] of Object.entries(this.alphaList)) {
          if(Array.isArray(item)){
            item.forEach((val, ind) => {
              if(_.intersection(val.matches, checkedHides).length){
                filterAlphaList[key].splice(ind, 1)
                if(Array.isArray(filterAlphaList[key]) && !filterAlphaList[key].length){
                  delete filterAlphaList[key]
                }
              }
            })
          }
        }
        this.alphaList = filterAlphaList
      }
      if (type === 3) {
        this.hiddenIdsList = []
        this.checkedHides = []
        this.alphaList = this.tempAlphaList
      }
    },

    // mqtt 消息订阅
    getMessage(topic, mqttMsg = {}) {
      if(mqttMsg.sportId != 1) return
      console.log('football mqttMsg:', mqttMsg)
      // matchStatus值： 1.uncoming 2.going   3.finished 4.unknown
      let {currList, tempPreList} = this
      let { matchId: mqttMatchId, matchStatus: mqttMatchStatus, mqttName, typeId:mqttTypeId, loOdds } = mqttMsg
      if(Object.prototype.toString.call(mqttMsg) === '[object Object]' && mqttMsg.sportId == 1){ // 处理推送数据类型变化的问题
        mqttMsg.matchId = mqttMsg.matchId && parseInt(mqttMsg.matchId)
        mqttMsg.sportId = mqttMsg.sportId && parseInt(mqttMsg.sportId)
        mqttMsg.status = mqttMsg.status && parseInt(mqttMsg.status)
      }
      if(mqttName === 'soccerScoreStatic' && mqttMsg.sportId == 1){
        for (const [index, item] of Object.entries(currList)) {
          if(!Array.isArray(item)) return
          Array.isArray(item) && item.some(obj => {
            if (obj.matchId == mqttMatchId) {
              let { halfScore, cornerKicks, yellowCards, redCards } = mqttMsg
              if(!obj.penalty) this.$set(obj, 'penalty', {})
              obj.penalty.hostCorner = (cornerKicks && cornerKicks.team1) || obj.penalty.hostCorner
              obj.penalty.guestCorner = (cornerKicks && cornerKicks.team2) || obj.penalty.guestCorner

              obj.penalty.hostRed = (redCards && redCards.team1) || obj.penalty.hostRed
              obj.penalty.guestRed = (redCards && redCards.team2) || obj.penalty.guestRed

              obj.penalty.hostYellow = (yellowCards && yellowCards.team1) || obj.penalty.hostYellow
              obj.penalty.guestYellow = (yellowCards && yellowCards.team2) || obj.penalty.guestYellow

              obj.hostHalfScore = (halfScore && halfScore.team1) || obj.hostHalfScore
              obj.guestHalfScore = (halfScore && halfScore.team2) || obj.guestHalfScore
              return true
            }
          })
        }
      }
      if (mqttName === 'score' && mqttMsg.sportId == 1) { // 足球比分变化时推送更新
        for (const [index, item] of Object.entries(currList)) {
          if(!Array.isArray(item)) return
          Array.isArray(item) && item.some(obj => {
            if (obj.matchId == mqttMatchId) {
              let hostGoalScore = mqttMsg.hostTeamScore>obj.homeTeamNormalScore
              let guestGoalScore = mqttMsg.guestTeamScore>obj.awayTeamNormalScore
              if(hostGoalScore) {
                this.$set(obj, 'hostGoalScore', true)
              } else if(guestGoalScore) {
                this.$set(obj, 'guestGoalScore', true)
              }
              if(!hostGoalScore && !guestGoalScore) return
              if(this.tempSettingData[0].isChecked){
                this.$nextTick(()=>{
                  let audio = this.$refs.ringAudio
                  audio.play()
                })
              }
              if(this.tempSettingData[1].isChecked){
                document.querySelector('.ivu-notice') && (document.querySelector('.ivu-notice').style.display = 9999)
                this.renderFunc(mqttMsg, obj)
              }
              setTimeout(()=>{
                obj && this.$delete(obj, 'hostGoalScore')
                obj && this.$delete(obj, 'guestGoalScore')
              }, 8000)
              obj.homeTeamNormalScore = mqttMsg.hostTeamScore || obj.homeTeamNormalScore
              obj.awayTeamNormalScore = mqttMsg.guestTeamScore || obj.awayTeamNormalScore
              obj.hostHalfScore = mqttMsg.hostHalfScore || obj.hostHalfScore
              obj.guestHalfScore = mqttMsg.guestHalfScore || obj.guestHalfScore
              // let newMatch = Object.assign(obj, mqttMsg)
              // obj = newMatch
              return true
            }
          })
        }
      }

      if(mqttName === 'status' && mqttMsg.sportId == 1) {
        // let temp
        // switch (mqttMatchStatus) {
        // case 2:
        //   temp = this.findMatch(this.uncoming, this.going, mqttMsg)
        //   if (!temp) this.findMatch(this.unknown, this.going, mqttMsg)
        //   break
        // case 3:
        //   temp = this.findMatch(this.going, this.finished, mqttMsg)
        //   if (!temp) this.findMatch(this.unknown, this.finished, mqttMsg)
        //   break
        // case 4:
        //   temp = this.findMatch(this.going, this.unknown, mqttMsg)
        //   if (!temp) this.findMatch(this.uncoming, this.unknown, mqttMsg)
        //   break
        // default: ''
        // }
        let allMatchList = Array.isArray(currList) ? currList : (currList && [].concat.apply([], Object.values(currList)))
        allMatchList = allMatchList.filter(Boolean)
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
      let curArr = []
      let tempPreArr = []
      if (mqttName !== 'compareOdds' && mqttName !== 'loOddsData') return
      let oddsPush = (mqttTypeId, mqttMsgItem) => {
        switch(mqttMatchStatus) {
        case 1 : curArr = this.uncoming;tempPreArr = tempPreList.uncoming.matches; break
        case 2 : curArr = this.going;tempPreArr = tempPreList.going.matches; break
        case 3 : curArr = this.finished;tempPreArr = tempPreList.finished.matches; break
        case 4 : curArr = this.unknown;tempPreArr = tempPreList.unknown.matches; break
        default: ''
        }
        // 升降部分逻辑处理
        if (Array.isArray(curArr)) {
          let findIndex = curArr.findIndex(item => item.matchId == mqttMatchId)
          if (findIndex > -1) {
            if (!curArr[findIndex].odds) this.$set(curArr[findIndex], 'odds', {})
            if (!curArr[findIndex].odds[mqttTypeId]) curArr[findIndex].odds[mqttTypeId] = {}
            curArr[findIndex].odds[mqttTypeId] = { // 更新最新的odds
              ...curArr[findIndex].odds[mqttTypeId],
              ...mqttMsgItem
            }

            let curOddObj = curArr[findIndex].odds[mqttTypeId]
            let tempOddObj = (tempPreArr[findIndex] && tempPreArr[findIndex].odds) ? (tempPreArr[findIndex].odds[mqttTypeId] || {}) : {}
            if (curOddObj.valueForType1 > (tempOddObj.valueForType1 || 0)) {
              this.$set(curOddObj, 'icon1', 'iconca_ei')
            } else if (curOddObj.valueForType1 < (tempOddObj.valueForType1 || 0)) {
              this.$set(curOddObj, 'icon1', 'iconca_el')
            }
            if (curOddObj.valueForType2 > (tempOddObj.valueForType2 || 0)) {
              this.$set(curOddObj, 'icon2', 'iconca_ei')
            } else if (curOddObj.valueForType2 < (tempOddObj.valueForType2 || 0)) {
              this.$set(curOddObj, 'icon2', 'iconca_el')
            }
            if (curOddObj.ovalue > (tempOddObj.ovalue || 0)) {
              this.$set(curOddObj, 'icon', 'iconca_ei')
            } else if (curOddObj.ovalue < (tempOddObj.ovalue || 0)) {
              this.$set(curOddObj, 'icon', 'iconca_el')
            }
            setTimeout(()=>{
              curOddObj.icon1 = ''
              curOddObj.icon = ''
              curOddObj.icon2 = ''
              // tempPreArr[findIndex].odds = tempPreArr[findIndex].odds || {}
              // tempPreArr[findIndex].odds[mqttTypeId] = { // 更新缓存的odds
              //   ...tempOddObj,
              //   ...curOddObj
              // }
            }, 1500)
          }
        } else {
          console.error('curArr 不是数组')
        }
      }
      if (mqttName === 'compareOdds' && this.bookId == mqttMsg.bookId ) {
        oddsPush(mqttTypeId, mqttMsg)
      }
      if (mqttName === 'loOddsData' && this.bookId == mqttMsg.bookId) {
        Array.isArray(loOdds) && loOdds.forEach(item => {
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
    },
    getBunchList(item){
      let bunchList = null
      switch(item.status){
      case 1: bunchList = this.uncoming;break
      case 2: bunchList = this.going;break
      case 3: bunchList = this.finished;break
      default: bunchList = this.unknown
      }
      if(/^(40|41|42|43|44)$/.test(item.statusCode)) {
        bunchList = this.unknown
      }
      return bunchList
    },
    // 找到状态变更的赛事 并添加至对应的数据列表中
    findMatch (arr, arr2, data) { // arr 上一个状态； arr2当前推送状态的数组
      let flag = false
      if (!arr) return flag
      if (!Array.isArray(arr2.matches)) arr2.matches = []
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
      return flag
    }
  }
}
</script>
<style lang="scss" scoped>
a, .ivu-btn, /deep/ .ivu-select-selection{
  transition: none;
}
.football-score{
  margin-bottom: -50px;
  padding-bottom: 30px;
  background: #f7f7f8;
  .score-header {
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
      .header-tab__left {
        padding: 17px 0 0;
        line-height: 26px;
      }
      .header-tab__right {
        position: absolute;
        right: -23px;
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
          &:nth-child(1){
            transform: translateX(50px);
          }
          &:nth-child(2){
            transform: translateX(26px);
          }
          &:nth-child(3){
            transform: translateX(2px);
          }
          &:nth-child(4){
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
    }
    .filter-area{
      margin-top: 4px;
      padding: 32px 0 6px 6px;
      height: 64px;
      background: url('../../../assets/score/img_scorelist_football.jpg') no-repeat right/cover;
      .third-tabs {
        float: left;
        .select {
          float: left;
          margin-right: 10px;
          position: relative;
          height: 26px;
          font-size: 14px;
          line-height: 24px;
          &:last-child {
            margin: 0;
          }
        }
        li.select {
          /deep/ {
            .ivu-poptip-rel{
              padding: 0 7px;
              background: #fff;
              &:hover{
                background-color: $blue;
                a{
                  color: #fff;
                  .ivu-icon{
                    color: #fff;
                  }
                }
              }
            }
          }
        }
      }
      .gamble-select{
        margin-left: 10px;
        margin-right: 0;
        .select{
          padding: 0;
        }
        /deep/ {
          .ivu-icon-ios-arrow-down{
            right: 6px;
            &::before{
              font-size: 14px;
              content: "\f33d";
            }
          }
        }
      }
      .total {
        float: left;
        margin-left: 10px;
        padding-top: 2px;
        font-size: 12px;
        color: #999999;
        .count {
          color: #333333;
        }
        .hidden {
          color: #e13f3d;
        }
      }
      .setting-poptip{
        margin-left: 30px;
        .setting{
          padding: 0px 15px;
          height: 26px;
          box-sizing: border-box;
          vertical-align: top;
          line-height: 1.66;
          border-radius: 0;
          border-color: #D8D8D8;
          &:hover{
            background-color: $blue;
            color: #fff;
            border-color: $blue;
          }
        }
      }
    }
  }
}
.score-page {
  border-radius: 16px 16px 0 0;
  position: relative;
  min-height: 400px;
  width: 1200px;
}
.select {
  border: 1px solid #d7d7d7;
  border-radius: 0;
  background: #fff;
  /deep/ .ivu-poptip-popper {
    padding: 0;
    top: 50px;
    .ivu-poptip-body{
      padding: 16px;
    }
  }
  /deep/ .ivu-icon-md-arrow-dropdown {
    color: #666666;
  }
  /deep/ .ivu-select-arrow {
    color: #666666;
  }
}

.score-header{
  background: #ededed;
}

li.select.tape {
  .checkbox-section {
    max-height: 140px;
  }
}
.select-content {
  background: #ffffff;
  .checkbox-section {
    max-height: 240px;
    overflow: auto;
    font-size: 14px;
    color: #666666;
    /deep/ {
      .ivu-checkbox.ivu-checkbox-checked{
        .ivu-checkbox-inner{
          border-color: #3683ff;
          background-color: #3683ff;
        }
      } 
    }
    &::-webkit-scrollbar {
      width: 6px;
      height: 10px;
    }

    &::-webkit-scrollbar-thumb {
      background: #d8d8d8;
      border-radius: 4px;
      height: 10px;
    }
    li {
      .checkbox-inner {
        overflow: hidden;
        .world {
          float: left;
          width: 39px;
          font-size: 24px;
          color: #333333;
        }
        .checkbox-list {
          overflow: hidden;
          float: left;
          width: 380px;
          p {
            float: left;
            width: 100px;
            margin-bottom: 10px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            &:first-child{
              margin-right: 26px;
            }
            &+p{
              margin-right: 26px;
            }
            /deep/ span.ivu-checkbox{
              margin-right: 4px;
            }
          }
          .checkbox-num{
            font-size: 10px;
            color: #666666;
          }
        }
      }
    }
  }
}

.filter-checkbox {
  overflow: hidden;
  padding: 12px 0;
  position: relative;
  margin-top: 10px;
  &::before {
    content: '';
    position: absolute;
    height: 1px;
    background: #e5e5e5;
    left: 0;
    top: 0;
    width: 100%;
  }
  li {
    width: 148px;
    float: left;
    line-height: 26px;
    background: #f5f5f5;
    border-radius: 13px;
    text-align: center;
    font-size: 14px;
    color: #666666;
    transition: .2s;
    &.fr{
      float: right;
    }
    &:first-child {
      margin-right: 30px;
    }
    &.active, &:hover {
      color: #ffffff;
      background: #3683ff;
      a {
        color: #ffffff;
      }
    }
  }
}
.select-match{
  .checkbox-buttons {
    .active-button{
      margin-left: 154px;
    }
  }
}
.checkbox-buttons {
  overflow: hidden;
  font-size: 14px;
  color: #666666;
  line-height: 26px;
  margin-top: 10px;
  li {
    float: left;
    width: 64px;
    text-align: center;
    &.btn-all, &.btn-anti-all{
      &:hover a{
        color: $blue;
      }
    }
    &:nth-child(3) {
      margin: 0 16px 0 54px;
    }
  }
  .active-button,
  .gray-button {
    border-radius: 4px;
  }
  .gray-button {
    color: #666666;
    background: #f5f5f5;
    &:hover{
      background: #3683ff;
      a{
        color: #ffffff;
      }
    }
  }
  .active-button {
    color: #ffffff;
    background: #3683ff;
    a {
      color: #ffffff;
    }
  }
}
.dish-buttons {
  padding: 0 0 20px 0;
  li:first-child {
    margin-right: 16px;
  }
}

.dish-list {
  overflow: hidden;
  li {
    width: 104px;
    float: left;
    margin-bottom: 16px;
    &:hover{
      color: $blue;
    }
    /deep/ span.ivu-checkbox{
      margin-right: 4px;
    }
  }
}
.graph-explanation{
  margin-top: 12px;
  display: flex;
  justify-content: center;
  h2{
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #666666;
  }
  .graph-item{
    margin-left: 10px;
    img{
      width: 11.3px;
      height: 11.3px;
    }
    span{
      margin-left: 4.4px;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #666666
    }
  }
}
.hide-wrap {
  position: absolute;
  width: 48px;
  left: -100px;
  top: 200px;
  z-index: 10;
}

.hide-list {
  font-size: 12px;
  color: #999999;
  text-align: center;
  li {
    background: #eeeeee;
    border-radius: 8px;
    cursor: pointer;
    overflow: hidden;
    margin-bottom: 12px;
    transition: .2s;
    &.active, &:hover {
      background: #3683ff;
      color: #ffffff;
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

.empty-list{
  padding: 150px 0;
  text-align: center;
}

.iconbb_ca,
.iconbe_ca,
.iconbd_ca {
  font-family: 'iconfont';
}

.spin-icon-load{
  animation: ani-spin 1s linear infinite;
}
@keyframes ani-spin {
  from { transform: rotate(0deg);}
  50%  { transform: rotate(180deg);}
  to   { transform: rotate(360deg);}
}
.loading {
  min-height: 40px;
  position: relative;
  box-shadow: 0 6px 24px 0 rgba(0, 0, 0, 0.03);
}

/deep/ .setting-content{
  li{
    margin-bottom: 12px;
    height: 24px;
    span{
      height: 100%;
      vertical-align: middle;
      &.icon{
        float: right;
      }
    }
  }
  .ivu-btn-primary{
    background-color:$blue;
    border-color: $blue;
    line-height: 1.666;
    &:hover{
      background-color: #57a3f3;
      border-color: #57a3f3;
    }
  }
}

</style>
