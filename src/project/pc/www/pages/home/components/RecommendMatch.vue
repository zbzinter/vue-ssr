<template>
  <div class="recommend-match" v-if="matchData.length > 0">
    <!-- 上一页 -->
    <div class="prev" @click="getPrevMatch">
      <img class="default" src="../../../assets/home/fm_da.svg">
      <img class="active" src="../../../assets/home/fn_dg.svg">
    </div>
    <!-- 列表 -->
    <div class="recommend-match-list">
      <div class="match-list-wrapper" :style="transformObj">
        <div class="match-item" v-for="match in matchList" :key="match.matchId" @click="goMatchDetail(match)">
          <div class="item-top">
            <span class="league-name">{{ match.leagueName }}</span>
            <span v-if="match.status === 2" class="match-status live">
              <span class="dot">·</span>&nbsp;&nbsp;直播中
            </span>
            <span v-else class="match-status" :class="{'uncoming': match.status === 1}">{{ match | statusTextFilter }}</span>
          </div>
          <div class="match-team">
            <div class="team-logo">
              <DefaultImg :src="match.hostTeamLogo" :defaultUrl="match.sportId | defaultImgFilter" />
              <DefaultImg :src="match.guestTeamLogo" />
            </div>
            <div class="team-name">
              <span>{{ match.hostTeamName }}</span>
              <span>{{ match.guestTeamName }}</span>
            </div>
            <div class="score" :class="{'finished': match.status === 3, 'going': match.status === 2}">
              <span>{{ match | scoreTextFilter(true) }}</span>
              <span>{{ match | scoreTextFilter }}</span>
            </div>
          </div>
        </div>
      </div>
      
    </div>
    <!-- 下一页 -->
    <div class="next" @click="getNextMatch">
      <img class="default" src="../../../assets/home/fm_da.svg">
      <img class="active" src="../../../assets/home/fn_dg.svg">
    </div>
  </div>
</template>

<script>
import DefaultImg from '@src/components/DefaultImg'
import dayjs from 'dayjs'
import { defaultImg } from '@utils/utils'
export default {
  props: {
    matchData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      showIndex: 0,
      matchList:[]
    }
  },
  components: {
    DefaultImg
  },
  computed: {
    nextDisabled() {
      if (this.showIndex + 4 > this.matchList.length) {
        return true
      }
      return false
    },
    prevDisabled() {
      if (this.showIndex === 0) {
        return true
      }
      return false
    },
    transformObj() {
      const offset = 300 * this.showIndex
      const style = {
        transform: `translateX(-${offset}px)`
      }
      return style
    }
  },
  watch: {
    matchData(val, old) {
      this.matchList = val
    }
  },
  filters: {
    statusTextFilter(match) {
      if (match.status === 1) {
        const matchDate = dayjs(match.matchTime).format('YYYY-MM-DD')
        const today = dayjs(new Date()).format('YYYY-MM-DD')
        if (matchDate === today) {
          return `今天 ${dayjs(match.matchTime).format('HH:mm')}`
        }
        return `${dayjs(match.matchTime).format('MM月DD日 HH:mm')}`
      } else if (match.status === 3) {
        return '已结束'
      }
    },
    scoreTextFilter(match, isHost = false) {
      if (match.status === 1 || match.status === 4) {
        return '-'
      } else {
        return isHost ? match.hostTeamScore : match.guestTeamScore
      }
    },
    defaultImgFilter(sportId = 1) {
      const sportMapping = {
        '1': 'football',
        '2': 'basketball',
        '3': 'baseball',
        '5': 'tennis'
      }
      return defaultImg[sportMapping[sportId]]
    }
  },
  methods: {
    getPrevMatch() {
      if (this.prevDisabled) {
        return
      }
      const index = this.showIndex - 4
      this.showIndex = index < 0 ? 0 : index
    },
    getNextMatch() {
      if (this.nextDisabled) {
        return
      }
      const index = this.showIndex + 4
      this.showIndex = index > this.matchList.length - 4 ? this.matchList.length - 4 : index
    },
    goMatchDetail(item) { // 跳转比赛落地页
      const routeData = this.$router.resolve({
        path: '/live/detail',
        query: {
          id: item.matchId
        }
      })
      window.open(routeData.href, '_blank')
    }
  }
}
</script>

<style lang="postcss" scoped>
.recommend-match {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  .prev{
    width: 40px;
    height: 92px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-right: 10px;
    cursor: pointer;
    .default{
      display: inline;
    }
    .active{
      display: none;
      transform: rotate(180deg);
    }
    &:hover{
      .default{
        display: none;
      }
      .active{
        display: inline;
      }
    }
  }
  .next{
    width: 40px;
    height: 92px;
    display: flex;
    align-items: center;
    margin-left: 10px;
    cursor: pointer;
    .default{
      display: inline;
      transform: rotate(180deg);
    }
    .active{
      display: none;
    }
    &:hover{
      .default{
        display: none;
      }
      .active{
        display: inline;
      }
    }
  }
  .recommend-match-list{
    position: relative;
    width: 1200px;
    height: 93px;
    overflow: hidden;
    &:before{
      content: '';
      display: inline-block;
      position: absolute;
      width: 1px;
      top: 9px;
      bottom: 10px;
      left: 0;
      background-image: linear-gradient(180deg, rgba(217,217,217,0.20) 0%, #D9D9D9 50%, rgba(217,217,217,0.20) 100%);
    }
    .match-list-wrapper{
      white-space: nowrap;
      transition: transform 0.3s ease;
      .match-item{
        width: 300px;
        display: inline-block;
        position: relative;
        padding: 7px 17px 10px 16px;
        &:after{
          content: '';
          display: inline-block;
          position: absolute;
          width: 1px;
          top: 9px;
          bottom: 10px;
          right: 0;
          background-image: linear-gradient(180deg, rgba(217,217,217,0.20) 0%, #D9D9D9 50%, rgba(217,217,217,0.20) 100%);
        }
        &:hover{
          cursor: pointer;
        }
        .item-top{
          display: flex;
          justify-content: space-between;
          .league-name{
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #666666;
            line-height: 17px;
          }
          .match-status{
            font-family: PingFangSC-Medium;
            font-weight: 600;
            font-size: 12px;
            color: #999999;
            line-height: 17px;
          }
          .live{
            color: #FC8E3E;
            .dot{
              display: inline-block;
              transform: scale(1.3);
            }
          }
          .uncoming{
            font-family: PingFangSC-Regular;
            font-weight: normal;
          }
        }
        .match-team{
          margin-top: 9px;
          display:flex;
          align-items: center;
          .team-logo{
            img{
              width: 46px;
              height: 46px;
              &:last-child{
                margin-left: 6px;
              }
            }
          }
          .team-name{
            flex: 1;
            margin-left: 10px;
            display: flex;
            flex-direction: column;
            span{
              display: inline-block;
              width: 112px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              font-family: PingFangSC-Medium;
              font-size: 14px;
              font-weight: 600;
              color: #333333;
              line-height: 20px;
              &:last-child{
                margin-top: 6px;
              }
            }
          }
          .score{
            width: 26px;
            margin-left: 8px;
            padding: 6px 0 2px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            box-sizing: border-box;
            background: #00196D;
            border-radius: 5px;
            span{
              font-family: DINCondensed-Bold;
              font-size: 16px;
              font-weight: 600;
              color: #FFFFFF;
              line-height: 16px;
              &:last-child{
                margin-top: 10px;
              }
            }
          }
          .finished{
            background: #999999;
          }
          .going{
            background: #EE0739;
          }
        }
      }
    }
  }
}
</style>
