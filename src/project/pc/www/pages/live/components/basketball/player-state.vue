<template>
  <div class="player-state">
    <!-- 本场最佳 -->
    <div class="top-content">
      <div class="b-title">
        本场最佳
      </div>
      <!-- 球队 -->
      <div class="team">
        <div class="team-item goust">
          <span class="name">{{ matchData.guestTeamName }}</span>
          <DefaultImg
            class="img"
            :src="matchData.guestTeamLogo"
            :default-url="defaultImg.player"
            alt=""
          />
        </div>
        <div class="team-item host">
          <DefaultImg
            class="img"
            :src="matchData.hostTeamLogo"
            :default-url="defaultImg.player"
            alt=""
          />
          <span class="name">{{ matchData.hostTeamName }}</span>
        </div>
      </div>
      <!-- 列表 -->
      <div
        v-for="(item, index) in playerTopList"
        :key="index"
        class="list"
      >
        <div class="fl user">
          <DefaultImg
            :src="item.guestPic"
            alt=""
          />
          <p class="ellipsis">
            {{ item.guestName }}
          </p>
        </div>
        <div class="fl stat">
          <div class="pillar">
            <div class="pillar-item goust">
              <div
                class="inner"
                :style="{height: item.guestNum/(item.guestNum+item.hostNum)*100+'%'}"
              >
                <span>{{ item.guestNum }}</span>
              </div>
            </div>
            <div class="pillar-item host">
              <div
                class="inner"
                :style="{height: item.hostNum/(item.guestNum+item.hostNum)*100+'%'}"
              >
                <span>{{ item.hostNum }}</span>
              </div>
            </div>
          </div>
          <p class="title">
            {{ item.title }}
          </p>
        </div>
        <div class="fl user">
          <DefaultImg
            :src="item.hostPic"
            alt=""
          />
          <p class="ellipsis">
            {{ item.hostName }}
          </p>
        </div>
      </div>
    </div>
    <!-- 阵容 -->
    <div class="line-up-box">
      <LineUp :team-data="goustLineUp" />
      <LineUp
        :team-data="hostLineUp"
        type="blue"
      />
    </div>
  </div>
</template>
<script>
import DefaultImg from '@src/components/DefaultImg'
import LineUp from './line-up'
export default {
  components: {
    DefaultImg,
    LineUp,
  },
  props: {
    matchData: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      // 本场最佳列表
      playerTopList: [],
      // 客队阵容, 包含队名和logo
      goustLineUp: {},
      // 主队阵容, 包含队名和logo
      hostLineUp: {},
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getParams()

      // 阵容数据
      this.goustLineUp = {
        teamId: this.matchData.guestTeamId,
        teamName: this.matchData.guestTeamName,
        teamLogo: this.matchData.guestTeamLogo,
        data: []
      }
      this.hostLineUp = {
        teamId: this.matchData.hostTeamId,
        teamName: this.matchData.hostTeamName,
        teamLogo: this.matchData.hostTeamLogo,
        data: []
      }
      
      // 本场最佳
      this.$get('/v7/queryBasketballPlayerStat', {
        matchId: this.query.id
      }).then(res => {
        const { code, data={}} = res
        if (code === 200) {
          // 得分
          if(data.hostScrId) {
            this.playerTopList.push({
              title: '得分',
              guestName: data.guestScrName,
              guestPic: data.guestScrPic,
              guestNum: data.guestScr,
              hostName: data.hostScrName,
              hostPic: data.hostScrPic,
              hostNum: data.hostScr,
            })
          }
          // 助攻
          if(data.hostAssistId) {
            this.playerTopList.push({
              title: '助攻',
              guestName: data.guestAssistName,
              guestPic: data.guestAssistPic,
              guestNum: data.guestAssist,
              hostName: data.hostAssistName,
              hostPic: data.hostAssistPic,
              hostNum: data.hostAssist,
            })
          }
          // 篮板
          if(data.hostRbndId) {
            this.playerTopList.push({
              title: '篮板',
              guestName: data.guestRbndName,
              guestPic: data.guestRbndPic,
              guestNum: data.guestRbnd,
              hostName: data.hostRbndName,
              hostPic: data.hostRbndPic,
              hostNum: data.hostRbnd,
            })
          }
        }
      })

      // 阵容
      this.$get('/v9/info/match/player/stat/detail', {
        matchId: this.query.id,
        aggr: true
      }).then(res => {
        const { code, data={}} = res
        if (code === 200) {
          this.goustLineUp.data = data[this.goustLineUp.teamId].playerStats || []
          this.hostLineUp.data = data[this.hostLineUp.teamId].playerStats || []
        }
      })
    }
  }
}
</script>
<style lang="postcss" scoped>
.player-state {
  .top-content {
    padding: 20px 0;
    .b-title {
      font-size: 20px;
      color: #666666;
      padding-left: 30px;
    }
    .team {
      height: 40px;
      line-height: 40px;
      margin-top: 15px;
      .team-item {
        width: 430px;
        float: left;
        .img {
          width: 40px;
          height: 40px;
        }
        .name {
          margin: 0 24px;
          font-size: 16px;
        }
      }
      .goust {
        text-align: right;
        color: #E15756;
      }
      .host {
        float: right;
        color: #3683FF;
      }
    }
    .list {
      width: 492px;
      margin: 0 auto;
      margin-top: 50px;
      overflow: hidden;
      .user {
        width: 100px;
        text-align: center;
        img {
          width: 100px;
          height: 100px;
          border-radius: 100px;
          display: block;
        }
        p {
          font-size: 14px;
          line-height: 20px;
          margin-top: 12px;
          color: #333333;
        }
      }
      .stat {
        width: 84px;
        text-align: center;
        margin: 0 104px;
        .pillar {
          height: 100px;
          .pillar-item {
            width: 30px;
            height: 100px;
            float: left;
            position: relative;
            .inner {
              width: 100%;
              position: absolute;
              left: 0;
              bottom: 0;
              background: #3683FF;
              text-align: center;
              span {
                width: 100%;
                position: absolute;
                left: 0;
                color: #3683FF;
                bottom: 100%;
                padding-bottom: 8px;
              }
            }
          }
          .goust {
            margin-right: 24px;
            .inner {
              background: #E15756;
              span {
                color: #E15756;
              }
            }
          }
        }
        .title {
          font-size: 14px;
          line-height: 20px;
          margin-top: 12px;
          color: #333333;
        }
      }
    }
  }
  .line-up-box {
    padding-bottom: 50px;
  }
}
</style>