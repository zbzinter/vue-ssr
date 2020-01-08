<template>
  <div class="app-live">
    <div class="content-area">
      <div class="content">
        <div class="top-imgs">
          <img
            class="circle"
            src="../../../assets/download-center/web_bg_circle03.svg"
          >
          <img
            class="title"
            src="../../../assets/download-center/web_zhibojian_title.svg"
          >
        </div>
        <div class="copywriting">
          <span>主播带您看比赛，聊赛事，玩竞猜，惊喜好礼送不停</span>
        </div>
        <div class="qrcode-area">
          <img
            class="qrcode"
            src="../../../assets/home/download-qrcode.png"
          >
          <div class="btn-area">
            <button
              class="btn btn-android"
              @click="onBtnClick(1)"
            >
              <img src="../../../assets/download-center/web_icon_android.svg">
              <span>安卓下载</span>
            </button>
            <button
              class="btn btn-ios"
              @click="onBtnClick(2)"
            >
              <img src="../../../assets/download-center/web_icon_ios.svg">
              <span>iOS下载</span>
            </button>
          </div>
        </div>
      </div>

      <div class="app-img-wrapper">
        <img
          class="little-circle"
          src="../../../assets/download-center/web_bg_circle11.svg"
        >
        <img
          class="solid-middle-circle"
          src="../../../assets/download-center/web_bg_circle06.svg"
        >
        <img
          class="big-circle-right"
          src="../../../assets/download-center/web_bg_circle04.svg"
        >
        <img
          class="big-circle"
          src="../../../assets/download-center/web_bg_circle05.svg"
        >
        <div class="index-img-wrapper">
          <img
            class="blue-circle"
            src="../../../assets/download-center/web_bg_circle07.svg"
          >
          <div class="main-img">
            <img
              class="index-img"
              src="../../../assets/download-center/web_zhibo_img_zhiboye.png"
            >
            <!-- 美女 -->
            <img
              class="beauty-img"
              src="../../../assets/download-center/zhibo_img_meinv.png"
            >
            <!-- 皇冠 -->
            <img
              class="crown-img"
              src="../../../assets/download-center/web_zhibo_icon_crown.svg"
            >
          </div>
          <!-- 礼物 -->
          <div class="gift-part">
            <div class="gift-msg">
              <p>梦牵绕了...</p>
              <p>送出&nbsp;&nbsp;<span class="gold">玫瑰花</span></p>
            </div>
            <img
              class="head-logo"
              src="../../../assets/download-center/small_head.png"
            >
            <img
              class="flower-img"
              src="../../../assets/download-center/small-gift-flower.png"
            >
          </div>
        </div>
      </div>
    </div>

    <!-- 弹幕部分 -->
    <div class="danmu-part">
      <div class="danmu-container danmu1">
        <span>斯塔尔南右路的长传球！</span>
      </div>
      <div class="danmu-container danmu2">
        <span>冲击三连冠！</span>
      </div>
      <div class="danmu-container danmu3">
        <span>足球已经五连红</span>
      </div>
      <div class="danmu-container danmu4">
        <span>哈维洛佩斯头球解围！</span>
      </div>
    </div>

    <div class="footer">
      <div class="footer-corner">
        <img
          class="big-arcs"
          src="../../../assets/download-center/web_bg_circle08.svg"
        >
        <img
          class="little-arcs"
          src="../../../assets/download-center/web_bg_circle09.svg"
        >
        <img
          class="half-blue-circle"
          src="../../../assets/download-center/web_bg_circle10.svg"
        >
        <img
          class="solid-circle"
          src="../../../assets/download-center/web_bg_circle11.svg"
        >
      </div>
      <div class="arrow">
        <img
          class="icon-arrow"
          src="../../../assets/download-center/arrow.svg"
          @click="next"
        >
      </div>
    </div>
  </div>
</template>
<script>

export default {
  methods: {
    onBtnClick(type) {
      const platform = type === 2 ? 'ios' : 'android'
      this.$emit('click-download', platform)
    },
    next() {
      this.$emit('on-click-next')
    }
  }
}
</script>
<style lang="postcss">
@keyframes moveToLeft {
    from{
        left: 100%;
    }
    to{
        left: -285px;
    }
}
.swiper-slide-active{
    .danmu-part{
        .danmu-container{
            animation-name: moveToLeft!important;
        }
    }
}
</style>

<style scoped lang="postcss">
.app-live{
    height: 100%;
    position: relative;
    overflow: hidden;
    .content{
        position: absolute;
        /* 209 + 122 */
        top: 331px;
        left: 339px;
        z-index: 1;
        .top-imgs{
            .circle{
                position: absolute;
                width: 126px;
                left: -49px;
                top: -42px;
                opacity: 0;
                transform: translateY(-300%);
            }
            .title{
                position: absolute;
                z-index: 1;
                opacity: 0;
                transform: translateY(-300%);
            }
        }
        .copywriting{
            width: 669px;
            margin-top: 90px;
            display: flex;
            opacity: 0;
            transform: translateX(50%);
            span{
                font-family: PingFangSC-Regular;
                font-size: 20px;
                color: #4F566D;
            }
        }
        .qrcode-area{
            margin-top: 110px;
            display: flex;
            align-items: center;
            opacity: 0;
            transform: translateX(50%);
            .qrcode{
                width: 124px;
                height: 124px;
            }
            .btn-area{
                margin-left: 38px;
                .btn{
                    width: 192px;
                    display: block;
                    padding: 7px 0;
                    cursor: pointer;
                    img{
                        width: 32px;
                        height: 32px;
                    }
                    span{
                        margin-left: 12px;
                        font-family: PingFangSC-Regular;
                        font-size: 20px;
                        color: #ffffff;
                        vertical-align: middle;
                    }
                }
                .btn-android{
                    background: #3683FF;
                }
                .btn-ios{
                    margin-top: 32px;
                    background-image: linear-gradient(90deg, #272B39 13%, #191D29 100%);
                }
            }
        }
    }
    .app-img-wrapper{
        position: absolute;
        /* -4 + 122px */
        top: 118px;
        right: 26px;
        opacity: 0;
        transform: translateX(100%);
        .big-circle{
            width: 1047px;
            right: 26px;
        }
        .little-circle{
            position: absolute;
            bottom: 260px;
            right: 100px;
        }
        .solid-middle-circle{
            position: absolute;
            top: 80px;
            left: 200px;
        }
        .big-circle-right{
            position: absolute;
            transform: translate(264px, -118px);
        }
        .index-img-wrapper{
            position: absolute;
            bottom: 43px;
            right: 103px;
            .blue-circle{
                width: 830px;
            }
            .main-img{
                position: absolute;
                left: 0;
                right: -4px;
                top: -30px;
                bottom: -1px;
                z-index: 10;
                overflow: hidden;
                border-radius: 0 0 50%;
                .index-img{
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                }
                .beauty-img{
                    position: absolute;
                    right: 58px;
                    bottom: 0;
                    z-index: 10;
                }
                .crown-img{
                    position: absolute;
                    right: 200px;
                    bottom: 496px;
                    z-index: 10;
                }
            }
            .gift-part{
                position: absolute;
                left: 0;
                top: 490px;
                z-index: 11;
                .gift-msg{
                    width: 370px;
                    font-size: 24px;
                    font-weight: 300;
                    line-height: 45px;
                    color: #ffffff;
                    text-align: center;
                    background: url(../../../assets/download-center/small_gift_bg.png) no-repeat left/contain;
                    .gold{
                        color: #fce103;
                    }
                }
                .head-logo{
                    position: absolute;
                    width: 80px;
                    left: -30px;
                    top: -30px;
                }
                .flower-img{
                    position: absolute;
                    width: 100px;
                    right: 12px;
                    top: -46px;
                }
            }
        }
    }
    .danmu-part{
        .danmu-container{
            position: absolute;
            left: 100%;
            z-index: 1;
            box-sizing: border-box;
            white-space: nowrap;
            animation: moveToLeft 8s linear 0.5s infinite;
            span{
                font-family: PingFangSC-Regular;
                font-size: 20px;
                line-height: 28px;
                color: #FFFFFF;
            }
            &.danmu1{
                top: 186px;
                width: 285px;
                padding: 11px 39px 25px 26px;
                background: url('../../../assets/download-center/web_zhibo_bg_danmu01.svg') no-repeat center/cover;
                animation-delay: 0.5s;
                animation-name: none;
            }
            &.danmu2{
                top: 700px;
                width: 223px;
                padding: 11px 77px 21px 26px;
                background: url('../../../assets/download-center/web_zhibo_bg_danmu02.svg') no-repeat center/cover;
                animation-delay: 1.5s;
                animation-name: none;
            }
            &.danmu3{
                top: 464px;
                width: 223px;
                padding: 11px 39px 25px 26px;
                background: url('../../../assets/download-center/web_zhibo_bg_danmu03.svg') no-repeat center/cover;
                animation-delay: 2.5s;
                animation-name: none;
            }
            &.danmu4{
                top: 382px;
                width: 253px;
                padding: 11px 27px 21px 26px;
                background: url('../../../assets/download-center/web_zhibo_bg_danmu04.svg') no-repeat center/cover;
                animation-delay: 3.5s;
                animation-name: none;
            }
        }
    }
    .footer{
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        .footer-corner{
            opacity: 0;
            transform: translateX(-50%);
            .little-arcs{
                position: absolute;
                left: 0;
                bottom: 0;
            }
            .half-blue-circle{
                position: absolute;
                left: 86px;
                bottom: 0;
            }
            .solid-circle{
                position: absolute;
                bottom: 105px;
                left: 290px;
            }
        }
        .arrow{
            .icon-arrow{
                position: absolute;
                bottom:60px;
                left: 50%;
                transform: translateX(-50%);
                cursor: pointer;
            }
        }
    }
}
</style>