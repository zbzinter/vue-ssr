<template>
  <div>
    <Modal
      v-model="rechargeShow"
      :footer-hide="true"
      :closable="false"
      class="gift-recharge"
      :class="{finish: isPay}"
    >
      <div class="header">
        <h2 class="fl">
          充值提醒
        </h2>
        <span class="fork fr">
          <i
            class="iconfont iconaz_fa"
            @click="close"
          />
        </span>
      </div>
      <div class="content">
        <!-- 支付完成 -->
        <div
          v-if="isPay"
          class="pay-success-box"
        >
          <div class="pay-success">
            <svg
              class="svg-icon iconfont"
              aria-hidden="true"
            >
              <use xlink:href="#icon_bule_success" />
            </svg>
            <span class="pay-success__tip block">充值成功</span>
          </div>
          <p class="pay-tip">
            恭喜<span class="warn">{{ commUserInfo.nickName }}</span>获得了<span class="warn">{{ price*10 }}</span>钻石！
          </p>
        </div>
        <!-- 支付中 -->
        <div
          v-else
          class="paying"
        >
          <Spin
            v-if="loading"
            fix
          >
            <img
              src="../../../../assets/loading.gif"
              alt=""
            >
          </Spin>
          <h2 class="b-title">
            余额不足
          </h2>
          <div class="txt">
            <p>充值{{ price*10 }}个钻石就可以送出礼物哦</p>
            <p>应付金额：<span class="price">{{ price }}</span> 元</p>
          </div>
          <!-- 支付二维码 -->
          <div
            id="qrcode"
            ref="qrcode"
            class="qr-code"
          />
          <div class="btn-box">
            <div
              class="btn"
              :class="{cur: payType === 1}"
              @click="handlerSelectPay(1)"
            >
              <i class="iconfont zfb iconel_bj" />
              <span>支付宝</span>
            </div>
            <div
              class="btn"
              :class="{cur: payType === 2}"
              @click="handlerSelectPay(2)"
            >
              <i class="iconfont wx iconek_bj" />
              <span>微信支付</span>
            </div>
          </div>
          <div class="other">
            <span @click="showCommonRecharge">充值其他金额 <i class="iconfont iconbq_ee" /></span>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { Modal, Spin } from 'iview'
import { mapActions } from 'vuex'
let QRCode = null
export default {
  components: {
    Modal,
    Spin
  },
  props: {
    regDiamond: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      rechargeShow: true,
      // 是否已支付
      isPay: false,
      // 加载二维码
      loading: false,
      // 1是支付宝 2是微信
      payType: null,
      // 订单号
      orderSn: '',
      // 生成二维码实例
      qrcode: '',
      // 查询支付状态-定时器
      timerPayStatus: null,
      // 价格
      price: 0,
      // 生成二维码url
      payUrl: '',
      // 钻石数量
      otherDiamond: 0,
      // 其他钻石配置项
      otherParams: {
        platform: 'web',
        recharge_id: '225',
      },
    }
  },
  destroyed() {
    this.clearQueryPayStatus()
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions(['G_GetMemberInfo']),
    init() {
      this.otherDiamond = this.regDiamond
      this.loadingJs()
      // 默认选择微信支付
      this.handlerSelectPay(2)
    },
    loadingJs() {
      QRCode = require('qrcodejs2')
    },
    // 关闭弹窗
    close() {
      this.clearQueryPayStatus()
      this.G_GetMemberInfo({uid: this.getUserInfo().uid})
      // 关闭弹层
      this.$parent.toggleRechargeModal()
    },

    // 选择支付方式
    handlerSelectPay(val) {
      if(val === this.payType) return
      this.payType = val
      this.goPayDiamonds()
    },

    // 显示公共充值框
    showCommonRecharge() {
      this.$emit('showCommonRecharge')
    },

    // 支付
    goPayDiamonds() {
      this.payUrl = ''
      this.loading = true
      this.clearQrcode()
      let params = {}
      params = {
        diamond: this.otherDiamond,
        recharge_id: this.otherParams.recharge_id
      }

      const platform = this.payType === 1 ? 'wap' : 'web'

      const returnUrl = window.location.href
      this.$post('/api/v1/user.php?do=rechargecreate', {
        apiType: 'shop',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: {
          user_id: this.getUserInfo().uid,
          platform,
          alipay_return_url: returnUrl,
          ...params
        },
      }).then(res => {
        const { code, data: { price, order_sn, code_url, alipay_url } } = res
        this.loading = false
        if (this.$judgeCode(Number(code))) {
          this.price = Number(price) 
          this.orderSn = order_sn
          this.payUrl = this.payType === 1 ? alipay_url : code_url
          this.clearQrcode()
          this.createQrcode(this.payUrl)
          this.clearQueryPayStatus()
          this.getPayStatus()
        } else {
          this.$error('出错了，请稍后重试')
        }
      }).catch(() => {
        this.loading = false
      })
    },

    createQrcode(url) {
      this.qrcode = new QRCode('qrcode', {
        width: 150, // 图像宽度
        height: 150, // 图像高度
        colorDark : '#000000', // 前景色
        colorLight : '#ffffff', // 背景色
        typeNumber:4, 
        correctLevel : QRCode.CorrectLevel.H // 容错级别 容错级别有：（1）QRCode.CorrectLevel.L （2）QRCode.CorrectLevel.M （3）QRCode.CorrectLevel.Q （4）QRCode.CorrectLevel.H
      })
      this.qrcode.clear() // 清除二维码 
      this.qrcode.makeCode(url)
    },

    // 查询支付状态
    getPayStatus() {
      this.timerPayStatus = setInterval(() => {
        this.$get('/api/v1/user.php?do=queryorder', {
          apiType: 'shop',
          body: {
            order_sn: this.orderSn
          }
        }).then(res => {
          const { code, data } = res
          if (code == 200 && data.status === 1) {
            this.isPay = true
            clearInterval(this.timerPayStatus)
          }
        })
      }, 2000)
    },
    
    clearQueryPayStatus() {
      if (this.timerPayStatus) {
        clearInterval(this.timerPayStatus)
      }
    },

    clearQrcode() {
      if ( this.$refs.qrcode && this.$refs.qrcode.innerHTML) {
        this.$refs.qrcode.innerHTML = ''  
      }
    },

    // 页面跳转
    jumpPage(path) {
      this.$router.push(path)
    },
  }
}
</script>

<style lang="scss" scoped>
.gift-recharge {
  /deep/ .ivu-modal-content {
    width: 500px;
    height: 450px;
    background: #fff;
  }
  /deep/ {
    .ivu-modal-body {
      padding: 0
    }
  }
  &.finish {
    /deep/ .ivu-modal-content {
      height: 330px;
    }
  }
  .header {
    height: 50px;
    line-height: 50px;
    margin: 0 12px;
    border-bottom: 1px solid #ccc;
    h2 {
      font-size: 18px;
      color: #666666;
      font-weight: normal;
    }
    .iconfont {
      color: #999;
      font-size: 24px;
      cursor: pointer;
    }
  }
  .content {
    text-align: center;
    position: relative;
    .b-title {
      font-size: 20px;
      color: #333333;
      line-height: 1;
      padding: 20px 0 28px 0;
    }
    .txt {
      font-size: 14px;
      color: #666;
      line-height: 20px;
      .price {
        font-size: 20px;
        color: #F5AA58;
        font-weight: bold;
      }
    }
    .qr-code {
      padding: 10px;
      margin: 10px 0;
      height: 170px;
      overflow: hidden;
      display: inline-block;
      img {
        display: block;
        width: 150px;
        height: 150px;
      }
    }
    .btn-box {
      .btn {
        width: 100px;
        height: 32px;
        line-height: 30px;
        display: inline-block;
        margin: 0 10px;
        cursor: pointer;
        border-radius: 4px;
        border: 1px solid #ccc;
        .iconfont {
          font-size: 18px;
          float: left;
          margin: 0 8px 0 11px;
        }
        .zfb {
          color: #00AEF5;
        }
        .wx {
          color: #41b035;
        }
        span {
          float: left;
        }
        &.cur {
          color: #fff;
          border-color: #3683FF;
          background: #3683FF;
          .iconfont {
            color: #fff;
          }
        }
      }
    }
    .other {
      margin-top: 12px;
      font-size: 14px;
      color: #F5AA58;
      span {
        cursor: pointer;
      }
      .iconfont {
        font-size: 12px;
      }
    }
  }
}

.pay-success-box {
  .pay-success {
    padding-top: 50px;
    &__tip {
      padding-top: 16px;
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #333333;
    }
  }
  .svg-icon {
    font-size: 76px;
  }

  .pay-tip {
    padding-top: 40px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #666666;
    line-height: 20px;
    .warn {
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #FF7D29;
    }
  }
}
</style>
