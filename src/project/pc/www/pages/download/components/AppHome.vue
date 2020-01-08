<template>
  <div class="app-home">
    <div class="content-area">
      <div class="content">
        <div class="top-imgs">
          <img class="circle" src="../../../assets/download-center/web_bg_circle03.svg" />
          <img class="title" src="../../../assets/download-center/web_index_title.svg" />
        </div>
        <div class="copywriting">
          <span>英超</span>
          <span>NBA</span>
          <span>欧冠</span>
          <span>CBA</span>
          <span>西甲</span>
          <span>中超</span>
          <span>意甲</span>
          <span>德甲</span>
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

      <div class="app-img-wrapper">
        <img class="little-circle" src="../../../assets/download-center/web_bg_circle11.svg" />
        <img class="solid-middle-circle" src="../../../assets/download-center/web_bg_circle06.svg" />
        <img class="big-circle-right" src="../../../assets/download-center/web_bg_circle04.svg" />
        <img class="big-circle" src="../../../assets/download-center/web_bg_circle05.svg" />
        <div class="index-img-wrapper">
          <img class="blue-circle" src="../../../assets/download-center/web_bg_circle07.svg" />
          <img class="index-img" src="../../../assets/download-center/web_index_img_shouye.png" />
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="footer-corner">
        <img class="big-arcs" src="../../../assets/download-center/web_bg_circle08.svg" />
        <img class="little-arcs" src="../../../assets/download-center/web_bg_circle09.svg" />
        <img class="half-blue-circle" src="../../../assets/download-center/web_bg_circle10.svg" />
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
.app-home {
  height: 100%;
  position: relative;
  overflow: hidden;
  .content {
    position: absolute;
    /* 209 + 122 */
    top: 331px;
    left: 339px;
    z-index: 1;
    .top-imgs {
      .circle {
        position: absolute;
        width: 126px;
        left: -49px;
        top: -42px;
        opacity: 0;
        transform: translateY(-300%);
      }
      .title {
        position: absolute;
        z-index: 1;
        opacity: 0;
        transform: translateY(-300%);
      }
    }
    .copywriting {
      width: 608px;
      margin-top: 94px;
      display: flex;
      opacity: 0;
      transform: translateX(50%);
      span {
        margin-left: 35.3px;
        font-family: PingFangSC-Regular;
        font-size: 20px;
        color: #4f566d;
        &:first-child {
          margin-left: 0;
        }
      }
    }
    .qrcode-area {
      margin-top: 110px;
      display: flex;
      align-items: center;
      opacity: 0;
      transform: translateX(50%);
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
  .app-img-wrapper {
    position: absolute;
    /* -4 + 122px */
    top: 118px;
    right: 26px;
    opacity: 0;
    transform: translateX(100%);
    .big-circle {
      width: 1047px;
      right: 26px;
    }
    .little-circle {
      position: absolute;
      bottom: 260px;
      right: 100px;
    }
    .solid-middle-circle {
      position: absolute;
      top: 80px;
      left: 200px;
    }
    .big-circle-right {
      position: absolute;
      transform: translate(264px, -118px);
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
        bottom: -2px;
        left: 50%;
        transform: translateX(-321px); /* 50% -1 */
      }
    }
  }
  .footer {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    .footer-corner {
      opacity: 0;
      transform: translateX(-50%);
      .little-arcs {
        position: absolute;
        left: 0;
        bottom: 0;
      }
      .half-blue-circle {
        position: absolute;
        left: 86px;
        bottom: 0;
      }
      .solid-circle {
        position: absolute;
        bottom: 105px;
        left: 290px;
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