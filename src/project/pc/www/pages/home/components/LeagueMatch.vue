<template>
  <div class="league-match">
    <ul class="tabs-header">
      <li>
        <p>
          <a
            :class="{'active': typeId === 1}"
            @click="checkedTypeId(1)"
          >足球</a>
        </p>
      </li>
      <li>
        <p>
          <a
            :class="{'active': typeId === 2}"
            @click="checkedTypeId(2)"
          >篮球</a>
        </p>
      </li>
    </ul>
    <!-- <div class="search">
      <span class="iconah_df" />
      <input
        type="search"
        placeholder="搜索"
      >
    </div> -->
    <LoadingBox :status="fetchStatus">
      <ul class="league-list">
        <li
          v-for="item in leagueList"
          :key="item.id"
          :style="{backgroundImage: `url(${item.logoUrl})`}"
        >
          <a
            :href=" `/database/football?id=${item.id}&type=${item.type}&seasonId=${item.seasonId}`"
            target="_blank"
          >{{ item.cnAlias }}</a>
        </li>
      </ul>
    </LoadingBox>
  </div>
</template>
<script>
import LoadingBox from '../../../components/LoadingBox'
export default {
  components: {
    LoadingBox
  },
  data() {
    return {
      // 比赛类型 1，足球，2篮球
      typeId: 1,

      // 0 加载中，1 加载成功，2 无数据， 其他 不显示内容
      fetchStatus: -1,

      // 联赛列表
      leagueList: []
    }
  },
  mounted() {
    this.getLeagueAndCountry()
  },
  methods: {
    checkedTypeId(id) {
      let { typeId } = this
      if (typeId !== id) {
        this.typeId = id
        this.getLeagueAndCountry()
      }
    },
    getLeagueAndCountry() {
      let { typeId } = this
      this.fetchStatus = 0
      this.$get('v4/league/getLeagueAndCountry', {
        typeId
      }).then(res => {
        if (res.data) {
          let { leagueList = [] } = res.data
          this.leagueList = leagueList
          if (leagueList.length > 0) {
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
.league-match{
  padding: 10px 0 22px 0;
  .tabs-header{
    padding-left: 18px;
  }
}
.league-list {
  padding: 0 11px;
  font-size: 14px;
  color: #333333;
  li {
    margin: 10px 0 0 14px;
    height: 32px;
    line-height: 32px;
    padding-left: 44px;
    box-sizing: border-box;
    background-repeat: no-repeat;
    background-position: left center;
    background-size: 24px auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.search {
  margin-top: 18px;
  padding: 0 8px;
  position: relative;
  .iconah_df {
    font-family: 'iconfont';
    position: absolute;
    left: 24px;
    top: 50%;
    margin-top: -9px;
    font-size: 16px;
    color: #999999;
  }
  input {
    display: block;
    width: 100%;
    background: #fafafa;
    border: 1px solid #f1f1f1;
    border-radius: 20px;
    margin: 0;
    padding: 0 0 0 38px;
    box-sizing: border-box;
    height: 40px;
    -webkit-appearance: none;
  }
}

.tabs-header {
  border-bottom: solid 1px #f1f1f1;
  font-size: 14px;
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
      &:hover{
        color: #3683ff;
      }
    }
  }
}
</style>
