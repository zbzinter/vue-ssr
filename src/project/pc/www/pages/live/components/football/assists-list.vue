<template>
  <div class="ranking-list">
    <dl>
      <dt>
        <div class="team">
          排名/球员
        </div>
        <div>球队</div>
        <div>助攻</div>
      </dt>
      <dd
        v-for="(item, index) in shooterRank"
        :key="index"
      >
        <div class="team">
          <span class="sub num">{{ index + 1 }}</span>
          <img
            class="sub logo"
            :src="item.playerLogo"
            alt=""
          >
          <span class="sub name">{{ item.playerName }}</span>
        </div>
        <div>{{ item.teamName }}</div>
        <div>{{ item.goals }}</div>
      </dd>
    </dl>
    <NoData v-if="!shooterRank || !shooterRank.length" />
  </div>
</template>
<script>
export default {
  props: ['seasonId'],
  data() {
    return {
    // 助攻榜
      shooterRank: []
    }
  },
  created() {
    this.getShooterRank()
  },
  methods: {
    // 助攻榜
    getShooterRank() {
      this.$get('v5/player/shooterRank', {
        seasonId: this.seasonId,
        page: 1,
        limit: 30,
        statType: 25
      }).then(res => {
        if(res.data) {
          this.shooterRank = res.data.players || []
        }
      })
    },
  }
}
</script>
<style lang="postcss" scoped>
.ranking-list {
  dl {
    dt,dd {
      width: 100%;
      height: 40px;
      line-height: 40px;
      overflow: hidden;
      &>div {
        float: left;
        font-size: 12px;
        vertical-align: middle;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        &:nth-child(2) {
          width: 100px;
        }
        &:nth-child(3) {
          width: 60px;
        }
      }
      .team {
        width: 160px;
        text-align: left;
      }
    }
    dt {
      background: #F2F2F2;
      .team {
        padding-left: 10px;
      }
    }
    dd {
      border-top: 1px solid #f1f1f1;
      transition: all 0.3s;
      &:hover {
        background: #f8f8f8;
      }
      .team {
        width: 160px;
        vertical-align: middle;
        .sub {
          float: left;
        }
        .num {
          width: 32px;
          text-align: center;
          font-weight: bold;
        }
        .logo {
          height: 18px;
          margin-right: 4px;
          margin-top: 11px;
        }
        .name {
          width: 100px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>