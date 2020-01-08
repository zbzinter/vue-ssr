<!-- 主播页导航 -->
<template>
  <div class="anchor-item">
    <!-- 空页面 -->
    <div
      v-if="!listData || !listData.length"
      class="no-data"
    >
      暂无内容
    </div>

    <!-- 列表数据 -->
    <ul v-else>
      <li
        v-for="(item, index) in listData"
        :key="index"
        :class="['nav']"
        @click="goLive(item)"
      >
        <div
          class="picture"
          :style="{background: `#ddd url(${(item.room_img || item.screenshot_url || defaultImg.liveList)}) no-repeat center center / cover`}"
        >
          <span
            v-if="item && item.dialectType && item.dialectType.name && item.dialectType.display === 1"
            class="tag"
          >{{ item.dialectType.name }}</span>
          <div class="play">
            <svg
              class="svg-icon"
              aria-hidden="true"
            >
              <use xlink:href="#iconet_gj" />
            </svg>
          </div>
        </div>
        <div class="desc">
          <default-img
            :src="(item.anchor || {}).user_img"
            class="text-img"
          />
          <div class="text">
            <p class="p1 ellipsis">
              {{ item.title }}
            </p>
            <p class="p2">
              <span class="name ellipsis">{{ (item.anchor || {}).nickname }}</span>
              <span class="num">
                <i class="iconfont iconcc_ee" />
                <i>{{ item.heat }}</i>
              </span>
            </p>
          </div>
        </div>
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
    listData: {
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
          id: item.match_id,
          roomId: item.anchor.room_id
        }
      })
      window.open(routeData.href, '_blank')
    }
  }
}
</script>

<style scoped lang="scss">
$blue:#3683FF;
i{
  font-style: normal
}
.no-data {
  font-size: 16px;
  padding: 100px;
  text-align: center;
}
.anchor-item{
  padding-bottom: 50px;
  overflow: hidden;
  li{
    cursor: pointer;
    float: left;
    width: 250px;
    margin: 30px 15px 0 30px;
    &:nth-of-type(4n){
      margin-right: 0;
    }
  }
  .picture{
    text-align: center;
    position: relative;
    height: 140px;
    background: #dedede;
    border-radius: 4px;
    overflow: hidden;
    &:hover {
      .play {
        opacity: 1;
        transform: scale(1);
      }
    }
    .list-img{
      display: block;
      margin: 0 auto;
      height: 140px;
      border-radius: 4px;
    }
    .play {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      line-height: 140px;
      opacity: 0;
      transform: scale(2);
      transition: all 0.3s;
      background: rgba(0,0,0,0.3);
      .svg-icon {
        font-size: 38px;
        vertical-align: middle;
      }
    }
    .tag {
      position: absolute;
      right: 6px;
      top: 6px;
      font-size: 12px;
      padding: 4px 10px;
      line-height: 1;
      color: #FFFFFF;
      border-radius: 18px;
      background: rgba(0,0,0,0.6);
    }
  }
  .desc{
    margin-top: 10px;
    height: 50px;
    .text-img{
      float: left;
      width: 38px;
      height: 38px;
      border-radius: 38px;
      margin-right: 12px;
    }
    .text{
      .p1{
        font-family: PingFangSC-Semibold;
        font-size: 14px;
        color: #333333;
        height: 22px;
        letter-spacing: 0;
      }
      .p2{
        span{
          max-width: 50%;
          font-size: 12px;
          color: #666666;
          display: inline-block;
          &.num{
            float: right;
            i, img{
              display: inline-block;
              vertical-align: middle;
            }
            img{
              height: 14px;
            }
          }
        }
      }
    }
  }
}

</style>
