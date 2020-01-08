<template>
  <div
    ref="matchItem"
    class="clearfix"
  >
    <div class="fl">
      <div class="clearfix checkbox">
        <div class="iblock fl">
          <Checkbox
            v-model="match.isChecked"
            :checked.sync="checked"
            @on-change="checkedHide($event, match)" 
          />
        </div>
        <div class="iblock fl">
          <span class="checkbox-time">{{ dateFormate(new Date(match.matchTime), 'hh:mm') }}</span>
          <span class="block">
            <img
              v-if="match.status === 2"
              class="live-logo"
              src="../../../../assets/score/basket.gif"
              alt=""
            >
            <span :class="[match.status === 2 ? 'red' : 'status-text', 'status']">{{ match.status === 2 ? 'LIVE' : statusText[match.status] }}</span>
          </span>
        </div>
      </div>
    </div>
    <table
      v-show="isShow"
      class="competition-list__table fl"
      style="box-shadow: 0 6px 6px rgb(216, 216, 216, 0.2);"
    >
      <tr class="header">
        <th
          class="name header-name"
          :class="statusClass[match.status]"
        >
          <tooltip
            class="league-name"
            placement="top"
            :content="match.leagueName"
          >
            <span class="desc ellipsis"> {{ match.leagueName }} </span>
          </tooltip>
          <span
            class="status"
            :class="type === 'going' ? 'status-red': ''"
          >
            {{ match.statusCode | statusCodeText }}
          </span>
          <span
            class="time"
          >{{ match.status === 2 ? match.timePlayed && dealTime(match.timePlayed) : '' }}</span>
        </th>
        <th class="lesson header-lesson">
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span v-if="match.period && match.period.Overtime">加时</span>
        </th>
        <th class="up-down">
          上/下
        </th>
        <th class="all">
          全场
        </th>
        <th class="diff">
          分差
        </th>
        <th class="score-total">
          总分
        </th>
        <th class="pay">
          欧指
        </th>
        <th class="rang-score">
          让分
        </th>
        <th class="big-small">
          大小
        </th>
        <!-- <th class="live">
          直播
        </th> -->
        <!-- <th class="opera">
          操作
        </th> -->
        <th class="intelligence live">
          <Tooltip
            v-if="match.anchors && match.anchors.length"
            content="主播"
            placement="top"
          >
            <span>
              <img
                v-for="(anchor, index) in match.anchors"
                :key="index"
                class="iconfont"
                :src="anchor.anchorPic"
                alt="主播"
                @click="toLiveDetail(match.matchId, anchor.roomId)"
              >
            </span>
          </Tooltip>
          <Tooltip
            v-else-if="match.hasLive"
            content="视频"
            placement="top"
          >
            <i
              class="iconfont iconcm_di"
              @click="toLiveDetail(match.matchId)"
            />
          </Tooltip>
          <Tooltip
            v-else-if="match.lmtMode"
            content="动画"
            placement="top"
          >
            <i
              class="iconfont iconcl_dl"
              @click="toLiveDetail(match.matchId)"
            />
          </Tooltip>
          <Tooltip
            :content="type === 'stick' ? '取消置顶' : '置顶'"
            placement="top"
          >
            <i
              class="iconfont"
              :class="type === 'stick' ? 'icongg_dj down' : 'iconge_dj1'"
              @click="handlerStick(match)" 
            />
          </Tooltip>
        </th>
      </tr>
      <tbody>
        <tr class="content">
          <td
            class="name"
            :class="{'going': match.status === 2}"
          >
            <div>
              <default-img
                :src="match.guestTeamLogo"
                :default-url="defaultImg.basketball"
              />
              <tooltip
                class="league-name"
                placement="top"
                :content="match.guestTeamName"
              >
                <span class="desc ellipsis">{{ match.guestTeamName }}</span>
              </tooltip>
            </div>
          </td>
          <td class="lesson">
            <span>{{ showPeriod(match, [11, 12, 31, 13, 14, 20]) ? getPeriod(match.period, 'Period1').team2 : '-' }}</span>
            <span>{{ showPeriod(match, [12, 31, 13, 14, 20]) ? getPeriod(match.period, 'Period2').team2 : '-' }}</span>
            <span>{{ showPeriod(match, [13, 14, 20]) ? getPeriod(match.period, 'Period3').team2 : '-' }}</span>
            <span>{{ showPeriod(match, [14, 20]) ? getPeriod(match.period, 'Period4').team2 : '-' }}</span>
            <span v-if="match.period && match.period.Overtime">{{ match.period.Overtime.team2 }}</span>
          </td>
          <td class="up-down">
            <span>{{ guestHalfScore }}/{{ guestNextScore }}</span>
          </td>
          <td :class="['all', {'goal': match.guestGoalScore}]">
            <span
              v-if="match.status ==2 || match.status === 3"
              class="all-score"
            >{{ match.guestTeamScore }}</span>
            <span v-else>-</span>
          </td>
          <td class="diff">
            <span>{{ allDiff }}</span>
          </td>
          <td class="score-total">
            <span>{{ all }}</span>
          </td>
          <td class="pay">
            <span v-if="!entertainedExcute('ouzhi')">
              <span :class="getColor(2, 2)">{{ setZhiShu(match, ['valueForType2', 'value0ForType2'], 'ouzhi') }}</span>
              <i
                :class="[getIconClass(2, 2), 'iconfont']"
              />
            </span>
            <span v-else>封</span>
          </td>
          <td class="rang-score">
            <span v-if="!entertainedExcute('yapan')">
              <span
                class="rang-score__first"
                :style="{visibility: concede > 0 ? 'visible' : 'hidden'}"
              >{{ concede }}</span>
              <span
                :class="[getColor(1, 2), 'rang-score__second']"
              >
                {{ setZhiShu(match, ['valueForType2', 'value0ForType2'], 'yapan') }}
                <i
                  :class="[getIconClass(1, 2), 'iconfont']"
                />
              </span>
            </span>
            <span
              v-else
              style="padding-left: 60px"
            >
              封
            </span>
          </td>
          <td class="big-small">
            <div v-if="!entertainedExcute('dx')">
              <span class="big-small__first">{{ bigBall ? '小' + bigBall : '' }}</span>
              <span :class="getColor(3, 2)">
                {{ setZhiShu(match, ['valueForType2', 'value0ForType2'], 'dx') }}
                <i
                  :class="[getIconClass(3, 2), 'iconfont']"
                />
              </span>
            </div>
            <span
              v-else
              style="float:right"
            >
              封
            </span>
          </td>
          <td
            class="intelligence"
            rowspan="2"
          >
            <router-link
              :to="`/score/detail/basketball/analyze/${match.matchId}`"
              class="analyze"
              target="_blank"
            >
              析
            </router-link>
            <div class="intelligence__second">
              <router-link
                :to="`/score/detail/basketball/yapan/${match.matchId}`"
                target="_blank"
              >
                亚
              </router-link>
              <router-link
                :to="`/score/detail/basketball/ouzhi/${match.matchId}`"
                target="_blank"
              >
                欧
              </router-link>
              <router-link
                :to="`/score/detail/basketball/dx/${match.matchId}`"
                target="_blank"
              >
                大
              </router-link>
            </div>
          </td>
        </tr>
        <tr class="content">
          <td class="name">
            <div>
              <default-img
                :src="match.hostTeamLogo"
                :default-url="defaultImg.basketball"
              />
              <tooltip
                class="league-name"
                placement="top"
                :content="match.hostTeamName"
              >
                <span class="desc ellipsis">{{ match.hostTeamName }}</span>
              </tooltip>
            </div>
          </td>
          <td class="lesson ">
            <span>{{ showPeriod(match, [11, 12, 31, 13, 14, 20]) ? getPeriod(match.period, 'Period1').team1 : '-' }}</span>
            <span>{{ showPeriod(match, [12, 31, 13, 14, 20]) ? getPeriod(match.period, 'Period2').team1 : '-' }}</span>
            <span>{{ showPeriod(match, [13, 14, 20]) ? getPeriod(match.period, 'Period3').team1 : '-' }}</span>
            <span>{{ showPeriod(match, [14, 20]) ? getPeriod(match.period, 'Period4').team1 : '-' }}</span>
            <span v-if="match.period && match.period.Overtime">{{ match.period.Overtime.team1 }}</span>
          </td>
          <td class="up-down ">
            <span>{{ hostHalfScore }}/{{ hostNextScore }}</span>
          </td>
          <td :class="['all', {'goal': match.hostGoalScore}]">
            <Poptip
              v-if="isvisible"
              placement="bottom"
              trigger="hover"
              @on-popper-show="debounceMouseoverOdds(queryBasketballTeamStat(match.matchId), 400)()"
            >
              <a
                href="javascript:"
                :class="[{'ref-hover': match.status!=1}]" 
              />
              <span
                v-if="match.status === 2 || match.status === 3"
                class="all-score"
              > {{ match.hostTeamScore }} </span>
              <span v-else>-</span>
              <div
                v-if="match.status!=1"
                slot="content"
                class="select-content"
              >
                <TeamTip
                  :info="teamInfo"
                  :host-team-name="match.hostTeamName"
                  :guest-team-name="match.guestTeamName"
                  :match="match"
                />
              </div>
            </Poptip>
            <div v-else>
              <span
                v-if="match.status === 2 || match.status === 3"
                class="all-score"
              > {{ match.hostTeamScore }} </span>
              <span v-else>-</span>
            </div>
          </td>
          <td class="diff ">
            <span>{{ halfDiff }}</span>
          </td>
          <td class="score-total ">
            <span>{{ half }}</span>
          </td>
          <td class="pay ">
            <span v-if="!entertainedExcute('ouzhi')">
              <span :class="getColor(2, 1)">{{ setZhiShu(match, ['valueForType1', 'value0ForType1'], 'ouzhi') }}</span>
              <i
                :class="[getIconClass(2, 1), 'iconfont']"
              />
            </span>
            <span v-else>封</span>
          </td>
          <td class="rang-score ">
            <span v-if="!entertainedExcute('yapan')">
              <LetScoreTip
                :set-zhi-shu="setZhiShu"
                :concede="concede"
                :get-color="getColor"
                :get-icon-class="getIconClass"
                :match="match"
                :type-id="1"
                :isvisible="isvisible"
                v-bind="$attrs"
              />
            </span>
            <span
              v-else
              style="padding-left: 60px"
            >
              封
            </span>
          </td>
          <td class="big-small-new">
            <div v-if="!entertainedExcute('dx')">
              <DxScoreTip
                :set-zhi-shu="setZhiShu"
                :concede="concede"
                :get-color="getColor"
                :get-icon-class="getIconClass"
                :match="match"
                :type-id="3"
                :big-ball="bigBall"
                :isvisible="isvisible"
                v-bind="$attrs"
              />
            </div>
            <span
              v-else
              style="float:right; width: 50%; font-weight: 600"
            >
              封
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { Checkbox, Tooltip, Poptip } from 'iview'
import LetScoreTip from './LetScoreTip'
import DxScoreTip from './DxScoreTip'
import TeamTip from './TeamTip'
import DefaultImg from '@src/components/DefaultImg'
import { match } from 'minimatch'
import statusCodeUtil from '../../../../../../../comm/utils/statusCode'

const unknownPeriod = {
  team1: '-',
  team2: '-'
}
export default {
  components: {
    Checkbox,
    DefaultImg,
    Tooltip,
    LetScoreTip,
    DxScoreTip,
    TeamTip,
    Poptip
  },
  filters: {
    statusCodeText(val) {
      let text = statusCodeUtil[val]
      if (val === 0 || val === 100) {
        text = text.slice(0, 1)
      }
      return text
    }
  },
  props: ['match', 'type', 'scrollTop'],
  data () {
    return {
      teamInfo: {},
      guestStateList: [],
      hostStateList: [],
      stateList: [],
      istempHeight: false,
      isvisible: false,
      statusText: {
        1: '未开始',
        2: 'live',
        3: '已完赛',
        4: '异常'
      },
      checked: false,
      statusClass: ['', 'name-blue', 'name-red', 'name-blue', 'name-blue'], //'','未开始','正在进行','完成','取消'
      hoverArrow: false
    }
  },
  computed: {
    isShow () {
      return !this.match.hide || this.type === 'stick'
    },
    timePlayed () {
      if (this.match.status === 2) {
        let m = Math.floor(this.timePlayed / 60)
        let s = this.timePlayed % 60
        return (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s)
      }
      return ''
    },
    guestHalfScore () {
      if ((this.match.status === 2 || this.match.status === 3) && this.match.period) {
        let {Period1, Period2} = this.match.period
        let half = (Period1 && parseFloat(Period1.team2) || 0) + (Period2 && parseFloat(Period2.team2) || 0)
        return half || '-'
      }
      return '-'
    },
    guestNextScore () {
      if (this.match.status === 3 || this.match.guestTeamScore - this.guestHalfScore > 0) {
        let next = this.match.guestTeamScore - this.guestHalfScore
        return (next || next===0) ? next : '-'
      }
      return '-'
    },
    hostHalfScore () {
      if ((this.match.status === 2 || this.match.status === 3) && this.match.period) {
        let {Period1, Period2} = this.match.period
        let half = (Period1 && parseFloat(Period1.team1) || 0) + (Period2 && parseFloat(Period2.team1) || 0)
        return half || '-'
      }
      return '-'
    },
    hostNextScore () {
      if (this.match.status === 3 || this.match.hostTeamScore - this.hostHalfScore > 0) {
        let next = this.match.hostTeamScore - this.hostHalfScore
        return (next || next===0) ? next : '-'
      }
      return '-'
    },
    all () {
      if (this.showPeriod(this.match, [13, 14, 20])) {
        let all = this.match.guestTeamScore + this.match.hostTeamScore
        return '全: ' + ((all || all===0) ? all : '-')
      }
      return ''
    },
    half () {
      if (this.match.status === 2 || this.match.status === 3) {
        let all = this.hostHalfScore + this.guestHalfScore
        return '半: ' + ((all || all===0) ? all : '-')
      }
      return ''
    },
    allDiff () {
      if (this.showPeriod(this.match, [13, 14, 20])) {
        let diff = this.match.hostTeamScore - this.match.guestTeamScore
        return '全: ' + ((diff || diff===0) ? diff : '-')
      }
      return ''
    },
    halfDiff () {
      if (this.match.status === 2 || this.match.status === 3) {
        let diff = this.hostHalfScore - this.guestHalfScore
        return '半: ' + ((diff || diff===0) ? diff : '-')
      }
      return ''
    },
    concede () {
      if(!this.match.odds) return
      let status = this.match.status // 1,未来赛事 2,正在进行 3,完场比分
      if(status == 3) {
        return this.match.odds[1] ? this.match.odds[1].ovalue : ''
      }
      return (this.match.odds[1]||this.match.odds[121]) ? 
        (this.match.odds[121] && this.match.odds[121].ovalue) || 
      this.match.odds[1].ovalue || this.match.odds[1].ovalue0Num : ''
    },
    bigBall () {
      let status = this.match.status // 1,未来赛事 2,正在进行 3,完场比分
      if(!this.match.odds) return
      if(status == 3) {
        return this.match.odds[3] ? this.match.odds[3].ovalueNum : ''
      }
      return (this.match.odds[3]||this.match.odds[122]) ? 
        (this.match.odds[122] && this.match.odds[122].ovalueNum) || 
      this.match.odds[3].ovalueNum || 
      this.match.odds[3].ovalue0Num : ''
    }
  },
  watch: {
    scrollTop(val){
      this.excuteScroll()
    },
  },
  mounted(){
    this.excuteScroll()
  },
  methods: {
    entertained(val1, val2){ // 封盘
      let flag = !!(parseFloat(val1)===0 && parseFloat(val2)===0)
      return {
        flag,
        text: '封'
      }
    },
    entertainedExcute(type){
      let {entertained, setZhiShu, match} = this 
      return entertained(setZhiShu(match, ['valueForType1', 'value0ForType1'], type), setZhiShu(match, ['valueForType2', 'value0ForType2'], type)).flag
    },
    isInVisibleArea(elem){
      if(!elem || !elem.getBoundingClientRect) return true
      let visibleObj = {}
      let rect = elem.getBoundingClientRect()
      let tempHeight = 800
      if((rect.top < window.innerHeight) && (rect.bottom > 0) &&
        rect.left < window.innerWidth && rect.right > 0){
        visibleObj.isvisible = true
      }else{
        visibleObj.isvisible = false
      }
      if((rect.top < window.innerHeight + tempHeight) && (rect.bottom > 0 - tempHeight) &&
        rect.left < window.innerWidth && rect.right > 0){
        visibleObj.istempHeight = true
      }else{
        visibleObj.istempHeight = false
      }
      return visibleObj
    },
    excuteScroll(){
      this.$nextTick(()=>{
        this.isvisible = this.isInVisibleArea(this.$refs.matchItem).isvisible
        this.istempHeight = this.isInVisibleArea(this.$refs.matchItem).istempHeight
      })
    },
    debounceMouseoverOdds(fn,delay) { // 禁止高频触发
      this.timer = null
      return ()=> {
        if(this.timer){
          clearTimeout(this.timer) 
        }
        this.timer = setTimeout(fn, delay)
      }
    },
    queryBasketballTeamStat(matchId){
      this.$get('v7/queryBasketballTeamStat', {
        matchId
      }).then(res => {
        const { code, data={} } = res
        if(code === 200 && data) {
          this.teamInfo = data
          this.assembleData(data)
        }
      })
    },
    // 组装数据
    assembleData(data) {
      data = data || {}
      this.guestStateList = []
      this.hostStateList = []
      this.stateList = []
      // 投篮命中率
      if(data.guestShtRt || data.hostShtRt) {
        this.guestStateList.push({
          title: '投篮',
          value: data.guestShtRt || 0
        })
        this.hostStateList.push({
          title: '投篮',
          value: data.hostShtRt || 0
        })
      }
      // 罚球命中率
      if(data.guestPnltyRt || data.hostPnltyRt) {
        this.guestStateList.push({
          title: '罚球',
          value: data.guestPnltyRt || 0
        })
        this.hostStateList.push({
          title: '罚球',
          value: data.hostPnltyRt || 0
        })
      }
      // 三分命中率
      if(data.guestThrPntRt || data.hostThrPntRt) {
        this.guestStateList.push({
          title: '三分',
          value: data.guestThrPntRt || 0
        })
        this.hostStateList.push({
          title: '三分',
          value: data.hostThrPntRt || 0
        })
      }

      ///// 其他技术统计
      // 篮板
      if(data.guestRbnd || data.hostRbnd) {
        this.stateList.push({
          title: '篮板',
          team1: data.guestRbnd || 0,
          team2: data.hostRbnd || 0
        })
      }

      // 助攻
      if(data.guestAssist || data.hostAssist) {
        this.stateList.push({
          title: '助攻',
          team1: data.guestAssist || 0,
          team2: data.hostAssist || 0
        })
      }
      // 抢断
      if(data.guestSteal || data.hostSteal) {
        this.stateList.push({
          title: '抢断',
          team1: data.guestSteal || 0,
          team2: data.hostSteal || 0
        })
      }
      // 盖帽
      if(data.guestBlckSht || data.hostBlckSht) {
        this.stateList.push({
          title: '盖帽',
          team1: data.guestBlckSht || 0,
          team2: data.hostBlckSht || 0
        })
      }
      // 失误
      if(data.guestTurnover || data.hostTurnover) {
        this.stateList.push({
          title: '失误',
          team1: data.guestTurnover || 0,
          team2: data.hostTurnover || 0
        })
      }
      // 罚球
      if(data.guestPnlty || data.hostPnlty) {
        this.stateList.push({
          title: '罚球',
          team1: data.guestPnlty || 0,
          team2: data.hostPnlty || 0
        })
      }
      // 三分
      if(data.guestThrPnt || data.hostThrPnt) {
        this.stateList.push({
          title: '三分',
          team1: data.guestThrPnt || 0,
          team2: data.hostThrPnt || 0
        })
      }
      // 犯规
      if(data.guestFoul || data.hostFoul) {
        this.stateList.push({
          title: '犯规',
          team1: data.guestFoul || 0,
          team2: data.hostFoul || 0
        })
      }
    },
    // 跳转到直播、动画
    toLiveDetail(id, roomId) {
      let query = {
        id
      }
      roomId && (query.roomId = roomId)
      this.$router.openNewPage({
        path: '/live/detail',
        query
      })
    },
    setZhiShu(item, key, type) {
      if(!item.odds) return
      let status = item.status // 1,未来赛事 2,正在进行 3,完场比分
      if(type === 'yapan') {
        if (status == 1) { // 即时盘key[0] || 初盘key[1]
          return item.odds['1'] ? (item.odds['1'][key[0]] || item.odds['1'][key[1]]) : ''
        } else if(status == 2) { // 滚球 || 即时盘 || 初盘
          // if(item.matchId === 1616057 && item.odds['121']) {
          // }
          return (item.odds['121'] && item.odds['121'][key[0]])// || (item.odds['1'] ? (item.odds['1'][key[0]] || item.odds['1'][key[1]]) : '')
        } else if(status == 3) { // 初盘
          return item.odds['1'] ? (item.odds['1'][key[0]] || item.odds['1'][key[1]]) : ''
        }
      } else if(type === 'dx'){
        if (status == 1) { // 即时盘key[0] || 初盘key[1]
          return item.odds['3'] ? (item.odds['3'][key[0]] || item.odds['3'][key[1]]) : ''
        } else if(status == 2) { // 滚球 || 即时盘 || 初盘
          return (item.odds['122'] && item.odds['122'][key[0]])// || (item.odds['3'] ? (item.odds['3'][key[0]] || item.odds['3'][key[1]]) : '')
        } else if(status == 3) { // 初盘
          return item.odds['3'] ? (item.odds['3'][key[0]] || item.odds['3'][key[1]]) : ''
        }
      } else if(type === 'ouzhi'){
        if (status == 1) { // 即时盘key[0] || 初盘key[1]
          return item.odds['2'] ? (item.odds['2'][key[0]] || item.odds['2'][key[1]]) : ''
        } else if(status == 2) { // 滚球 || 即时盘 || 初盘
          return (item.odds['128'] && item.odds['128'][key[0]])// || (item.odds['2'] ? (item.odds['2'][key[0]] || item.odds['2'][key[1]]) : '')
        } else if(status == 3) { // 初盘
          return item.odds['2'] ? (item.odds['2'][key[0]] || item.odds['2'][key[1]]) : ''
        }
      }
    },
    rollTypeId(attr){
      let rollTypeId
      switch (parseInt(attr)) {
      case 1: rollTypeId=121;break
      case 2: rollTypeId=128;break
      case 3: rollTypeId=122;break
      }
      return rollTypeId
    },
    getColor (attr, end) {
      let rollTypeId = this.rollTypeId(attr)
      if (this.match.odds && ((this.match.odds[rollTypeId] && this.match.odds[rollTypeId]['status' + end]) || (this.match.odds[attr] && this.match.odds[attr]['status' + end]))) {
        let odd = (this.match.odds[rollTypeId] && this.match.odds[rollTypeId]['status' + end]) || (this.match.odds[attr] && this.match.odds[attr]['status' + end])
        if (odd === 'iconca_ei') {
          return 'c-red'
        } else {
          return 'c-green'
        }
      }
      return ''
    },
    getIconClass (attr, end) {
      let rollTypeId = this.rollTypeId(attr)
      return this.match.odds ? (this.match.odds[rollTypeId] && this.match.odds[rollTypeId]['status' + end]) || (this.match.odds[attr] && this.match.odds[attr]['status' + end]) : ''
    },
    oneTip (msg) {
      if (window.document.querySelector('.ivu-message-notice')) {
        return
      }
      this.$tip(msg)
    },
    showPeriod (match, arr) {
      return match.status === 3 || arr.indexOf(match.statusCode) !== -1
    },
    getPeriod (period, attr) {
      if (!period || !period[attr]) return unknownPeriod
      return period[attr]
    },
    handlerStick () {
      if (this.type === 'stick') {
        this.bus.$emit('stickDel', this.match)
      } else {
        this.bus.$emit('stickAdd', this.match)
      }
      // this.bus.$emit('removeTempHide', this.match.matchId)
    },
    checkedHide (isCheck, match) {
      this.$set(match, 'isChecked', isCheck)
      this.$emit('tempHide', isCheck, match.matchId)
    },
    dealTime(param) {
      if(this.match.statusCode == 31) return ''
      if (param) {
        if (param !== 0 ) {
          return this.dayjs(Math.abs(param)*1000).format('mm:ss')
        } 
        if (param === 0) {
          return '00:00'
        }
      }
      return '00:00'
    }
  }
}
</script>

<style lang="scss" scoped>
  $borderColor: #F7F7F7;

  @import './../../../../public/checkbox.scss';

.live-logo{
  width: 12px;
}
/deep/ {
  .ivu-poptip-arrow{
    display: none;
  }
  .ivu-poptip-inner{
    background: transparent;
    box-shadow: none;
  }
  .ref-hover{
    position: absolute;
    left: 0;
    right: 0;
    top: -50px;
    bottom: -5px;
    z-index: 1;
    
  } 
}
.competition-list {
  &__table {
    width: 1102px;
    background: #FFFFFF;
    border-collapse: separate;
    border: 1px solid #EAEAEA;
      td {
        border-collapse: separate;
      }
      .content:nth-child(3) {
        td {
          border-top: none;
        }
      }
    }
  }

  .live {
    .iconcl_dl {
      color: #168058;
    }
    .iconcm_di {
      color: #e15756;
      &:hover {
        color: #E80300;
      }
    }
    .iconfont {
      cursor: pointer;
      font-size: 20px;
      width: 24px;
      height: 21px;
      vertical-align: middle;
    }
    .iconge_dj1, .icongg_dj{
      color: #C9C9C9;
      font-size: 26px;
      vertical-align: middle;
      &.down.icongg_dj{
        transition: all 2s;
        &:before{
          color: $blue;
        }
      }
      &:hover:before{
        color: #3683FF;
      }
      &:active:before{
        color: #3683FF;
      }
    }
  }
	.c-red {
    color: #E15756;
    font-weight: 600;
    &:hover{
      opacity: 0.8;
    }
	}
	.c-green {
		color: #4DA183;
	}
	.status-text {
		color: #999;
		font-size: 12px;
	}
  .status-red {
    color: #E15756;
  }
  .status {
    padding-top: 2px;
    padding-right: 2px;
    width: 70px;
    text-align: right;
    font-weight: 400;
  }
	.iconca_el, .iconca_ei {
		font-size: 12px;
    vertical-align: middle;
    &::before{
      @keyframes changeOdd{
        50%{opacity: 0.1;}
      }
      animation: changeOdd .5s linear .1s 5;
      animation-fill-mode:forwards;
    }
		&.iconca_ei {
			color: #E15756;
		}
		&.iconca_el {
			color: #4DA183;
		}
	}
	.pay {
		span {
			vertical-align: middle;
		}	
  }
  .name {
    span {
      display: inline-block;
      vertical-align: middle;
    }
    .league-name {
      width: 40px;
      margin-right: 5px;
      vertical-align: middle;
      &:hover{
        color: #3683FF;
      }
    }
    .desc {
      width: 80px;
    }
    .time {
      padding-top: 2px;
      padding-right: 1px;
      color: #E15756;
      font-weight: 400;
    }
  }

  .header {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #666;
    letter-spacing: 0;
    height: 40px;
    border-bottom: 1px solid #F7F7F7;
    .pay,.rang-score,.big-small {
      &.pay{
        border-left: 1px solid #EAEAEA;
      }
    }
    th {
      font-weight: 100;
      vertical-align: middle;
      &:first-child {
        border: none;
      }
      &.intelligence {
        padding-right: 10px;
        border-left: 1px solid #EAEAEA;
        text-align: right;
        .ivu-tooltip+.ivu-tooltip{
          padding-left: 8px;
        }
      }
    }
    .name {
      padding-left: 12px;
      position: relative;
      &::before{
        content: ' ';
        position: absolute;
        left: 0;
        top: 0;
        width: 4px;
        height: 100%;
      }
      &-red {
        &::before{
          background-image: url(../../../../assets/score/football/red.png);
          background-repeat: no-repeat;    
          background-size: 180px;
        }
      }
      &-blue {
        &::before{
          background-image: url(../../../../assets/score/football/blue.png);
          background-repeat: no-repeat;
          background-size: 180px;   
        }
      }
    }
    .header-lesson {
      span {
        color: #666;
      }
    }
  }
  tbody{
    tr:nth-of-type(1){
      td:nth-of-type(1){
        position: relative;
        &::before{
          content: ' ';
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 100%;
          top: 50%;
          margin-top: -2px;
          left: -22px;
          background: #5E9CFF;
        }
        &.going{
          &::before{
            background: #E77978;
          }
        }
        &::after{
          content: ' ';
          position: absolute;
          border: 1px solid #EAEAEA;
          width: 11px;
          height: 11px;
          top: 50%;
          margin-top: -5.5px;
          transform: rotate(45deg);
          left: -6px;
          background: #fff;
        }
      }
    }
  }
  .content {
    .all-score{
      color: #E15756;
    }
    .all {
      font-weight: 700;
      @keyframes goal{
        50%{background:#f9e5e5}
      }
      &.goal{
        animation: goal .8s linear .1s 5;
        animation-fill-mode:forwards;
      }
    }
    .pay,.rang-score,.big-small {
      font-weight: 600;
      background: #fcfcfc;
    }
    .rang-score{
      .rang-score__first {
        display: inline-block;
        width: 60px;
        text-align: left;
        color: #E4742F;
      }
      /deep/ {
        .ivu-poptip-arrow{
          display: none;
        }
        .ivu-poptip-inner{
          background: transparent;
          box-shadow: none;
        }
      }
      .select-content {
        width: 408px;
        background: rgba(0, 0, 0, 0.85);
        box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.09);
        border-radius: 4px;
        font-size: 12px;
        color: #ffffff;
        text-align: center;
      }
    }
    .big-small {
      border-right: none;
    }
    .name {
      >div{
        position: relative;
        z-index: 1;
        padding-left: 12px;
        background: #fff;
      }
      .desc {
        width: 130px;
        font-weight: 600;
      }
    }
    .intelligence{
      .analyze{
        font-family: PingFangSC-Medium;
        font-weight: 600;
        font-size: 14px;
        color: #E13F3D;
        &:hover{
          text-decoration: underline;
        }
      }
      .intelligence__second{
        margin-top: 4px;
        padding: 0 27px 0 28px;
        display: flex;
        justify-content: space-between;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #333333;
        a{
          &:hover{
            color: #3683FF;
          }
        }
      }
    }
  }
  .lesson {
    span {
      display: inline-block;
      width: 34px;
      color: #333;
    }
  }

  .checkbox {
    width: 87px !important;
    padding-top: 40px;
    display: inline-block;
    .ivu-checkbox-wrapper{
      transform: translateY(11px);
    }
    .red {
      font-size: 12px;
    }
  }
  .red.status{
    vertical-align: middle;
  }
  .checkbox-time {
    font-size: 16px;
    color: #333333;     
  }
  .iconbu_de {
    color: #666;
    font-size: 12px;
  }
  .iconbv_de {
    font-size: 12px;
    color: #666;
  }

</style>