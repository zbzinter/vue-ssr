<template>
  <div>
    <Dropped
      v-if="isDropped"
      :type="1"
    />
    <div
      v-else
      class="not-started"
    >
      <div class="big-title">
        精彩直播，看不停～～
      </div>
      <ul>
        <li
          v-for="(item, index) in listData"
          :key="index"
          :class="['nav']"
          @click="goLive(item)"
        >
          <div
            class="picture"
            :style="{background: `#ddd url(${item.room_img || item.screenshot_url || defaultImg.liveList}) no-repeat center center / cover`}"
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
  </div>
</template>
<script>
import Dropped from './dropped'
export default {
  components: {
    Dropped
  },
  data() {
    return {
      listData: [],
      isDropped: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      // 请求推荐列表
      this.$get('v0.4/rooms/proposal', {
        apiType: 'anchor',
        body: {
          match_id: this.$route.query.id || 0,
          room_id: this.$route.query.roomId || '',
          page: 1,
          size: 2
        },
      }).then(res => {
        const {code, data} = res
        if(code === 200) {
          this.listData = (data || {}).rows || []
          if(this.listData.length === 0){
            this.isDropped = true
          }
        }
      })
    },
    goLive(item) {
      const _url = location.origin + location.pathname + `?id=${(item.match_id || 0)}&roomId=${item.anchor.room_id}`
      window.location.href = _url
    }
  }
}
</script>
<style lang="postcss" scoped>
.not-started {
  width: 100%;
  height: 100%;
  z-index: 3;
  background: #000;
  position: absolute;
  left: 0;
  top: 0;
  padding-top: 120px;
  .big-title {
    text-align: center;
    font-size: 18px;
    color: #CCCCCC;
  }
  ul {
    padding-top: 60px;
    text-align: center;
  }
  li{
    cursor: pointer;
    display: inline-block;
    width: 220px;
    text-align: left;
    margin: 30px 15px 0 30px;
    &:nth-of-type(4n){
      margin-right: 0;
    }
  }
  .picture{
    text-align: center;
    position: relative;
    height: 120px;
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
      height: 120px;
      border-radius: 4px;
    }
    .play {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      line-height: 120px;
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
      width: 34px;
      height: 34px;
      border-radius: 34px;
      margin-right: 12px;
    }
    .text{
      .p1{
        font-family: PingFangSC-Semibold;
        font-size: 12px;
        color: #fff;
        height: 16px;
        letter-spacing: 0;
      }
      .p2{
        span{
          max-width: 50%;
          font-size: 12px;
          color: #F0F0F0;
          display: inline-block;
          &.num{
            float: right;
            i, img{
              display: inline-block;
              vertical-align: middle;
              font-style: normal;
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
