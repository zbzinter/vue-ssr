<template>
  <div class="diamonds">
    <div class="big-title">
      充值金额：
    </div>
    <div class="defulat-list clearfix">
      <div
        v-for="(item, index) in diamondList"
        :key="index"
        class="diamonds-item"
        :class="{cur: item.recharge_option_id == selectedDiamondItem.recharge_option_id}"
        @click="selectDiamond(item)"
      >
        <div class="inner">
          <div class="top">
            <i class="iconfont iconds_gj" />
            <span class="num">{{ parseInt(item.diamond) }}</span>
            <span class="unit">钻石</span>
          </div>
          <div class="bottom">
            <span>{{ parseInt(item.price) }}元</span>
          </div>
        </div>
      </div>
    </div>
    <div
      class="other-diamonds"
      :class="inputFocus ? 'focus' : ''"
    >
      <InputNumber
        v-model="otherDiamond"
        :step="1"
        :max="maxMoney"
        placeholder="请输入其他钻石"
        @on-focus="diamondFocus"
        @on-blur="diamondBlur"
        @on-change="diamondChange"
      />
      <span class="unit">钻石</span>
    </div>
    <div class="mode-of-pay">
      <span class="sub title">支付方式:</span>
      <div
        class="sub btn alipay"
        :class="{ cur: payType === 'alipay' }"
        @click="checkPay('alipay')"
      >
        <i class="iconfont iconel_bj" />
        <span>支付宝</span>
      </div>
      <div
        class="sub btn wx"
        :class="{ cur: payType === 'weixin' }"
        @click="checkPay('weixin')"
      >
        <i class="iconfont iconek_bj" />
        <span>微信支付</span>
      </div>
    </div>

    <div class="pay-money">
      <span class="title">应付金额:</span>
      <span class="price">{{ total || 0 }}<span class="unit">元</span></span>
    </div>

    <Button
      class="go-pay"
      :loading="loading"
      @click="goPayDiamonds()"
    >
      去支付
    </Button>
  </div>
</template>
<script>
import { InputNumber, Button } from 'iview'
export default {
  components: {
    InputNumber,
    Button,
  },
  data() {
    return {
      // 选择钻石的方式 1：套餐，2：自定义输入
      selectType: 1,
      // 钻石列表
      diamondList: [],
      // 钻石基本配置信息
      otherParams: {},
      // 选中的钻石-默认第一个
      selectedDiamondItem: {},
      // 支付方式-默认支付宝
      payType: 'alipay',
      // 生成微信二维码的链接地址
      qrcodeLink: '',
      // 自定义输入的钻石数量
      otherDiamond: null,
      // 支付宝限制10万，微信限制5万
      maxMoney: 100000,
      // 应付金额
      total: null,
      // 支付loading
      loading: false,
      // input 动态样式
      inputFocus: false,
    }
  },
  mounted() {
    this.getDiamondList()
  },
  methods: {
    // 请求预置的钻石列表
    getDiamondList() {
      this.$get('/api/v1/user.php?do=rechargepackage', {
        apiType: 'shop',
        body: {
          platform: 'web'
        }
      }).then(res => {
        const { code, data={} } = res
        if (code == 200) {
          this.diamondList = data.recharge || []
          this.otherParams = data.other || {}
          this.selectDiamond(this.diamondList[0])
        }
      })
    },
    // 选择钻石
    selectDiamond(data) {
      // 清空手输钻石
      this.otherDiamond = null
      // 选择类型
      this.selectType = 1
      // 切换选择的钻石item
      this.selectedDiamondItem = data
      // 总金额
      this.total = parseInt(this.selectedDiamondItem.price)
    },
    // 选择支付方式
    checkPay(payType) {
      this.payType = payType
    },
    // 手动输入 focus
    diamondFocus() {
      // 选择类型
      this.selectType = 2
      // 清空输入内容
      this.otherDiamond = null
      // 清空套餐选择
      this.selectedDiamondItem = {}
      // 计算总价
      this.total = this.otherDiamond
      // 加class
      this.inputFocus = true
    },
    diamondBlur() {
      this.inputFocus = false
    },
    // 手动输入 change
    diamondChange(val) {
      this.total = val
    },
    // 支付
    goPayDiamonds() {
      let params = {}
      // 判断是套餐还是手动输入
      if(this.selectType === 1) {
        params = {
          recharge_id: this.selectedDiamondItem.recharge_id,
          recharge_option_id: this.selectedDiamondItem.recharge_option_id,
        }
      } else {
        if(this.otherDiamond < 5) {
          this.$tip('最少充值5个钻石')
          return
        }
        params = {
          diamond: this.otherDiamond,
          recharge_id: this.otherParams.recharge_id
        }
      }

      // loading
      this.loading = true
      this.$post('/api/v1/user.php?do=rechargecreate', {
        apiType: 'shop',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: {
          user_id: this.getUserInfo().uid,
          alipay_return_url: window.location.origin,
          platform: 'web',
          ...params
        },
      }).then(res => {
        const { code, data={} } = res
        const { price, order_sn, code_url } = data || {}
        this.loading = false
        if (code == '200') {
          //支付宝
          if (this.payType == 'alipay') {
            window.location.href = data.alipay_url
          } else {
            // 去微信支付页面
            this.$router.push({
              path: '/pay/wx',
              query: {
                price,
                order_sn,
                code_url
              }
            })
          }
        }
      }).catch(() => {
        this.loading = false
      })
    },

  }
}
</script>
<style lang="postcss" scoped>
.diamonds {
  .big-title {
    font-size: 14px;
    color: #333333;
  }
  .defulat-list {
    .diamonds-item {
      width: 160px;
      height: 106px;
      float: left;
      margin: 16px 22px 0 0;
      cursor: pointer;
      border-radius: 8px;
      transition: all 0.2s;
      position: relative;
      &:nth-child(5n) {
        margin-right: 0;
      }
      &:hover {
        .inner {
          border-color: #3683ff;
        }
      }
      &.cur {
        transform: scale(1.02) translateY(-2px);
        box-shadow: 0 10px 15px 0 rgba(0,0,0,0.15);
        .inner {
          border: 2px solid #3683ff;
        }
      }
      .inner {
        width: 100%;
        display: block;
        padding: 0 12px;
        border-radius: 8px;
        border: 1px solid #ddd;
        position: absolute;
        left: 0;
        top: 0;
      }
      .top {
        height: 60px;
        text-align: center;
        padding-top: 20px;
        .iconfont {
          font-size: 30px;
          color: #52C4FF;
        }
        .num {
          font-size: 22px;
          color: #333333;
        }
        .unit {
          font-size: 12px;
          color: #999999;
        }
      }
      .bottom {
        height: 44px;
        line-height: 44px;
        font-size: 14px;
        color: #333333;
        text-align: center;
        border-top: 1px solid #F0F0F0;
      }
    }
  }
  .other-diamonds {
    width: 240px;
    height: 40px;
    line-height: 40px;
    overflow: hidden;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-top: 30px;
    position: relative;
    &.focus {
      border-color: #3683ff;
      .unit {
        color: #3683ff;
      }
    }
    >>>.ivu-input-number {
      float: left;
      width: 100%;
      padding-top: 1px;
      border: none;
      box-shadow: none;
      input {
        outline: none;
        border: none;
        font-size: 12px;
        color: #333;
      }
    }
    .unit {
      position: absolute;
      right: 0;
      top: 0;
      color: #333;
      padding: 0 10px;
      background: #fff;
    }
  }
  .mode-of-pay {
    height: 32px;
    line-height: 32px;
    margin-top: 40px;
    .sub {
      font-size: 14px;
      color: #333333;
      float: left;
    }
    .btn {
      border-radius: 4px;
      cursor: pointer;
      margin-left: 24px;
      height: 32px;
      padding: 0 14px 0 10px;
      border: 1px solid #CCCCCC;
      &.cur {
        .iconfont,span {
          color: #fff;
        }
      }
      .iconfont {
        font-size: 18px;
        float: left;
        padding-right: 8px;
        color: #41B035;
      }
      span {
        float: left;
      }
    }
    .alipay .iconfont {
      color: #3683FF;
    }
    .alipay.cur {
      background: #3683FF;
      border-color: #3683FF;
    }
    .wx.cur {
      background: #41B035;
      border-color: #41B035;
    }
  }
  .pay-money {
    margin: 35px 0 25px 0;
    font-size: 14px;
    .price {
      margin-left: 20px;
      font-size: 30px;
      font-weight: bold; 
      color: #ff9900;
      small {
        font-size: 20px;
        color: #333333;
      }
    }
    .unit {
      font-size: 16px;
      padding: 0 12px 0 5px;
      font-weight: normal;
      color: #333333;
    }
  }
  .go-pay {
    width: 270px;
    line-height: 44px;
    line-height: 44px;
    text-align: center;
    border-radius: 4px;
    font-size: 16px;
    color: #333333;
    padding: 0;
    cursor: pointer;
    font-weight: bold;
    box-shadow: none;
    border: none;
    background: linear-gradient(to right, #FFD235 , #FFE391);
  }
}

</style>


