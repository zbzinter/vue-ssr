<template>
  <div class="hot-live-list">
    <!-- 列表数据 -->
    <ul>
      <li
        v-for="(item, index) in god"
        :key="index"
        :class="['nav']"
        @click="goLive(item)"
      >
        <div
          class="picture"
          :style="{background: `#ddd url(${addImgSize((item.room_img || item.screenshot_url || defaultImg.liveList), 285 * 2, 220 * 2)}) no-repeat center center / cover`}"
        >
          <span
            v-if="item && item.dialectType && item.dialectType.name && item.dialectType.display === 1"
            class="tag"
          >{{ item.dialectType.name }}</span>
          <div class="play" />
        </div>
        <div class="desc">
          <default-img
            :src="addImgSize((item.anchor || {}).user_img, 120, 120)"
            class="text-img"
          />
          <div class="text">
            <p class="p1 ellipsis">
              {{ item.title }}
            </p>
            <p class="p2">
              <span class="name ellipsis">{{ (item.anchor || {}).nickname }}</span>
              <span class="num">
                <i class="iconfont iconfu_dj" />
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
export default {
  props: {
    god: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      listData: []
    }
  },
  created() {
  },
  methods: {
    goLive(item) {
      this.$router.openNewPage({
        path: '/live/detail',
        query: {
          id: item.match_id,
          roomId: item.anchor.room_id
        }
      })
    },
    addImgSize(url, w, h) {
      let _symbol = '?'
      if(!url) return ''
      if(url.indexOf('?') !== -1) {
        _symbol = '&'
      }
      return url + `${_symbol}x-oss-process=image/resize,m_mfit,h_${h},w_${w}`
    }
  }
}
</script>

<style lang="postcss" scoped>
  .hot-live-list {
    clear: both;
    ul{
      clear: both;
      li {
        cursor: pointer;
        float: left;
        width: 285px;
        margin: 30px 20px 0 0;
        &:nth-of-type(4n){
          margin-right: 0;
        }
      }
      .picture {
        text-align: center;
        position: relative;
        height: 160px;
        background: #dedede;
        border-radius: 2px;
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
          height: 160px;
          border-radius: 2px;
        }
        .play {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 160px;
          line-height: 160px;
          opacity: 0;
          transform: scale(2);
          transition: all 0.3s;
          background: rgba(0,0,0,0.3) url(../../../assets/home/home_ic_live_play@2x.png) no-repeat center center;
          background-size: 48px;
          border-radius: 2px;
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
          width: 46px;
          height: 46px;
          border-radius: 46px;
          margin-right: 12px;
        }
        .text{
          padding-top: 4px;
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
                  font-style: normal;
                  font-size: 12px;
                }
              }
            }
          }
        }
      }
    }

  }
</style>
