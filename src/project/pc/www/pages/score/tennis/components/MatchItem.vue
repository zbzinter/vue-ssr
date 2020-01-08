<!-- 网球列表 -->
<template>
  <div
    v-if="match"
    ref="matchItem"
    class="match-list"
  >
    <table>
      <thead>
        <tr :class="[match.status == 2 ? 'going' : 'no-going']">
          <th
            colspan="4"
            class="league-name"
          >
            <tooltip
              v-if="isvisible"
              placement="top"
              :content="match.leagueName"
            >
              <span class="desc ellipsis"> {{ match.leagueName }} </span>
            </tooltip>
            <span
              v-else
              class="desc ellipsis"
            > {{ match.leagueName }} </span>
          </th>
          <th class="score">
            <span
              v-for="(item, index) in spanNum"
              :key="item.typeCode"
              :class="[periodClass(index)]"
            >
              <!-- {{ index+1 }} -->
            </span>
          </th>
          <th>全场</th>
          <th>总计</th>
          <th class="br">
            欧指
          </th>
          <th class="intelligence live">
            <div
              v-if="isvisible"
              class="live-link"
            >
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
                  class="iconfont icongd_dj"
                  @click="toLiveDetail(match.matchId)"
                />
              </Tooltip>
              <Tooltip
                v-else-if="match.lmtMode"
                content="动画"
                placement="top"
              >
                <i
                  class="iconfont icongc_dj"
                  @click="toLiveDetail(match.matchId)"
                />
              </Tooltip>
            </div>
            <div
              v-else
              class="live-link"
            >
              <span v-if="match.anchors && match.anchors.length">
                <img
                  v-for="(anchor, index) in match.anchors"
                  :key="index"
                  class="iconfont"
                  :src="anchor.anchorPic"
                  alt="主播"
                >
              </span>
              <i
                v-else-if="match.hasLive"
                class="iconfont icongd_dj"
              />
              <i
                v-else-if="match.lmtMode"
                class="iconfont icongc_dj"
              />
            </div>
            <Tooltip
              v-if="isvisible"
              :content="type === 'stick' ? '取消置顶' : '置顶'"
              placement="top"
              class="top"
            >
              <i
                class="iconfont"
                :class="type === 'stick' ? 'icongg_dj down' : 'iconge_dj1'"
                @click="handlerStick(match)" 
              />
            </Tooltip>
            <i
              v-else
              class="iconfont top ivu-tooltip"
              :class="type === 'stick' ? 'icongg_dj down' : 'iconge_dj1'"
            />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td
            rowspan="2"
            class="select double"
          >
            <div class="iblock">
              <Checkbox
                v-model="match.isChecked"
                :checked.sync="checked"
                @on-change="checkedHide($event, match)" 
              />
            </div>
          </td>
          <td
            rowspan="2"
            class="time double"
          >
            <span
              class="time"
            >
              {{ dayjs(match.matchTime).format('HH:mm') }}
            </span>
          </td>
          <td
            rowspan="2"
            class="cur-progress double"
          >
            {{ match.statusCode | statusCodeText }}
            <span
              v-if="isMatching"
              class="infinite"
            >'</span>
          </td>
          <td class="host-team bb">
            <div
              v-if="isvisible"
              style="display: inline-block"
            >
              <Tooltip
                v-if="isDouble(match.leagueName) && match.hostTeamName"
                class="double"
                :content="match.hostTeamName"
                placement="top"
              >
                <span class="name">{{ match.hostTeamName.split('/')[0] }}</span>
                <i>/</i>
                <span class="name">{{ match.hostTeamName.split('/')[1] }}</span>
              </Tooltip>
              <Tooltip
                v-else
                class="single"
                :content="match.hostTeamName"
                placement="top"
              >
                <span class="name">{{ match.hostTeamName }}</span>
              </Tooltip>
            </div>
            <!-- 占位 -->
            <div
              v-else
              style="display: inline-block"
            >
              <div
                v-if="isDouble(match.leagueName) && match.hostTeamName"
                class="double ivu-tooltip"
              >
                <span class="name">{{ match.hostTeamName.split('/')[0] }}</span>
                <i>/</i>
                <span class="name">{{ match.hostTeamName.split('/')[1] }}</span>
              </div>
              <div
                v-else
                class="single ivu-tooltip"
              >
                <span class="name">{{ match.hostTeamName }}</span>
              </div>
            </div>
            <div
              v-if="isMatching"
              class="right"
            >
              <img
                v-if="match.side === 1"
                src="../../../../assets/score/tennis/gh_dj@2x.png"
                alt="网球"
              >
              <span :class="{active: match.isChangeHostScore}">
                {{ match.gameScore && match.gameScore.split(':')[0] }}
              </span>
            </div>
          </td>
          <td class="bb br score">
            <span
              v-for="(item, index) in spanNum"
              :key="item.typeCode"
              :class="[periodClass(index, 'team1')]"
            >
              {{ sortPeriod[index] ? sortPeriod[index].team1 : '-' }}
            </span>
          </td>
          <td class="bb br all-filed">
            {{ allFiled.team1 }}
          </td>
          <td class="bb br diff">
            <div>差：{{ allFiled.diff }}</div>
          </td>
          <td class="bb br odds-num">
            <span :class="getColor(2, 1)">{{ setZhiShu(match, ['valueForType1', 'value0ForType1'], 'ouzhi') }}</span>
            <i
              class="iconfont"
              :class="getIconClass(2, 1)"
            />
          </td>
          <td class="analyze">
            <span @click="linkTo()">
              析
            </span>
          </td>
        </tr>
        <tr>
          <td class="guest-team">
            <div
              v-if="isvisible"
              style="display: inline-block"
            >
              <Tooltip
                v-if="isDouble(match.leagueName) && match.guestTeamName"
                class="double"
                :content="match.guestTeamName"
                placement="top"
              >
                <span class="name">{{ match.guestTeamName.split('/')[0] }}</span>
                <i>/</i>
                <span class="name">{{ match.guestTeamName.split('/')[1] }}</span>
              </Tooltip>
              <Tooltip
                v-else
                class="single"
                :content="match.guestTeamName"
                placement="top"
              >
                <span class="name">{{ match.guestTeamName }}</span>
              </Tooltip>
            </div>
            <!-- 占位 -->
            <div
              v-else
              style="display: inline-block"
            >
              <div
                v-if="isDouble(match.leagueName) && match.guestTeamName"
                class="double ivu-tooltip"
              >
                <span class="name">{{ match.guestTeamName.split('/')[0] }}</span>
                <i>/</i>
                <span class="name">{{ match.guestTeamName.split('/')[1] }}</span>
              </div>
              <div
                v-else
                class="single ivu-tooltip"
              >
                <span class="name">{{ match.guestTeamName }}</span>
              </div>
            </div>
            <div
              v-if="isMatching"
              class="right"
            >
              <img
                v-if="match.side === 2"
                src="../../../../assets/score/tennis/gh_dj@2x.png"
                alt="网球"
              >
              <span :class="{active: match.side === 2 && match.isChangeGuestScore}">
                {{ match.gameScore && match.gameScore.split(':')[1] }}
              </span>
            </div>
          </td>
          <td class="br score">
            <span
              v-for="(item, index) in spanNum"
              :key="item.typeCode"
              :class="[periodClass(index, 'team2')]"
            >
              {{ sortPeriod[index] ? sortPeriod[index].team2 : '-' }}
            </span>
          </td>
          <td class="br all-filed">
            {{ allFiled.team2 }}
          </td>
          <td class="br total">
            <div>总：{{ allFiled.total }}</div>
          </td>
          <td class="br odds-num">
            <span :class="getColor(2, 2)">{{ setZhiShu(match, ['valueForType2', 'value0ForType2'], 'ouzhi') }}</span>
            <i
              :class="[getIconClass(2, 2), 'iconfont']"
            />
          </td>
          <td class="odds">
            <span @click="linkTo()">指数</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { Tooltip, Checkbox } from 'iview'
export default {
  components: {
    Tooltip,
    Checkbox
  },
  props: [
    'match', 
    'type',
    'scrollTop'
  ],
  data () {
    return {
      checked: false,
      isvisible: false
    }
  },
  computed: {
    sortPeriod(){
      if(!this.match.period) return {}
      let arr = []
      for (const [index, item] of Object.entries(this.match.period)) {
        switch(index) {
        case 'Period1': arr[0] = item; break
        case 'Period2': arr[1] = item; break
        case 'Period3': arr[2] = item; break
        case 'Period4': arr[3] = item; break
        case 'Period5': arr[4] = item; break
        }
      }
      if(this.isMatching) {
        arr.push(this.match.period.Current)
      }
      return arr
    },
    spanNum(){
      return this.sortPeriod.length<=3 ? 3 : 5
    },
    isMatching(){
      let {type, isAbnormalMatch, match}=this
      return type==='going' || (type==='stick' && !isAbnormalMatch && match.status === 2)
    },
    isAbnormalMatch(){
      let reg = /^(40|41|42|43|44)$/
      return reg.test(this.match.statusCode)
    },
    allFiled(){
      if(!this.match.period) return {}
      let {match} = this
      let team1 = 0
      let team2 = 0
      let team1Score = 0
      let team2Score = 0
      for (const [index, item] of Object.entries(this.sortPeriod)) {
        if(index !== 'Current') {
          if(item.team1 > item.team2) team1 += 1
          if(item.team2 > item.team1) team2 += 1
        }
        team1Score += item.team1
        team2Score += item.team2
      }
      return {
        team1,
        team2,
        diff: team1Score - team2Score,
        total: team1Score + team2Score,
      }
    }
  },
  watch: {
    scrollTop(){
      this.excuteScroll()
    }
  },
  created () {

  },
  mounted () {
    if(this.match && Array.isArray(this.match.anchors)){
      this.match.anchors = this.match.anchors.slice(0, 3)
    }
    this.excuteScroll()
  },
  methods: {
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
    dealTime(param) {
      if (param) {
        if (param !== 0 ) {
          return this.dayjs(Math.abs(param)*1000).format('mm:ss')
        } 
        if (param === 0) {
          return '00:00'
        }
      }
      return '00:00'
    },
    isDouble(name){
      return /\(双打\)/.test(name)
    },
    checkedHide (isCheck, match) {
      this.$set(match, 'isChecked', isCheck)
      this.$emit('tempHide', isCheck, match.matchId)
    },
    periodClass(index, team){
      let {match, sortPeriod} = this
      let num = this.spanNum === 3 ? 'three' : 'five'
      let periodArr = sortPeriod[index]
      let current = (team && periodArr && periodArr.typeCode === 'Current' && this.isMatching) ? 'current' : ''
      let join = [num, current]
      if(periodArr && periodArr.typeCode !== 'Current') {
        if(team === 'team1' && (periodArr.team1 - periodArr.team2>0)){
          join.push('win')
        }
        if(team === 'team2' && (periodArr.team2 - periodArr.team1>0)){
          join.push('win')
        }
      }
      return join
    },
    linkTo(){
      this.$tip('敬请期待')
    },
    handlerStick () {
      if (this.type === 'stick') {
        this.bus.$emit('stickDel', this.match)
      } else {
        this.bus.$emit('stickAdd', this.match)
      }
    },
    getIconClass (attr, end) {
      return this.match.odds && this.match.odds[attr] ? this.match.odds[attr]['status' + end] : ''
    },
    getColor (attr, end) {
      if (this.match.odds && this.match.odds[attr] && this.match.odds[attr]['status' + end]) {
        if (this.match.odds[attr]['status' + end] === 'iconca_ei') {
          return 'c-red'
        } else {
          return 'c-green'
        }
      }
      return ''
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
          return (item.odds['128'] && item.odds['128'][key[0]])// || (item.odds['3'] ? (item.odds['3'][key[0]] || item.odds['3'][key[1]]) : '')
        } else if(status == 3) { // 初盘
          return item.odds['2'] ? (item.odds['2'][key[0]] || item.odds['2'][key[1]]) : ''
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
$borderColor: #EAEAEA;
@import './../../../../public/checkbox.scss';
.bb{
  border-bottom: 1px solid $borderColor;
}
.br{
  border-right: 1px solid $borderColor;
}
.icongc_dj {
  font-size: 24px;
  color: #168058;
  line-height: 0;
  vertical-align: middle;
}
.icongd_dj {
  font-size: 24px;
  color: #e15756;
  line-height: 0;
  vertical-align: middle;
  &:hover {
    color: #E80300;
  }
}
i{
  font-style: normal;
}
/deep/ .ivu-tooltip-inner{
  max-width: none;
}
.match-list{
  min-height: 124px;
  table{
    background: #FFFFFF;
    box-shadow: 0 1px 10px 0 rgba(0,0,0,0.04);
    width: 100%;
    th,td{
      height: 40px;
      line-height: 40px;
      vertical-align: middle;
      &.score{
        width: 220px;
        box-sizing: content-box;
        span{
          display: inline-block;
          width: 16px;
          &:first-child{
            margin-left: 26px;
          }
          &:last-child{
            margin-right: 26px;
          }
          &.three:not(:last-child){
            margin-right: 60px;
          }
          &.five:not(:last-child){
            margin-right: 22px;
          }
          &.win{
            font-weight: 600;
          }
          &.current{
            color: $red
          }
        }
      }
      &.odds, &.odds-num{
        width: 90px;
      }
    }
    thead{
      border-bottom: 1px solid $borderColor;
      tr{
        &.going{
          background: url('../../../../assets/score/tennis/flag_red.png') no-repeat 0 center/contain;
        }
        &.no-going{
          background: url('../../../../assets/score/tennis/flag_blue.png') no-repeat 0 center/contain;
        }
      }
      th{
        font-weight: normal;
        color: #999;
        font-size: 12px;
        &.league-name{
          color: #666;    
          font-size: 13px;
          text-align: left;
          padding-left: 16px;   
          span:hover{
            color: $blue;
          }
        }
        &.intelligence{
          width: 120px;
          position: relative;
          .top{
            position: absolute;
            right: 0;
            top: 0;
            padding-right: 10px;
            cursor: pointer;
            i.iconfont{
              height: 40px;
              vertical-align: top;
            }
          }
          .live-link{
            position: relative;
            left: 10px;
            transform: translateX(-50%);
            box-sizing: border-box;
            text-align: right;
            .iconfont{
              cursor: pointer;
            }
            img{
              width: 24px;
              height: 24px;
              &:not(:last-child){
                position: relative;
                left: 5px;
              }
            }
          }
        }
      }
    }
    tbody{
      td{
        font-family: PingFangSC-Regular;
        text-align: center;
        font-size: 12px;
        &.score{
          font-size: 12px;
          color: #333333;
          letter-spacing: 0;
          text-align: center;
        }
        &.double{
          vertical-align: middle;
          text-align: center;
          font-size: 14px;
          @extend .br;
        &.select{
          width: 50px;
          text-align: center;
          /deep/ .ivu-checkbox-wrapper{
            margin-right: 0;
          }
        }
        &.time{
          font-size: 14px;
          color: #333333;
          width: 70px;
        }
        &.cur-progress{
          width: 72px;
          font-size: 14px;
          color: #E15756;
          letter-spacing: 0;
          letter-spacing: 0px;
          .infinite{
            margin-left: -3px;
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
        }
        &.host-team, &.guest-team{
          width: 410px;
          font-size: 14px;
          color: #333333;
          font-weight: 600;
          text-align: left;
          padding-left: 12px;
          @extend .br;
          i{
            display: inline-block;
          }
          .name{
            height: 40px;
            &:hover{
              color: $blue;
            }
          }
          .duble .name{
            @include ellipsis(140px);
            vertical-align: middle;
          }
          .single .name{
            @include ellipsis(280px);
            vertical-align: middle;
          }
          .right{
            float: right;
            img{
              width: 13.5px;
              height: 13.5px;
            }
            span{
              font-family: PingFangSC-Regular;
              font-size: 12px;
              color: #9AC507;
              letter-spacing: 0;
              text-align: center;
              font-weight: normal;
              margin-right: 20px;
              margin-left: 9px;
              display: inline-block;
              width: 20px;
              height: 20px;
              line-height: 20px;
              vertical-align: middle;
              &.active{
                background: rgba(154,197,7,0.15);
              }
            }
          }
        }
        &.all-filed{
          font-family: PingFangSC-Semibold;
          font-size: 13px;
          color: #E15756;
          letter-spacing: 0;
          text-align: center;
          font-weight: 600;
        }
        &.diff, &.total{
          color: #333;
        }
        &.analyze{
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: #E13F3D;
          letter-spacing: 0;
          text-align: center; 
          span{
            position: relative;
            top: 10px;
            cursor: pointer;
            &:hover{
              text-decoration: underline;
            }
          }
        }
        &.odds-num{
          font-weight: 600;
          font-family: PingFangSC-Medium;
          font-size: 12px;
          color: #333333;
          letter-spacing: 0;
          text-align: center;
          background: #FCFCFC
        }
        &.odds{
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #333333;
          letter-spacing: 0;
          text-align: center;
          span{
            position: relative;
            top: -10px;
            cursor: pointer;
            &:hover{
              color: $blue
            }
          }
        }
      }
    }
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
</style>
