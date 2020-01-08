<template>
  <div class="database-area">
    <div
      v-if="areaData.length"
      class="clearfix"
      style="padding-bottom: 40px;"
    >
      <div
        v-for="item in areaData"
        :key="item.sectionId"
        class="area fl"
      >
        <p>
          {{ item.sectionId | returnAreaText }}
        </p>
        <ul>
          <li
            v-for="e in item.teams"
            :key="e.teamId"
            class="area-item clearfix"
          >
            <img
              :src="e.logoUrl"
              alt=""
              class="logo fl"
            >
            <div class="iblock pl fl">
              <span
                class="name"
                @click="handleClick(1, e.teamId, e.teamName)"
              >{{ e.teamName }}</span>
              <span
                class="desc"
                @click="handleClick(1, e.teamId, e.teamName)"
              >数据</span> |
              <span
                class="desc"
                @click="handleClick(2, e.teamId, e.teamName)"
              >赛程</span> |
              <span
                class="desc"
                @click="handleClick(3, e.teamId, e.teamName)"
              >阵容</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div
      v-else
      class="nodata"
    >
      暂无数据
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  props: {
    areaData: {
      default: () => [],
      type: Array
    }
  },
  computed: {
    ...mapGetters(['ballType', 'homeAndTeam'])
  },
  methods: {
    handleClick(index, id, name) {
      const routerData = this.$router.resolve({
        path: '/database/info',
        query: {
          id,
          index,
          type: this.ballType,
          key: this.homeAndTeam,
          name
        }
      })
      window.open(routerData.href, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
.database-area {
  width: 1200px;
  padding-left: 40px;
}

.area {
  background: #fff;
  border: 1px solid #eaeaea;
  width: 340px;
  margin-top: 40px;
  margin-right: 50px;
  box-sizing: content-box;
  p {
    font-family: PingFangSC-Medium;
    font-weight: 700;
    font-size: 16px;
    height: 40px;
    line-height: 40px;
    color: #333333;
    text-align: center;
    background: #f7f7f7;
  }
  li {
    border-top: 1px solid #eee;
    padding:12px 9px;
    margin: 0 15px;
    img {
      display: inline-block;
      width: 36px;
      height: 36px;
      margin-top: 5px;
    }
  }
  
  &-item:first-child {
    border-top: none;
  }

  .pl {
    padding-left: 34px;
  }

  .name {
    font-size: 14px;
    color: #333333;
    font-weight: 600;
    padding-bottom: 2px;
    text-align: left;
    display: block;
    cursor: pointer;
    user-select: none;
    &:hover {
      color: #3683FF;
    }
  }
  .desc {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #666;
    text-align: center;
    display: inline-block;
    cursor: pointer;
    user-select: none;
    &:hover {
      color: #3683FF;
    }
  }
}
.area:nth-of-type(3n) {
  margin-right: 0
}
.nodata {
  text-align: center;
  height: 180px;
  line-height: 180px;
  font-size: 14px;
  color: #909399;
  width: 1200px;
  margin-left: -40px;
}

</style>
