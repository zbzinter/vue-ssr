<!-- 主播页导航 -->
<template>
  <div class="anchor-list">
    <!-- 空页面 -->
    <div
      v-if="!anchorData || !anchorData.length"
      class="no-data"
    >
      暂无内容
    </div>

    <!-- 列表数据    @click="goLive(item)" -->
    <ul v-else>
      <li
        v-for="(item, index) in anchorData"
        :key="index"
        :class="['nav']"
      >
        <DefaultImg
          class="img"
          :src="item.user_img"
        />
        <h2 class="ellipsis">
          {{ item.nickname }}
        </h2>
        <p class="ellipsis">
          关注 {{ item.fans || 0 }}
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
import DefaultImg from '@src/components/DefaultImg'
export default {
  components: {
    DefaultImg
  },
  props: {
    anchorData: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  methods: {
    goLive(item) {
      const routeData = this.$router.resolve({
        path: '/live/detail',
        query: {
          roomId: item.room_id
        }
      })
      window.open(routeData.href, '_blank')
    }
  }
}
</script>

<style scoped lang="scss">
.no-data {
  font-size: 16px;
  padding: 100px;
  text-align: center;
}
.anchor-list {
  padding-bottom: 50px;
  ul {
    overflow: hidden;
    li {
      width: 216px;
      height: 200px;
      float: left;
      padding-top: 26px;
      text-align: center;
      cursor: pointer;
      margin: 20px 0 0 20px;
      border: 1px solid #F0F0F0;
      .img {
        display: block;
        width: 100px;
        height: 100px;
        border-radius: 100px;
        margin: 0 auto;
      }
      h2 {
        font-size: 14px;
        color: #333333;
        line-height: 1;
        padding: 8px 10px;
      }
      p {
        font-size: 12px;
        color: #999999;
        padding: 0 10px;
      }
    }
  }
}

</style>
