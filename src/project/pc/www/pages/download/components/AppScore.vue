<template>
  <div class="app-score">
    <div class="content-area">
      <div class="app-img-wrapper">
        <img class="little-circle" src="../../../assets/download-center/web_bg_circle11.svg" />
        <img class="solid-middle-circle" src="../../../assets/download-center/web_bg_circle06.svg" />
        <img class="big-circle-left" src="../../../assets/download-center/web_bg_circle04.svg" />
        <img class="big-circle" src="../../../assets/download-center/web_bg_circle05.svg" />
        <div class="index-img-wrapper">
          <img class="blue-circle" src="../../../assets/download-center/web_bg_circle07.svg" />
          <img class="index-img" src="../../../assets/download-center/web_bifen_img_luodiye.png" />
        </div>
      </div>

      <div class="content">
        <div class="top-imgs">
          <img class="title" src="../../../assets/download-center/web_bifen_title.svg" />
        </div>
        <div class="copywriting">
          <span>覆盖足球、篮球、电竞、网球、棒球各类比分，带你有理有据看比赛</span>
        </div>
        <div class="qrcode-area">
          <img class="qrcode" src="../../../assets/home/download-qrcode.png" />
          <div class="btn-area">
            <button class="btn btn-android" @click="onBtnClick(1)">
              <img src="../../../assets/download-center/web_icon_android.svg" />
              <span>安卓下载</span>
            </button>
            <button class="btn btn-ios" @click="onBtnClick(2)">
              <img src="../../../assets/download-center/web_icon_ios.svg" />
              <span>iOS下载</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="footer-corner">
        <img class="big-arcs" src="../../../assets/download-center/web_bg_circle05.svg" />
        <img class="little-arcs" src="../../../assets/download-center/web_bg_circle05.svg" />
        <img
          class="half-blue-circle"
          src="../../../assets/download-center/web_bifen_bg_circle01.svg"
        />
        <img class="solid-circle" src="../../../assets/download-center/web_bg_circle11.svg" />
      </div>
      <div class="arrow">
        <img class="icon-arrow" src="../../../assets/download-center/arrow.svg" @click="next" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    onBtnClick(type) {
      const platform = type === 2 ? "ios" : "android";
      this.$emit("click-download", platform);
    },
    next() {
      this.$emit("on-click-next");
    }
  }
};
</script>
<style scoped lang="postcss">
.app-score {
  height: 100%;
  position: relative;
  overflow: hidden;
  .app-img-wrapper {
    position: absolute;
    /* -4 + 122px */
    top: 118px;
    left: 25px;
    opacity: 0;
    transform: translateX(-100%);
    .big-circle {
      width: 1047px;
      right: 26px;
    }
    .little-circle {
      position: absolute;
      bottom: 250px;
      left: 76px;
    }
    .solid-middle-circle {
      position: absolute;
      top: 80px;
      right: 200px;
    }
    .big-circle-left {
      position: absolute;
      transform: rotate(256deg) translate(107px, -32px);
    }
    .index-img-wrapper {
      position: absolute;
      bottom: 43px;
      right: 103px;
      .blue-circle {
        width: 830px;
      }
      .index-img {
        position: absolute;
        bottom: -1px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
  .content {
    position: absolute;
    /* 209 + 122 */
    top: 331px;
    right: 250px;
    z-index: 10;
    .top-imgs {
      .title {
        position: absolute;
        z-index: 1;
        opacity: 0;
        transform: translateY(-300%);
      }
    }
    .copywriting {
      width: 608px;
      margin-top: 92px;
      display: flex;
      opacity: 0;
      transform: translateX(-50%);
      span {
        font-family: PingFangSC-Regular;
        font-size: 20px;
        color: #4f566d;
      }
    }
    .qrcode-area {
      margin-top: 110px;
      padding-left: 10px;
      display: flex;
      align-items: center;
      opacity: 0;
      transform: translateX(-50%);
      .qrcode {
        width: 124px;
        height: 124px;
      }
      .btn-area {
        margin-left: 38px;
        .btn {
          width: 192px;
          display: block;
          padding: 7px 0;
          cursor: pointer;
          img {
            width: 32px;
            height: 32px;
          }
          span {
            margin-left: 12px;
            font-family: PingFangSC-Regular;
            font-size: 20px;
            color: #ffffff;
            vertical-align: middle;
          }
        }
        .btn-android {
          background: #3683ff;
        }
        .btn-ios {
          margin-top: 32px;
          background-image: linear-gradient(90deg, #272b39 13%, #191d29 100%);
        }
      }
    }
  }
  .footer {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    .footer-corner {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 462px;
      overflow: hidden;
      opacity: 0;
      transform: translateX(50%);
      .big-arcs {
        width: 1051px;
        position: absolute;
        right: -748px;
        bottom: -590px;
      }
      .little-arcs {
        width: 765px;
        position: absolute;
        right: -605px;
        bottom: -446px;
      }
      .half-blue-circle {
        position: absolute;
        right: 0;
        bottom: 45px;
      }
      .solid-circle {
        position: absolute;
        width: 18px;
        height: 18px;
        bottom: 228px;
        right: 331px;
      }
    }
    .arrow {
      .icon-arrow {
        position: absolute;
        bottom: 60px;
        left: 50%;
        transform: translateX(-50%);
        cursor: pointer;
      }
    }
  }
}
</style>