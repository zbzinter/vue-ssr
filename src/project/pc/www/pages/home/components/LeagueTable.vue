<template>
  <div class="league-table">
    <ul
      v-if="!hideTitle"
      class="tabs-header"
    >
      <li>
        <p>
          <a class="active">足球积分榜</a>
        </p>
      </li>
      <!-- <li>
        <p>
          <a>篮球积分榜</a>
        </p>
      </li> -->
    </ul>

    <ul class="league-nav clearfix">
      <li>
        <a
          :class="{active: seasonId === 88}"
          @click="setSeasonId(88)"
        >英超</a>
      </li>
      <li>
        <a
          :class="{active: seasonId === 2848}"
          @click="setSeasonId(2848)"
        >中超</a>
      </li>
      <li>
        <a
          :class="{active: seasonId === 38}"
          @click="setSeasonId(38)"
        >西甲</a>
      </li>
      <li>
        <a
          :class="{active: seasonId === 279}"
          @click="setSeasonId(279)"
        >德甲</a>
      </li>
      <li>
        <a
          :class="{active: seasonId === 261}"
          @click="setSeasonId(261)"
        >法甲</a>
      </li>
      <li>
        <a
          :class="{active: seasonId === 190}"
          @click="setSeasonId(190)"
        >意甲</a>
      </li>
    </ul>
    <div class="leagua-content">
      <ul class="leagua-headers">
        <li>排名</li>
        <li>球队</li>
        <li>胜/平/负</li>
        <li>积分</li>
      </ul>

      <LoadingBox :status="fetchStatus">
        <ul class="right-list-body">
          <li
            v-for="(item, index) in stats"
            :key="index"
          >
            <p class="number clearfix">
              <span class="fl number-index">{{ index + 1 }}</span>
            </p>
            <p class="team-name">
              {{ item.teamName }}
            </p>
            <p class="team-num">
              {{ item.winNum }}/{{ item.loseNum }}/{{ item.drawNum }}
            </p>
            <p>{{ item.score }}</p>
          </li>
        </ul>
      </LoadingBox>
    </div>
  </div>
</template>
<script>
import LoadingBox from '../../../components/LoadingBox'
export default {
  components: {
    LoadingBox
  },
  props: {
    hideTitle: {
      default: false,
      type: Boolean
    },
    stats:{
      default: ()=>[],
      type: Array
    },
    fetchStatus:{
      default:2,
      type:Number
    }
  },
  data() {
    return {
      // 联赛id
      seasonId: 88,
      // 0 加载中，1 加载成功，2 无数据， 其他 不显示内容
    }
  },
  mounted() {
    // this.getTeamRank()
  },
  methods: {
    setSeasonId(id) {
      let { seasonId } = this
      if (seasonId !== id) {
        this.seasonId = id
        this.getTeamRank()
      }
    },
    getTeamRank() {
      let { seasonId } = this
      this.$get('v4/league/teamRank', {
        seasonId
      }).then(res => {
        if (res.data) {
          let { stat } = res.data[0]
          this.stats = stat.filter((item, index) => index < 10)
          if (stat.length > 0) {
            this.fetchStatus = 1
          } else {
            this.fetchStatus = 2
          }
        } else {
          this.fetchStatus = 2
        }
      })
    }
  }
}
</script>
<style lang="postcss" scoped>
.league-table {
  border-radius: 4px;
}
.league-nav {
  padding: 8px 0 11px 14px;
  overflow: hidden;
  line-height: 20px;
  li {
    font-size: 14px;
    color: #666666;
    float: left;
    margin-right: 15px;
    &:last-child {
      margin: 0;
    }
    a {
      &.active {
        font-size: 14px;
        color: #3683ff;
      }
    }
  }
}

.leagua-content {
  padding: 0 8px 0 8px;
  .leagua-headers {
    overflow: hidden;
    background: #fafafa;
    border-radius: 16px;
    line-height: 34px;
    font-size: 12px;
    color: #999999;
    li{
      &:nth-child(2){
        text-indent: 2em;
      }
    }
  }
  .leagua-headers li,
  .right-list-body li p {
    float: left;
    &:nth-child(1) {
      width: 50px;
      text-align: center;
    }
    &:nth-child(2) {
      width: 110px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-right: 4px;
    }
    &:nth-child(4) {
      width: 32px;
      float: right;
      text-align: center;
    }
  }
  .right-list-body {
    font-size: 12px;
    color: #333333;
    line-height: 17px;
    li {
      overflow: hidden;
      padding: 12px 0;
      p {
        &:nth-child(1) {
          font-size: 18px;
        }
      }

      &:nth-child(1),
      &:nth-child(2),
      &:nth-child(3) {
        p {
          &:nth-child(1) {
            color: #3683ff;
          }
        }
      }
    }
  }
}

.tabs-header {
  border-bottom: solid 1px #f1f1f1;
  font-size: 14px;
  line-height: 22px;
  padding: 23px 0 0 14px;
  &::after {
    content: '';
    display: block;
    clear: both;
  }
  li {
    float: left;
    margin-right: 46px;
    color: #666666;
    &:last-child {
      marign: 0;
    }
    a {
      color: #666666;
      display: block;
      padding-bottom: 11px;
      &.active {
        font-size: 16px;
        color: #3683ff;
        border-bottom: solid 2px #3683ff;
        position: relative;
      }
      &:hover {
        color: #3683ff;
      }
    }
  }
}
.number-index {
  padding-left: 21px;
}
.team-name {
  padding-left: 25px;
}
.team-num {
  padding-left: 2px;
}
</style>
