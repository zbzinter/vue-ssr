<template>
  <div class="ranking-list">
    <dl>
      <dt>
        <div class="team">
          排名/球队
        </div>
        <div>胜</div>
        <div>负</div>
        <div>胜率</div>
        <div>胜差</div>
      </dt>
      <dd
        v-for="(item, index) in data"
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
        <div>{{ item.winNum }}</div>
        <div>{{ item.loseNum }}</div>
        <div>{{ item.winRate }}</div>
        <div>{{ item.gameBehind }}</div>
      </dd>
    </dl>
    <NoData v-if="!data || !data.length" />
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
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
        font-size: 12px;
        float: left;
        vertical-align: middle;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 47px;
      }
      .team {
        width: 124px;
        text-align: left;
      }
    }
    dt {
      padding-left: 10px;
      background: #F2F2F2;
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
          text-align: center;
          font-weight: bold;
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