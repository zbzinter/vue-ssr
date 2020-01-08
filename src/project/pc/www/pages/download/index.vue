<template>
  <div class="download-center" id="download-center">
    <div class="download-header">
      <img class="logo" src="../../assets/download-center/logo.svg" />
      <img
        v-if="activeIndex === 0 || activeIndex === 2"
        class="top-left-circle"
        src="../../assets/download-center/web_bg_circle01.svg"
      />
      <img class="top-right-circle" src="../../assets/download-center/web_bg_circle02.svg" />
      <div class="page-nav">
        <p class="current-page">下载中心</p>
        <p class="web-index" @click="goPath">球会首页</p>
      </div>
    </div>
    <div class="download-container" v-if="clientReady">
      <swiper :options="swiperOption" ref="mySwiper">
        <swiper-slide>
          <app-home @on-click-next="next" @click-download="downloadApp"></app-home>
        </swiper-slide>
        <swiper-slide>
          <app-score @on-click-next="next" @click-download="downloadApp"></app-score>
        </swiper-slide>
        <swiper-slide>
          <app-live @on-click-next="next" @click-download="downloadApp"></app-live>
        </swiper-slide>
        <swiper-slide>
          <app-community @click-download="downloadApp"></app-community>
        </swiper-slide>
      </swiper>
      <div class="swiper-pagination" slot="pagination"></div>
    </div>
  </div>
</template>
<script>
import AppHome from "./components/AppHome";
import AppScore from "./components/AppScore";
import AppLive from "./components/AppLive";
import AppCommunity from "./components/AppCommunity";
import { _debounce } from "@utils/common";
export default {
  components: {
    AppHome,
    AppScore,
    AppLive,
    AppCommunity
  },
  data() {
    return {
      clientReady: false,
      swiperOption: {
        speed: 500,
        direction: "vertical",
        pagination: {
          el: ".swiper-pagination",
          clickable: true //此参数设置为true时，点击分页器的指示点分页器会控制Swiper切换。
        },
        on: {
          slideChange: this.onSlideChange
        }
      },
      activeIndex: 0,
      iosUrl: "https://www.pgyer.com/xkGg",
      androidUrl: "https://www.pgyer.com/Ic7q",
      mouseWheelFunc: null,
      calcRationFunc: null
    };
  },
  mounted() {
    const { swiper, swiperSlide } = require("vue-awesome-swiper");
    this.$options.components.swiper = swiper;
    this.$options.components.swiperSlide = swiperSlide;
    this.clientReady = true;
    this.mouseWheelFunc = _debounce(this.handleMouseWheel, 100);
    document.addEventListener("mousewheel", this.mouseWheelFunc);
    // firefox不支持mousewheel事件
    document.addEventListener("DOMMouseScroll", this.mouseWheelFunc);
    this.calcRationFunc = _debounce(this.calcRatio, 100);
    window.addEventListener("resize", this.calcRationFunc, 300);
    this.calcRatio();
  },
  destroyed() {
    // 移除事件
    document.removeEventListener("mousewheel", this.mouseWheelFunc);
    document.removeEventListener("DOMMouseScroll", this.mouseWheelFunc);
    window.removeEventListener("resize", this.calcRationFunc);
  },
  methods: {
    goPath() {
      this.$router.push("/index");
    },
    prev() {
      this.$refs.mySwiper.swiper.slidePrev();
    },
    next() {
      this.$refs.mySwiper.swiper.slideNext();
    },
    handleMouseWheel(e) {
      let isDown;
      // FireFox没有wheelDelta属性，只有通过detail判断
      if (e.wheelDelta !== undefined) {
        isDown = e.wheelDelta < 0;
      } else {
        isDown = e.detail > 0;
      }
      if (isDown) {
        this.next();
      } else {
        this.prev();
      }
    },
    downloadApp(platform = "android") {
      if (platform === "ios") {
        window.open(this.iosUrl);
      } else {
        window.open(this.androidUrl);
      }
    },
    onSlideChange() {
      this.activeIndex = this.$refs.mySwiper.swiper.activeIndex;
    },
    calcRatio() {
      // 设计稿1920 x 1080
      const idealWidth = 1920,
        idealHeight = 1080;
      let actualWidth = document.documentElement.clientWidth;
      actualWidth = actualWidth < 1200 ? 1200 : actualWidth;
      let actualHeight = document.documentElement.clientHeight;
      actualHeight = actualHeight < 600 ? 600 : actualHeight;
      let ratio = 1;
      // 使用高度还是宽度计算比例
      if (actualHeight / actualWidth < idealHeight / idealWidth) {
        ratio = actualHeight / idealHeight;
      } else {
        ratio = actualWidth / idealWidth;
      }
      ratio = ratio > 1.25 ? 1.25 : ratio;
      const doms = document.querySelectorAll(".content-area");
      for (let i = 0; i < doms.length; i++) {
        doms[i].style.transform = `scale(${ratio})`;
      }
    }
  }
};
</script>
<style scoped lang="scss">
// @import './style/media.scss';
@mixin customTransition {
  opacity: 1;
  transform: translate(0, 0);
  transition: all 1s ease 0.3s;
}
@keyframes circle-animation-one {
  0% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(40%, 25%);
  }
  100% {
    transform: translate(0, 40%);
  }
}
@keyframes circle-animation-two {
  0% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(20%, -20%);
  }
  100% {
    transform: translate(0, -10%);
  }
}
@keyframes circle-animation-three {
  0% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(20%, 20%);
  }
  100% {
    transform: translate(0, 10%);
  }
}
.download-center {
  position: relative;
  background: #f7faff;
  overflow-x: hidden;
  .download-header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    padding: 63px 77px 0 92px;
    .logo {
      width: 202px;
      height: 59px;
    }
    .top-left-circle {
      position: absolute;
      top: 0;
      left: 0;
    }
    .top-right-circle {
      position: absolute;
      top: 0;
      right: 0;
      animation: circle-animation-two 8s linear infinite alternate;
    }
    .page-nav {
      float: right;
      position: relative;
      font-family: PingFangSC-Medium;
      font-weight: 600;
      font-size: 16px;
      .current-page {
        display: inline-block;
        color: #1b1f2c;
        &:after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 14px;
          top: 39px;
          width: 36px;
          height: 4px;
          background: #3683ff;
        }
      }
      .web-index {
        display: inline-block;
        margin-left: 76px;
        color: #4f566d;
        cursor: pointer;
      }
    }
  }
  .download-container {
    /deep/ {
      .swiper-wrapper {
        height: 100vh;
        box-sizing: border-box;
        .swiper-slide-active {
          .app-img-wrapper {
            @include customTransition;
          }
          .circle {
            @include customTransition;
          }
          .title {
            @include customTransition;
          }
          .copywriting {
            @include customTransition;
          }
          .qrcode-area {
            @include customTransition;
          }
          .footer-corner {
            @include customTransition;
          }
          .solid-middle-circle {
            animation: circle-animation-one 8s linear infinite alternate;
          }
        }
        .content-area {
          width: 1920px;
          height: 1080px;
          margin: auto;
          position: absolute;
          left: -100%;
          right: -100%;
          top: 0;
          bottom: 0;
        }
      }
      .swiper-pagination {
        display: flex;
        flex-direction: column;
        left: 114px;
        top: 50%;
        transform: translateY(-50%);
        .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          margin-top: 16px;
          &:first-child {
            margin-top: 0;
          }
        }
      }
      .arrow {
        img {
          z-index: 10;
          animation: fadeInDown 1s infinite;
        }
      }
      .half-blue-circle {
        animation: circle-animation-three 8s linear infinite alternate;
      }
    }
  }
}
</style>