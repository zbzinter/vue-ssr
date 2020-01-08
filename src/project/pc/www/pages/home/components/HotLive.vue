<template>
  <div class="hot-live">
    <div class="inner">
      <!-- 标题 -->
      <div class="big-title">
        <h2 class="fl tit">
          热门直播
          <span class="live">LIVE</span>
        </h2>
        <div
          class="fr more"
          @click="more"
        >
          更多 <i class="iconfont iconfs_dj1" />
        </div>
      </div>
      <!-- 内容 -->
      <HotLiveList
        v-if="god && god.length"
        :god="god"
      />
    </div>
  </div>
</template>

<script>
import HotLiveList from './HotLiveList'
export default {
  components: {
    HotLiveList
  },
  props: {
    god: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    more() {
      this.$router.openNewPage({
        path: '/live-list'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .hot-live {
    height: 620px;
    background: #f9f9f9;
    .inner {
      width: 1200px;
      margin: 0 auto;
      padding-top: 40px;
      .big-title {
        height: 30px;
        line-height: 30px;
        overflow: hidden;
        .tit {
          font-size: 22px;
          color: #333;
          .live {
            font-size: 20px;
            color: #e3e3e3;
            margin-left: 10px;
          }
        }
        .more {
          cursor: pointer;
          line-height: 30px;
          color: #333;
          .iconfont {
            color: #3683FF;
          }
        }
        .more:hover{
          color: #3683ff;
        }
      }
    }
  }
</style>
