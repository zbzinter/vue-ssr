<template>
  <li ref="matchItem">
    <div
      v-if="!isInterfaceUpdate || isvisible"
      class="row-line"
    >
      <p
        v-if="status === ''"
        class="cell cell1"
      >
        <span
          :class=" checkedHides.some(id=> id == item.matchId) ? 'ic_checked_cf' : 'iconbs_cf' "
          @click="toCheck(item.matchId)"
        />
      </p>

      <p class="cell cell2">
        <span :class="['level', `level${item.level}`]" />
        <span
          class="img"
          v-lazy-container="{ selector: 'img', error: defaultImg.football, loading: defaultImg.football }">
            <img :data-src="item.leagueLogo">
        </span>
        <span
          class="league-name"
          :title="item.leagueName.length > 4 ? item.leagueName : ''"
        >{{ item.leagueName }}</span>
      </p>
      <p class="cell cell3">
        {{ item.matchTime|dateFilter('hh:mm') }}
      </p>
      <p
        v-if="hasSortNo"
        class="cell cell3"
      >
        {{ item.sortNo }}
      </p>
      <div class="cell cell4">
        <div v-if="item.status == 1">
          <p>
            {{ item.statusCode | statusCodeText }}
          </p>
        </div>

        <div class="red-text">
          <i class="iconfont icongn_dj clock" />
          <span>{{ playedTime }}</span>
          <i
            v-if="item.statusCode != 31 && item.timePlayed && item.timePlayed > 0"
            class="infinite"
          >'</i>
        </div>

        <p v-if="item.status == 3">
          完
        </p>

        <div v-if="item.status == 4">
          <p>{{ item.statusCode | statusCodeText }}</p>
        </div>
      </div>
      <p
        :class="['cell', 'cell5', 'team-logo', {'goal': item.hostGoalScore, 'oddType': hasSortNo}]"
      >
        <span class="team-name">
          <img src="../static/assets/es_fj.png">
          <span
            v-if="item.penalty && item.penalty.hostYellow > 0 && tempSettingData[3].isChecked"
            class="card yellow-card"
          >{{ item.penalty.hostYellow }}</span>
          <span
            v-if="item.penalty && item.penalty.hostRed > 0 && tempSettingData[3].isChecked"
            class="card red-card"
          >{{ item.penalty.hostRed }}</span>
          {{ item.hostTeamName }}
        </span>
      </p>
      <div
        class="cell cell6 number red-text"
      >
        <div
          v-if="item.status == 1 || item.status == 4"
          class="gray"
        >
          -
        </div>
        <div
          v-else
          class="js-cell6-hover"
          :data-item="JSON.stringify(item)"
          :data-index="index"
        >
          <p v-if="!item.isHover || !isvisible">
            {{ item.homeTeamNormalScore || 0 }}-{{ item.awayTeamNormalScore || 0 }}
          </p>
          <Poptip
            v-else
            placement="right-start"
            trigger="hover"
            @on-popper-show="debounceMouseoverOdds(showTeamTip(item.matchId), 400)()"
          >
            <p>{{ item.homeTeamNormalScore || 0 }}-{{ item.awayTeamNormalScore || 0 }}</p>
            <div
              v-if="item.hostTeamScore !== ''"
              slot="content"
              class="select-content"
            >
              <TeamTip
                :info="teamInfo"
                :host-team-name="item.hostTeamName"
                :guest-team-name="item.guestTeamName"
              />
            </div>
          </Poptip>
        </div>
      </div>
      <p
        :class="['cell', 'cell7', 'team-logo', {'goal': item.guestGoalScore, 'oddType': hasSortNo}]"
      >
        <span class="team-name">
          {{ item.guestTeamName }}
          <span
            v-if="item.penalty && item.penalty.guestRed > 0 && tempSettingData[3].isChecked"
            class="card red-card"
          >{{ item.penalty.guestRed }}</span>
          <span
            v-if="item.penalty && item.penalty.guestYellow > 0 && tempSettingData[3].isChecked"
            class="card yellow-card"
          >{{ item.penalty.guestYellow }}</span>
          <img src="../static/assets/es_fj.png">
        </span>
      </p>
      <p
        v-if="item.status == 1 || item.status == 4"
        class="cell cell8"
      >
        -
      </p>
      <p
        v-else-if="item.status == 2 && item.statusCode == 1"
        class="cell cell8"
      >
        -
      </p>
      <p
        v-else
        class="cell cell8"
      >
        {{ item.hostHalfScore }}-{{ item.guestHalfScore }}
      </p>
      <p class="cell cell9">
        <span
          v-if="item.penalty"
          class="iconbz_ea"
        />
        {{ item.penalty ? item.penalty.hostCorner : '' }}-{{ item.penalty ? item.penalty.guestCorner : '' }}
      </p>
      <p
        v-if="isvisible"
        class="cell cell10"
      >
        <Tooltip
          v-if="item.hasLive == 1"
          content="视频"
        >
          <i
            class="iconfont iconcm_di"
            @click="toLiveDetail(item.matchId)"
          />
        </Tooltip>
        <Tooltip
          v-else-if="item.lmtMode == 1"
          content="动画"
        >
          <i
            class="iconfont iconcl_dl"
            @click="toLiveDetail(item.matchId)"
          />
        </Tooltip>
      </p>
      <p
        v-else
        class="cell cell10"
      >
        <i
          v-if="item.hasLive == 1"
          class="iconfont iconcm_di"
        />
        <i
          v-else-if="item.lmtMode == 1"
          class="iconfont iconcl_dl"
        />
      </p>
      <div class="cell cell11">
        <div
          :data-item="JSON.stringify(item)"
          :data-index="index"
          class="js-cell11-hover"
        >
          <LeagueOdds
            v-if="!item.isHover || !isvisible"
            :item="item"
            :set-zhi-shu="setZhiShu"
          />
          <Poptip
            v-else
            placement="bottom"
            trigger="hover"
          >
            <!-- hover -->
            <LeagueOdds
              v-if="item.isHover"
              :item="item"
              :set-zhi-shu="setZhiShu"
            />
            <div
              v-if="item.odds"
              slot="content"
              class="select-content"
            >
              <div>
                <IndexTip
                  :info="item.odds"
                  :status="item.status"
                  :host-team-name="item.hostTeamName"
                  :guest-team-name="item.guestTeamName"
                  :host-team-score="item.homeTeamNormalScore"
                  :guest-team-score="item.awayTeamNormalScore"
                />
              </div>
            </div>
          </Poptip>
        </div>
      </div>
      <p class="cell cell12 red-text">
        <router-link
          v-if="isvisible"
          :to="`/score/detail/football/analyze/${item.matchId}`"
          target="_blank"
        >
          析
        </router-link>
        <a
          v-else
          href="javascript:"
        >析</a>
      </p>
      <p
        v-if="status === ''"
        class="cell cell13"
      >
        <i
          class="iconfont"
          :class="topIdsList.length > 0 && topIdsList.some(topId => topId === item.matchId) ? 'icongg_dj down' : 'iconge_dj1'"
          @click="toTop(item.matchId)"
        />
      </p>
    </div>

    <div
      v-if="dayjs(item.matchTime).format('YYYY-MM-DD') !== dayjs(list[Math.min(index+1, list.length-1)].matchTime).format('YYYY-MM-DD')"
      :class="[`cls${item.status}`, 'no-today']"
    >
      <img src="../assets/score/gk_dj@2x.png">
      <span>{{ dayjs(list[Math.min(index+1, list.length-1)].matchTime).format('YYYY年MM月DD日') }}</span>
    </div>
  </li>
</template>
<script>
import { Poptip, Tooltip } from 'iview'
import TeamTip from './TeamTip'
import IndexTip from './IndexTip'
import LeagueOdds from './LeagueOdds'
import DefaultImg from '@src/components/DefaultImg'
import {statusCodeText} from '@src/filters/common.js'
// ui 主界面数据可能多一项 ID号

// https://live.leisu.com/

export default {
  components: {
    Poptip,
    Tooltip,
    TeamTip,
    IndexTip,
    LeagueOdds,
    DefaultImg
  },
  props: {
    isInterfaceUpdate: {
      type: Boolean,
      default: true
    },
    scrollTop: {
      type: Number,
      default: 0
    },
    bookId: {
      type: [Number, String],
      default: () => {
        return 31
      }
    },
    item: {
      type: Object,
      default: () => {
        return {}
      }
    },
    index: {
      type: Number,
      default: () => {
        return 0
      }
    },
    list: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 置顶id列表
    topIdsList: {
      type: Array,
      default: () => {
        return []
      }
    },

    // 0,全部 1,竞彩、2北单、3足彩
    oddType: {
      type: Number,
      default: 0
    },

    // 是否全选
    isCheckedAll: {
      type: Boolean,
      default: false
    },

    // 是否显示标题栏
    isShowHeader: {
      type: Boolean,
      default: false
    },
    // 当前页面的数据
    mainList: {
      type: null,
      default: () => {}
    },
    topList: {
      type: null,
      default: 0
    },
    // '' 即时比分, 1,未来赛事 2,正在进行 3,完场比分,
    status: {
      type: [Number, String],
      default: ''
    },

    checkedHides: {
      type: Array,
      default: () => {
        return []
      }
    },
    tempSettingData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      istempHeight: false,
      isvisible: false,
      timer: null,
      teamInfo: {}
    }
  },
  computed: {
    hasSortNo(){
      return this.oddType != 0
    },
    playedTime() {
      let ret = ''
      ret = statusCodeText(this.item.statusCode)
      let {status, statusCode, timePlayed} = this.item
      if(statusCode == 20 || statusCode == 21 || statusCode == 22) {
        ret='加'
      }else if(statusCode == 31) {
        ret='中'
      } else{
        if(timePlayed && timePlayed > 0 && this.item.status == 2) {
          if(statusCode===1 && Math.ceil(timePlayed/60) > 45){
            ret='45+'
          }else if(statusCode===2 && Math.ceil(timePlayed/60) > 90){
            ret='90+'
          } else {
            ret=Math.ceil(timePlayed/60)
          }
        }
      }
      return ret
    }
  },
  watch: {
    scrollTop(val){
      this.excuteScroll()
    },
    playedTime: {
      handler(val){
        this.$set(this.item, 'curTime', val)
      },
      immediate: true
    }
  },
  mounted(){
    this.excuteScroll()

  },
  methods: {
    toTop(matchId){
      this.$emit('toTop', matchId)
    },
    toCheck(matchId){
      this.$emit('toCheck', matchId)
    },
    excuteScroll(){
      this.$nextTick(()=>{
        this.isvisible = this.isInVisibleArea(this.$refs.matchItem).isvisible
        this.istempHeight = this.isInVisibleArea(this.$refs.matchItem).istempHeight
      })
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
    mouseoverHandler(event) { // 修复列表过多时的性能问题
      event =  window.event || event
      let path = event.path || (event.composedPath && event.composedPath())
      let itemVal = {}
      for (const [index, item] of Object.entries(path)) {
        if(/js-cell6-hover/.test(item.className)) {
          itemVal = this.list[item.getAttribute('data-index')]
          this.debounceMouseoverOdds(this.isHoverHandler(itemVal, 1), 400)()
          break
        }
        if(/js-cell11-hover/.test(item.className)) {
          itemVal = this.list[item.getAttribute('data-index')]
          this.debounceMouseoverOdds(this.mouseoverOdds(itemVal), 400)()
          break
        }
      }
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
    mouseoverOdds(item) {
      if(this.timer){
        clearTimeout(this.timer) 
      }
      return () => {
        if (item.isHover) return
        this.isHoverHandler(item, 1)()
        let { matchId } = item
        this.$get('v8/queryOdd', {
          bookId: this.bookId,
          matchId
        }).then(res => {
          let odds = res.data.filter(Boolean).reduce((total, item) => {
            if(item) {
              total = total || {}
              total[item.typeId] = item
              return total
            }
          }, {})
          item.odds = {...odds}
        })
      }
    },
    isHoverHandler(item, type){
      if(this.timer){
        clearTimeout(this.timer) 
      }
      return ()=>{
        item && this.$set(item, 'isHover', !!type)
      }
    },
    // 比分hover，显示详情
    showTeamTip(matchId) {
      if(this.timer){
        clearTimeout(this.timer) 
      }
      return ()=>{
        this.$get('v8/querySchedule', {
          matchId
        }).then(res => {
          this.teamInfo = res.data
        })
      }
    },
    setZhiShu(item, key, type) {
      let status = item.status // 1,未来赛事 2,正在进行 3,完场比分
      if(type === 'yapan') {
        if (status == 1) { // 即时盘key[0] || 初盘key[1]
          return item.odds['1'] ? (item.odds['1'][key[0]] || item.odds['1'][key[1]]) : ''
        } else if(status == 2) { // 滚球 || 即时盘 || 初盘
          return (item.odds['121'] && item.odds['121'][key[0]]) // || (item.odds['1'] ? (item.odds['1'][key[0]] || item.odds['1'][key[1]]) : '')
        } else if(status == 3) { // 即时盘key[0] || 初盘key[1]
          return item.odds['1'] ? (item.odds['1'][key[0]] || item.odds['1'][key[1]]) : ''
        }
      } else if(type === 'dx'){
        if (status == 1) { // 即时盘key[0] || 初盘key[1]
          return item.odds['3'] ? (item.odds['3'][key[0]] || item.odds['3'][key[1]]) : ''
        } else if(status == 2) { // 滚球 || 即时盘 || 初盘
          return (item.odds['122'] && item.odds['122'][key[0]]) // || (item.odds['3'] ? (item.odds['3'][key[0]] || item.odds['3'][key[1]]) : '')
        } else if(status == 3) { // 即时盘key[0]
          return item.odds['3'] ? (item.odds['3'][key[0]] || item.odds['3'][key[1]]) : ''
        }
      }
    },
    // 跳转到足球直播页
    toLiveDetail(id) {
      const routerData = this.$router.resolve({
        path: '/live/detail',
        query: {id}
      })
      window.open(routerData.href, '_blank')
    }
  }
}
</script>
<style lang="scss" scoped>
.league-list{
  &.all-match{
    border-top: 1px solid #eaeaea;
  }
}
	.ellipsis{
		overflow: hidden;
		text-overflow: ellipsis;
    white-space: nowrap;
	}
.ellipsis{
  @extend .ellipsis;
}

.search-filter{
  position: absolute;
  top: 0;
  right: -80px;
}

li {
  // height: 44px;
  &:nth-child(odd) {
    background: #fff;
  }
  @keyframes quer-team-animate{
    50%{background:#f9e5e5}
  }
  &.is-searched.cur-searched{
    animation: quer-team-animate .5s linear .1s 3;
    animation-fill-mode:forwards;
  }
  .row-line{
    height: 44px;
    overflow: hidden;
    padding: 0 20px 0 17px;
    border-bottom: 1px solid #EAEAEA;
    &:hover{
      background: #E6E6E6;
    }
  }
  .no-today{
    margin-top: 12px;
    text-align: center;
    font-size: 12px;
    line-height: normal;
    img{
      width: 24px;
    }
    span{
      margin-left: 2px;
      vertical-align: middle;
    }
    &.cls1{
      color: #3683FF;
    }
    &.cls2{
      color: #F5AA58;
    }
    &.cls3{
      color: #666666;
    }
    &.cls4{
      color: #E15756;
    }
  }
  .cell1{
    height: 44px;
    box-sizing: border-box;
  }
  .cell5, .cell7{
    color: #333;
    height: 44px;
    @keyframes goal{
        0%{-webkit-transform:rotate(0deg);}
        25%{-webkit-transform:rotate(90deg);}
        50%{-webkit-transform:rotate(180deg);}
        75%{-webkit-transform:rotate(270deg);}
        100%{-webkit-transform:rotate(360deg);}
    }
    img{
      display: none;
    }
    &.goal{
      background: #FFD5D3;
      font-family: PingFangSC-Medium;
      font-size: 12px;
      color: #E15756;
      letter-spacing: 0;
      img{
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        animation:goal .8s linear infinite
      }
    }
  }
  .cell2, .cell3, .cell8, .cell9{
    color: #666;
    .iconbz_ea{
      color: #999;
    }
  }
  .cell4{
    position: relative;
    color: #999;
    .clock{
      position: absolute;
      left: 1px;
    }
    .infinite{
      position: relative;
      left: -4px;
      opacity: 1;
      @keyframes second
      {
      from {opacity: 0;}
      70% {opacity: 0;}
      to {opacity: 1;}
      }
      animation:second 1s infinite
    }
  }
  .cell6, .cell11, .cell13{
    cursor: pointer;
    &.cell6{
      .gray{
        color: #666;
        font-size: 12px;
        font-family: initial;
      }
    }
  }
  .cell13{
    .iconge_dj1, .icongg_dj{
      display: inline-block;
      width: 100%;
      font-size: 26px;
      color: #C9C9C9;
      &:hover{
        color: #3683FF;
      }
      &.down.icongg_dj{
        transition: all 2s;
        &:before{
          color: $blue;
        }
      }
    }
  }

  .cell10 {
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
    }
  }
}

.iconal_da,
.iconbn_cl,
.iconcm_di,
.iconbs_cf,
.iconbz_ea,
.icongg_dj,
.iconbt_cg,
.iconcl_dl,
.iconcm_di,
.iconge_dj1 {
  font-family: 'iconfont';
  font-size: 16px;
  &.iconbs_cf{
    height: 100%;
    &:hover{
      color: $blue;
    }
  }
}
.iconca_ei,
.iconca_el {
  font-family: 'iconfont';
  font-size: 12px;
  font-style: normal;   
  &.iconca_el{
    /* 下降 */
    color: #629500;
  }
  &.iconca_ei{
    color: #E15756;
  }
}

.odds {
  width: 212px;
  height: 44px;
  padding-top: 6px;
  text-align: center;
}
.wrap {
  display: inline-block;
  vertical-align: middle;
  line-height: 17px;
}

.team-bg {
  background-repeat: no-repeat;
  background-size: 18px auto;
}

.team-name {
  cursor: pointer;
  &:hover {
    color: #333;
    font-weight: 700
  }
}

</style>
