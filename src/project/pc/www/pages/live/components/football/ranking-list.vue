<template>
  <div class="ranking-list">
    <NoData v-if="!teamRankList || !teamRankList.length" />
    <div
      v-for="(teamRank, listIndex) in teamRankList" 
      :key="listIndex"
      class="list"
    >
      <div
        v-if="teamRankList && teamRankList.length > 1"
        class="group"
      >
        {{ teamRank.groupName }}
      </div>
      <dl>
        <dt>
          <div class="team">
            排名/球队
          </div>
          <div>场</div>
          <div>胜/平/负</div>
          <div>进/失</div>
          <div>积分</div>
        </dt>
        <dd
          v-for="(item, index) in teamRank.stat"
          :key="index"
        >
          <div class="team">
            <span class="sub num">{{ index + 1 }}</span>
            <img
              class="sub logo"
              :src="item.teamLogo"
              alt=""
            >
            <span
              class="sub name"
              :title="item.teamName"
            >{{ item.teamName }}</span>
          </div>
          <div>{{ item.totalNum || '-' }}</div>
          <div>{{ item.winNum }}/{{ item.drawNum }}/{{ item.loseNum }}</div>
          <div>{{ item.goals }}/{{ item.loseGoals }}</div>
          <div>{{ item.score }}</div>
        </dd>
      </dl>
      <NoData v-if="!teamRank.stat || !teamRank.stat.length" />
    </div>
  </div>
</template>
<script>
export default {
  props: ['seasonId'],
  data() {
    return {
      // 积分榜
      teamRankList: []
    }
  },
  created() {
    this.getTeamRank()
  },
  methods: {
    // 积分榜
    getTeamRank() {
      this.$get('v4/league/teamRank', {
        seasonId: this.seasonId,
        page: 1,
        limit: 30,
      }).then(res => {
        if(res.data) {
          this.teamRankList = res.data || []
        }
      })
    },
  }
}
</script>
<style lang="postcss" scoped>
.ranking-list {
  .group {
    background: #f2f2f2;
    text-align: center;
    font-size: 14px;
    color: #333333;
    line-height: 1;
    padding-top: 10px;
  }
  dl {
    dt,dd {
      width: 100%;
      height: 40px;
      line-height: 40px;
      overflow: hidden;
      &>div {
        font-size: 12px;
        float: left;
        vertical-align: middle;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        &:nth-child(2) {
          width: 34px;
        }
        &:nth-child(3) {
          width: 70px;
        }
        &:nth-child(4) {
          width: 52px;
        }
        &:nth-child(5) {
          width: 34px;
        }
      }
      .team {
        width: 124px;
        text-align: left;
      }
    }
    dt {
      height: auto;
      line-height: 1;
      padding: 10px 0 10px 10px;
      background: #f2f2f2;
    }
    dd {
      border-top: 1px solid #f1f1f1;
      transition: all 0.3s;
      &:hover {
        background: #f8f8f8;
      }
      .team {
        width: 134px;
        vertical-align: middle;
        .sub {
          float: left;
        }
        .num {
          width: 32px;
          font-weight: bold;
          text-align: center;
        }
        .logo {
          height: 18px;
          margin-right: 4px;
          margin-top: 11px;
        }
        .name {
          width: 70px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>