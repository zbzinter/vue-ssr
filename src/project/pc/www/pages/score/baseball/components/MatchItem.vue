<!-- 网球列表 -->
<template>
  <div
    v-if="match"
    class="match-list"
  >
    <table>
      <thead>
        <tr :class="[match.status == 2 ? 'going' : 'no-going']">
          <th
            colspan="3"
            class="league-name"
          >
            <tooltip
              class="league-name"
              placement="top"
              :content="match.leagueName"
            >
              <span class="desc"> {{ match.leagueName }} </span>
            </tooltip>
            <span
              class="status"
              :class="type === 'going' ? 'status-red': ''"
            >
              {{ match.statusCode | statusCodeText }}
            </span>
            <span
              v-if="isMatching"
              class="infinite"
            >'</span>
          </th>
          <th class="score br">
            <span
              v-for="(item, index) in 10"
              :key="item.typeCode"
              :class="[periodClass(index)]"
            >
              {{ index+1 === 10 ? '加' : index+1 }}
            </span>
            <span class="nine">总</span>
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
          <th class="intelligence live">
            <div class="live-link">
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
            <Tooltip
              content="置顶"
              placement="top"
              class="top"
            >
              <i
                class="iconfont"
                :class="type === 'stick' ? 'icongg_dj down' : 'iconge_dj1'"
                @click="handlerStick(match)" 
              />
            </Tooltip>
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
          <td class="guest-team bb">
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
              <default-img
                :src="match.guestTeamLogo"
                :default-url="defaultImg.baseball"
              />
              <span class="name">
                {{ match.guestTeamName }}
              </span>
            </Tooltip>
            <!-- <div class="right">
              <img
                v-if="match.side === 2"
                src="../../../../assets/score/tennis/gh_dj@2x.png"
                alt="棒球"
              >
              <span :class="{active: match.side === 2}">
                {{ match.gameScore && match.gameScore.split(':')[1] }}
              </span>
            </div> -->
          </td>
          <td class="br bb score">
            <div>
              <span
                v-for="(item, index) in 10"
                :key="item.typeCode"
                :class="[periodClass(index, 'team2')]"
              >
                {{ sortPeriod[index] ? sortPeriod[index].team2 : '' }}
              </span>
              <span class="nine">
                {{ allFiled.team2 }}
              </span>
            </div>
          </td>
          <td class="bb br pay">
            <span :class="getColor(2, 2)">{{ setZhiShu(match, ['valueForType2', 'value0ForType2'], 'ouzhi') }}</span>
            <i
              :class="[getIconClass(2, 2), 'iconfont']"
            />
          </td>
          <td class="bb br rang-score">
            <div>
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
            </div>
          </td>
          <td class="bb br big-small">
            <span class="big-small__first">{{ bigBall ? '小' + bigBall : '' }}</span>
            <span :class="getColor(3, 2)">
              {{ setZhiShu(match, ['valueForType2', 'value0ForType2'], 'dx') }}
              <i
                :class="[getIconClass(3, 2), 'iconfont']"
              />
            </span>
          </td>
          <td class="analyze">
            <span @click="linkTo()">
              析
            </span>
          </td>
        </tr>
        <tr>
          <td class="host-team bb">
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
              <default-img
                :src="match.hostTeamLogo"
                :default-url="defaultImg.baseball"
              />
              <span class="name">
                {{ match.hostTeamName }}
              </span>
            </Tooltip>
            <!-- <div class="right">
              <img
                v-if="match.side === 1"
                src="../../../../assets/score/tennis/gh_dj@2x.png"
                alt="棒球"
              >
              <span :class="{active: match.side === 1}">
                {{ match.gameScore && match.gameScore.split(':')[0] }}
              </span>
            </div> -->
          </td>
          <td class="bb br score">
            <span
              v-for="(item, index) in 10"
              :key="item.typeCode"
              :class="[periodClass(index, 'team1')]"
            >
              {{ sortPeriod[index] ? sortPeriod[index].team1 : '' }}
            </span>
            <span class="nine">
              {{ allFiled.team1 }}
            </span>
          </td>
          <td class="br bb pay">
            <span :class="getColor(2, 1)">{{ setZhiShu(match, ['valueForType1', 'value0ForType1'], 'ouzhi') }}</span>
            <i
              :class="[getIconClass(2, 1), 'iconfont']"
            />
          </td>
          <td class="br bb rang-score">
            <div>
              <span
                class="rang-score__first"
                :style="{visibility: concede < 0 ? 'visible' : 'hidden'}"
              >{{ -concede }}</span>
              <span
                :class="[getColor(1, 1), 'rang-score__second']"
              >
                {{ setZhiShu(match, ['valueForType1', 'value0ForType1'], 'yapan') }}
                <i
                  :class="[getIconClass(1, 1), 'iconfont']" 
                />
              </span>
            </div>
          </td>
          <td class="br bb big-small">
            <span class="big-small__first">{{ bigBall ? '大' + bigBall : '' }}</span>
            <span :class="getColor(3, 1)">
              {{ setZhiShu(match, ['valueForType1', 'value0ForType1'], 'dx') }}
              <i
                :class="[getIconClass(3, 1), 'iconfont']" 
              />
            </span>
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
    'type'
  ],
  data () {
    return {
      checked: false
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
        case 'Period6': arr[5] = item; break
        case 'Period7': arr[6] = item; break
        case 'Period8': arr[7] = item; break
        case 'Period9': arr[8] = item; break
        case 'Period10': arr[9] = item; break
        }
      }
      if(this.isMatching) {
        arr.push(this.match.period.Current)
      }
      return arr
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
      let team1 = 0
      let team2 = 0
      for (const [index, item] of Object.entries(this.sortPeriod)) {
        team1 += item.team1
        team2 += item.team2
      }
      return {
        team1,
        team2
      }
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

  },
  created () {

  },
  mounted () {
    if(this.match && Array.isArray(this.match.anchors)){
      this.match.anchors = this.match.anchors.slice(0, 3)
    }
  },
  methods: {
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
      let periodArr = sortPeriod[index]
      let current = (team && periodArr && periodArr.typeCode === 'Current' && this.isMatching) ? 'current' : ''
      let join = ['nine', current]
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
      } else if(type === 'ouzhi'){
        if (status == 1) { // 即时盘key[0] || 初盘key[1]
          return item.odds['2'] ? (item.odds['2'][key[0]] || item.odds['2'][key[1]]) : ''
        } else if(status == 2) { // 滚球 || 即时盘 || 初盘
          return (item.odds['128'] && item.odds['128'][key[0]]) // || (item.odds['2'] ? (item.odds['2'][key[0]] || item.odds['2'][key[1]]) : '')
        } else if(status == 3) { // 即时盘key[0]
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
  table{
    background: #FFFFFF;
    box-shadow: 0 1px 10px 0 rgba(0,0,0,0.04);
    width: 100%;
    tr{
      height: 40px;
    }
    th,td{
      &.score{
        width: 396px;
        box-sizing: content-box;
        span{
          min-height: 16px;
          width: 16px;
          vertical-align: bottom;
          float: left;
          &:first-child{
            margin-left: 20px;
          }
          &:last-child{
            margin-right: 20px;
          }
          &.nine:not(:last-child){
            margin-right: 18px;
          }
          &.win{
            font-weight: 600;
          }
          &.current{
            color: $red
          }
        }
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
        vertical-align: middle;
        &.league-name{
          color: #666;    
          font-size: 13px;
          text-align: left;
          padding-left: 16px;
          .infinite{
            color: $red;
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
          /deep/ {
            &.desc {
              @include ellipsis(none, 160px);
              line-height: 13px;
              vertical-align: middle;
              margin-right: 20px;
              &:hover{
                color: $blue;
              }
            }
            &.status{
              line-height: 13px;
              vertical-align: middle;
              color: $red;
            }
          }
        }
        &.intelligence{
          width: 120px;
          position: relative;
          .top{
            position: absolute;
            right: 0;
            top: 49%;
            transform: translateY(-50%);
            padding-right: 10px;
            cursor: pointer;
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
        border-collapse: separate;
        &.score{
          font-size: 12px;
          color: #333333;
          letter-spacing: 0;
          text-align: center;
          vertical-align: middle;
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
        }
        &.host-team, &.guest-team{
          font-size: 14px;
          color: #333333;
          font-weight: 600;
          text-align: left;
          padding-left: 12px;
          vertical-align: middle;
          @extend .br;
          img{
            width: 24px;
          }
          i{
            display: inline-block;
          }
          .name{
            // height: 40px;
            vertical-align: middle;
            &:hover{
              color: $blue;
            }
          }
          .duble .name{
            @include ellipsis(140px);
            vertical-align: middle;
          }
          .single .name{
            @include ellipsis(auto, 170px);
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
              padding: 1px 3px;
              font-weight: normal;
              margin-right: 20px;
              margin-left: 9px;
              &.active{
                background: rgba(154,197,7,0.15);
              }
            }
          }
        }
        &.pay, &.rang-score, &.big-small{
            font-weight: 600;
            font-family: PingFangSC-Medium;
            font-size: 12px;
            color: #333333;
            letter-spacing: 0;
            text-align: center;
            background: #FCFCFC;
            vertical-align: middle;
          &.pay{
            width: 90px;
          }
           &.rang-score{
             width: 130px;
             span{
               float: left;
               width: 50%;
               text-align: center;
             }
            .rang-score__first {
              color: #E4742F;
            }
           }
           &.big-small{
             width: 130px;
             span{
               float: left;
               width: 50%;
               text-align: center;
             }
             .big-small__first{
               color: #F48F51;
             }
           }
        }
        &.analyze{
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: #E13F3D;
          letter-spacing: 0;
          text-align: center; 
          vertical-align: middle;
          span{
            position: relative;
            top: 10px;
            cursor: pointer;
            &:hover{
              text-decoration: underline;
            }
          }
        }
        &.odds{
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #333333;
          letter-spacing: 0;
          text-align: center;
          vertical-align: middle;
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
    line-height: 0;
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
