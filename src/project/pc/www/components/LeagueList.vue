<template>
  <div :class="['league-list', {'all-match': status === '', 'all-match-oddType': status === '' && oddType != 0}]">
    <Affix
      v-if="isShowHeader"
      :offset-top="60"
    >
      <ul
        class="league-header"
      >
        <li
          v-if="status === ''"
          class="cell cell1"
        >
          <span
            v-if="isCheckedAll"
            class="ic_checked_cf"
            @click="$emit('toCheck', 0)"
          />
          <span
            v-else
            class="iconbs_cf"
            @click="$emit('toCheck', 0)"
          />
        </li>
        <li class="cell cell2">
          赛事
        </li>
        <li class="cell cell3">
          时间
        </li>
        <li
          v-if="hasSortNo"
          class="cell cell3"
        >
          编号
        </li>
        <li class="cell cell4">
          状态
        </li>
        <li :class="['cell', 'cell5', {oddType: hasSortNo}]">
          主场球队
        </li>
        <li class="cell cell6">
          比分
        </li>
        <li :class="['cell', 'cell7', {oddType: hasSortNo}]">
          客场球队
        </li>
        <li class="cell cell8">
          半场
        </li>
        <li class="cell cell9">
          角球
        </li>
        <li class="cell cell10">
          直播
        </li>
        <li class="cell cell11">
          指数
        </li>
        <li class="cell cell12">
          分析
        </li>
        <li
          v-if="status === ''"
          class="cell cell13"
        >
          操作
        </li>
      </ul>
      <SearchFilter
        class="search-filter"
        :main-list="mainList"
        :top-list="topList"
      />
    </Affix>
    <ul
      v-if="list.length > 0"
      class="league-body"
      @mouseover="mouseoverHandler"
    >
      <LeagueItem
        v-for="(item, index) in list"
        :id="item.curSearched && 'cur-searched'"
        :key="item.matchId"
        :class="[{'is-searched': item.isSearched, 'cur-searched': item.curSearched}]"
        :scroll-top="scrollTop"
        :book-id="bookId"
        :top-ids-list="topIdsList"
        :odd-type="oddType"
        :is-checked-all="isCheckedAll"
        :status="status"
        :item="item"
        :index="index"
        :list="list"
        :temp-setting-data="tempSettingData"
        :checked-hides="checkedHides"
        :is-interface-update="isInterfaceUpdate"
        @toTop="toTop"
        @toCheck="toCheck"
      />
    </ul>
  </div>
</template>
<script>
import { Affix } from 'iview'
import LeagueItem from './LeagueItem'
import default_logo from '../assets/default_team_logo.png'
import SearchFilter from '../pages/score/football/components/SearchFilter'
// ui 主界面数据可能多一项 ID号

// https://live.leisu.com/

export default {
  components: {
    SearchFilter,
    Affix,
    LeagueItem
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
      isvisible: false,
      timer: null,
      default_logo,
      teamInfo: {}
    }
  },
  computed: {
    hasSortNo(){
      return this.oddType != 0
    }
  },
  watch: {
    scrollTop(val){
      this.excuteScroll()
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
        this.isvisible = this.isInVisibleArea(this.$refs.matchItem)
      })
    },
    isInVisibleArea(elem){
      if(!elem || !elem.getBoundingClientRect) return true

      var rect = elem.getBoundingClientRect()
    
      if(rect.top < window.innerHeight && rect.bottom > 0 &&
        rect.left < window.innerWidth && rect.right > 0){
        return true
      }else{
        return false
      }
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
        } else if(status == 3) { // 即时盘key[0]
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
.league-header,
.league-body /deep/ {
  font-size: 12px;
  color: #333333;
  line-height: 44px;
  .red-text {
    color: #E15756;
  }
  .green-text {
    color: #629500;
  }
  .cell {
    float: left;
    min-height: 10px;
  }

  .cell1 {
    width: 33px;
    cursor: pointer;
  }
  .cell2 {
    width: 124px;
    height: 44px;
    margin-right: 6px;
    padding-left: 14px;
    @extend .ellipsis;
    position: relative;
    span{
      vertical-align: middle;
      &.level{
        position: absolute;
        width: 4px;
        height: 40px;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        background: #FED138;
        &.level1{
          background: #DE1D30
        }
        &.level2{
          background: #FF9100
        }
        &.level3{
          background: #FED138
        }
        &.level4{
          background: #5B88BF
        }
        &.level5{
          background: #C6C3EE
        }
        &.level6{
          background: #999999
        }
        &.level7{
          background: #CCCCCC
        }
      }
      &.img{
        display: inline-block;
        max-height: 30px;
        overflow: hidden;
      }
      &.league-name{
        font-weight: 600;
        color: #666;
      }
    }
    img{
      width: 30px;
      vertical-align: top;
    }
  }
  .cell3 {
    width: 52px;
    text-align: center;
    margin-right: 6px;
    font-size: 12px;
  }
  .cell4 {
    width: 68px;
    height: 44px;
    text-align: center;
    .iconal_da {
      margin-right: 6px;
    }
    border-right: 1px solid #eaeaea;
  }
  .cell5,
  .cell7 {
    width: 147px;
    background-size: 18px auto;
    background-repeat: no-repeat;
    overflow: hidden;
    span{
      display: inline-block;
      vertical-align: middle;
      line-height: 1.66;
    }
    &.oddType{
      width: 130px;
    }
  }
  .cell5 {
    text-align: right;
    padding-right: 8px;
    background-position: right 14px;
    .card {
      display: inline-block;
      width: 10px;
      height: 14px;
      font-size: 12px;
      font-weight: normal;
      color: #ffffff;
      border-radius: 2px;
      text-align: center;
      line-height: 14px;
      vertical-align: baseline;
    }
    .red-card {
      background: #e15756;
    }
    .yellow-card {
      background: #f5aa58;
    }
  }
  .cell6 {
    width: 60px;
    text-align: center;
    padding: 6px 0;
    line-height: 32px;
    font-size: 18px;
  }
  .cell7 {
    text-align: left;
    padding-left: 8px;
    background-position: left center;
    border-right: 1px solid #eaeaea;
    .card {
      display: inline-block;
      width: 10px;
      height: 14px;
      font-size: 12px;
      font-weight: normal;
      color: #ffffff;
      border-radius: 2px;
      text-align: center;
      line-height: 14px;
      vertical-align: baseline;
    }
    .red-card {
      background: #e15756;
    }
    .yellow-card {
      background: #f5aa58;
    }
  }
  .cell8 {
    width: 68px;
    text-align: center;
  }
  .cell9 {
    width: 68px;
    text-align: center;
    .iconbz_ea {
      margin-right: 6px;
    }
  }
  .cell10 {
    width: 68px;
    height: 44px;
    text-align: center;
    border-right: 1px solid #eaeaea;
  }
  .cell11 {
    width: 212px;
    height: 44px;
    line-height: 17px;
    border-right: 1px solid #eaeaea;
    box-sizing: border-box;
  }

  .cell6 ,.cell11 {
    /deep/ .ivu-poptip-popper{
      padding: 0;
    }
    /deep/ .ivu-poptip-arrow{
      display: none;
    }
    /deep/ .ivu-poptip-inner{
      background: none;
      border: none;
      padding: 0;
      box-shadow: none;
    }
  }


  .cell12 {
    width: 68px;
    text-align: center;
    a{
      display: inline-block;
      width: 100%;
      font-family: PingFangSC-Medium;
      font-weight: 600;
      font-size: 14px;
      color:#E13F3D;
      &:hover{
        text-decoration: underline;
      }
    }
  }
  .cell13 {
    width: 36px;
    height: 44px;
    text-align: center;
  }
}

.league-header {
  background: #E6E6E6;
  overflow: hidden;
  padding: 0 20px 0 17px;
  font-size: 14px;
  .cell1{
    height: 44px;
  }
  .cell11 {
    text-align: center;
    line-height: 44px;
    padding: 0;
  }
  .cell6 {
    font-size: 14px;
  }
}


.iconal_da,
.iconbn_cl,
.iconcm_di,
.iconbs_cf,
.iconbz_ea,
.iconbv_de,
.iconbt_cg,
.iconcl_dl,
.iconcm_di,
.iconbu_de {
  font-family: 'iconfont';
  font-size: 16px;
  &.iconbs_cf{
    vertical-align: middle;
    height: 100%;
    &:hover{
      color: $blue;
    }
  }
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
.all-match-oddType{
  .league-header .cell3, .league-body .cell3{
    width: 40px;
    margin-right: 6px;
  }
  .league-header .cell5, .league-body .cell5{
    padding-right: 6px;
  }
  .league-header .cell7, .league-body .cell7{
    padding-left: 6px;
  }
  .cell-line {
    p:nth-of-type(1), p:nth-of-type(2) {
      width: 50px;
    }
  }
  /deep/ {
    .cell-line {
      p:nth-of-type(1), p:nth-of-type(2) {
        width: 30px;
      }
    }
  }
}

</style>
