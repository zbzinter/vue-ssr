<template>
  <div>
    <Modal
      v-model="rechargeShow"
      :footer-hide="true"
      :closable="false"
      class="recharge"
    >
      <div class="header">
        <p>钻石充值  <span>（余额{{ commMemberInfo.diamond || 0 }}钻石）</span> </p>
        <span class="fork">
          <i
            class="iconfont iconfb_dc"
            @click="close"
          />
        </span>
      </div>
      <div
        v-if="openFlag"
        class="content"
      >
        <div class="item">
          <p class="title">
            <i class="iconfont iconfe_da" /> 充值项目
          </p>
          <div class="diamond">
            <div
              class="clearfix"
              style="height: 40px;"
            >
              <span
                class="fl sidebar ml"
                :class="isClick ? '' : 'sidebar-select'"
                @click="handlerSwitch(0)"
              >
                <i class="iconfont iconbp_ee" />
              </span>
              <div class="fl">
                <div class="num">
                  <ul
                    class="num-list"
                    :class=" isClick ? 'num-list__right' : 'num-list__left' "
                  >
                    <li
                      v-for="(item, index) in diamondList"
                      :key="index"
                      :class="selectActive === index ? 'active' : ''"
                      @click="selectDiamond(item, index)"
                    >
                      <p>{{ item.diamond }}钻石</p>
                      <span>￥{{ Number(item.presellprice) }}</span>
                      <i
                        v-if="selectActive === index"
                        class="iconfont iconfl_dj1"
                      />
                    </li>
                    <li @click="selectDiamond({}, -2)">
                      <div
                        class="other"
                      >
                        <input
                          v-model="otherDiamond"
                          type="text"
                          placeholder="其他金额"
                          class="number"
                          :maxlength="String(otherParams.max).length"
                          :max="Number(otherParams.max)"
                          :min="Number(otherParams.min)"
                          :class="selectActive === -2 ? 'other-active' : ''"
                        >
                        <span
                          class="input-number"
                        >钻石（{{ otherDiamond ? otherDiamond*10 : 0 }}）</span>
                        <i
                          v-if="selectActive === -2"
                          class="iconfont iconfl_dj1"
                        />
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <span
                class="fr sidebar"
                :class="!isClick ? '' : 'sidebar-select'"
                @click="handlerSwitch(1)"
              >
                <i class="iconfont iconbq_ee" />
              </span>
            </div>
            <span
              v-if="warnTip"
              class="tip"
            >
              <i class="iconfont iconfi_dj" />
              <span>请输入{{ otherParams.min }}~{{ otherParams.max }}的整数</span>
            </span>
          </div>
        </div>
        <div class="item">
          <p class="title pb">
            <i class="iconfont iconfa_da" /> 支付方式
          </p>
          <div class="way">
            <div class="btn">
              <div
                class="mr pay clearfix"
                :class="payType === 1 ? 'active': ''"
                @click="handlerSelectPay(1)"
              > 
                <i class="iconfont iconfh_dj fl" /> 
                <span class="fl pay-alipay">支付宝</span>
                <i
                  v-if="payType === 1"
                  class="iconfont iconfl_dj1 fr"
                />
              </div>
              <div
                class="pay clearfix"
                :class="payType === 2 ? 'active': ''"
                @click="handlerSelectPay(2)"
              > 
                <i class="iconfont iconff_dj fl" />
                <span class="fl">微信支付</span>
                <i
                  v-if="payType === 2"
                  class="iconfont iconfl_dj1 fr"
                />
              </div>
            </div>
            <div class="qrcode">
              <div v-if="!qrcodeFlag">
                <Spin
                  v-if="loading"
                  fix
                >
                  <img
                    src="../assets/loading.gif"
                    alt=""
                  >
                </Spin>
               
                <div v-show="selectActive !== -2 || otherDiamond !== ''">
                  <div
                    id="qrcode"
                    ref="qrcode"
                    class="img"
                  />
                  <div
                    v-if="payUrl"
                    class="qrcode-icon"
                  >
                    <img
                      v-if="payType === 1"
                      class="qrcode-icon__img"
                      src="../assets/personal/icon-alipay.png"
                      alt=""
                    >
                    <img
                      v-if="payType === 2"
                      class="qrcode-icon__img"
                      src="../assets/personal/icon-wx.png"
                      alt=""
                    >
                  </div>
                  <p v-if="payUrl && payType === 1">
                    <a
                      class="open-pay"
                      @click="openPay"
                    >登录支付宝账号付款 <i class="iconfont iconbq_ee" /> </a>
                  </p>
                  <p
                    v-if="payUrl"
                    class="alipay"
                    :class="payUrl && payType === 2 ? 'mt': ''"
                  > 
                    <i
                      class="iconfont"
                      :class="payType === 1 ? 'iconfh_dj' : 'iconff_dj'"
                    /> 
                    请使用{{ payType === 1 ? '支付宝' : '微信' }}扫码
                    ，支付 <span class="error">{{ price }}</span> 元
                  </p>
                </div>
              </div>
              <div
                v-if="qrcodeFlag && payType === 2"
                class="qrcode-error__tip"
              >
                <i class="iconfont iconfi_dj" />
                <p>微信支付支付金额单笔限额200000元，已超出限额</p>
                <span>请更换充值金额，或使用其他支付方式</span>
              </div>
              <div
                v-if="selectActive === -2 && otherDiamond === ''"
                class="qrcode-error__tip"
              >
                <i class="iconfont iconfg_dj" />
                <p>请输入正确的金额</p>
              </div>
            </div>
          </div>
        </div>
        <div class="rule">
          <p>
            <span>阅读并同意</span> <a @click="ruleRecharge">《充值服务协议》</a>
          </p>
        </div>
      </div>
      <div
        v-if="!openFlag"
        class="content"
      >
        <div class="recharge-close__icon">
          <img
            src="../assets/personal/img_tdgb.png"
            alt=""
          >
        </div>
        
        <p class="recharge-close__tip">
          抱歉，钻石充值通道暂时关闭
        </p>
      </div>
    </Modal>
    <Modal
      v-model="isPay"
      :footer-hide="true"
      :closable="false"
      class="pay"
    >
      <div class="header">
        <p>充值成功</p>
        <span class="fork">
          <i
            class="iconfont iconfb_dc"
            @click="isPay=false"
          />
        </span>
      </div>
      <div class="content">
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
          恭喜<span class="warn">{{ commUserInfo.nickName }}</span>获得了<span class="warn">{{ diamondNum }}</span>钻石！
        </p>
      </div>
    </Modal>
  </div>
</template>

<script>
import { Modal, Spin } from 'iview'
import { _throttle } from '@/comm/utils/common'
import {mapActions} from 'vuex'
let QRCode = null
export default {
  components: {
    Modal,
    Spin,
  },
  data() {
    return {
      rechargeShow: false,
      isPay: false,
      isClick: true,
      warnTip: false,
      qrcodeFlag: false,
      loading: false,
      diamondList: [],
      recharge: [],
      selectActive: -2,
      selectedDiamondItem: {},
      payType: 1, // 1是支付宝 2是微信
      selectType: 1, // 1是套餐 2是手动输入
      qrCodeImg: '',
      orderSn: '',
      qrcode: '',
      otherDiamond: '',
      timeHelper: null,
      timerPayStatus: null,
      price: 0,
      payUrl: '',
      alipayUrl: '',
      openFlag: false,
      otherParams: {
        max: '10000',
        min: '5',
        platform: 'web',
        rate: '1',
        recharge_id: '225',
      },
      diamondNum: 0

    }
  },
  watch: {
    otherDiamond: {
      handler: function (val) {
        clearTimeout(this.timeHelper)
        this.payUrl = ''
        this.clearQrcode()
        if (val) {
          this.warnTip = false
          this.selectActive = -2
          this.validateWxMax()
          this.otherDiamond = this.otherDiamond.replace(/^0/g, '')
          this.timeHelper = setTimeout(() => {
            // 手动输入
            if (this.selectType === 2) {
              this.otherDiamond = this.otherDiamond.replace(/[^0-9]/g, '')
              // 超过最大值删除一位， 小于最小值 变为空
              if (Number(this.otherDiamond) > Number(this.otherParams.max)) {
                this.otherDiamond = this.otherDiamond.slice(0, this.otherDiamond.length-1)
                return 
              }
              if (Number(this.otherDiamond) < Number(this.otherParams.min)) {
                this.otherDiamond = ''
                return 
              }
            }
            
            this.jdugeInput()
          }, 1000)
          
        } else {
          if (this.selectActive === -2) {
            this.warnTip = true
            this.qrcodeFlag = false
          }
         
        }
      },
      deep: true
    }
  },
  destroyed() {
    this.clearQueryPayStatus()
  },
  mounted() {
    import('qrcodejs2')
  },
  methods: {
    ...mapActions(['G_GetMemberInfo']),

    isShow() {
      this.payType = 1
      this.isClick = true
      this.loadingJs()
      this.getDiamondList()
    },

    loadingJs() {
      QRCode = require('qrcodejs2')
    },
    
    close() {
      this.rechargeShow = false
      this.clearQueryPayStatus()
      this.G_GetMemberInfo({uid: this.getUserInfo().uid})
    },

    handlerSelectPay(payType) {
      this.payType = payType
      this.validateWxMax()
      if (this.selectType === 2) {
        if ((this.qrcodeFlag && this.payType === 2) || !this.otherDiamond) return
      }
      this.goPayDiamonds()
    },

    validateWxMax() {
      if (this.selectType === 2 && this.payType === 2) {
        if (Number(this.otherDiamond) >= 200000) {

          // 超过20w 提示微信最大充值金额为20w
          this.qrcodeFlag = true
        } else {
          this.qrcodeFlag = false
        }
      }
      // 当选择套餐以及支付宝付款时
      if (this.selectType === 1 || this.payType ===1) {
        this.qrcodeFlag = false
      }
    
    },

    selectDiamond(data, index) {
      if (index === -2) {
        this.clearQueryPayStatus()
        this.warnTip = true
        if (this.otherDiamond) {
          this.warnTip = false 
        } else {
          this.price = 0
        }
        this.selectType = 2
        this.selectActive = -2
        return
      }
      this.warnTip = false 
      this.qrcodeFlag = false
      this.selectType = 1
      this.otherDiamond = ''
      this.selectActive = index
      this.selectedDiamondItem = {...data}
      this.goPayDiamonds()
    },

    // 请求预置的钻石列表
    getDiamondList() {
      this.$get('/api/v1/user.php?do=rechargepackage', {
        apiType: 'shop',
        body: {
          platform: 'web'
        }
      }).then(res => {
        const { code, data: {
          recharge, other, open
        } } = res
        if (this.$judgeCode(code)) {
          this.openFlag = open === 1 ? true : false
          this.rechargeShow = true
          this.diamondList = recharge
          this.recharge = [...recharge]
          this.otherParams = other
          this.otherParams.min = Number(this.diamondList[0].presellprice)
          if (this.diamondList &&  this.diamondList.length) {
            this.selectDiamond(this.diamondList[0], 0)
          }
        } else {
          this.$error('出错了，请稍后重试')
        }
      })
    },

    // 支付
    goPayDiamonds() {
      this.payUrl = ''
      this.loading = true
      this.clearQrcode()
      let params = {}
      // 判断是1套餐还是2手动输入
      if(this.selectType === 1) {
        params = {
          recharge_id: this.selectedDiamondItem.recharge_id,
          recharge_option_id: this.selectedDiamondItem.recharge_option_id,
        }
      } else {
        if (!this.otherDiamond) {
          return false
        }
       
        if(Number(this.otherDiamond) < Number(this.otherParams.min)) {
          this.$warning(`最少充值${this.otherParams.min}个钻石`)
          return
        }
        params = {
          diamond: this.otherDiamond * 10,
          recharge_id: this.otherParams.recharge_id
        }
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
        const { code, data: {price, order_sn, code_url, alipay_url, alipay_web_url, diamond} } = res
        this.loading = false
        if (this.$judgeCode(Number(code))) {
          this.qrcodeFlag = false
          this.price = Number(price) 
          this.orderSn = order_sn
          this.payUrl = this.payType === 1 ? alipay_url : code_url
          this.alipayUrl = alipay_web_url
          this.diamondNum = diamond || 0
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
        width: 115, // 图像宽度
        height: 115, // 图像高度
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
            this.updateUserAndMember({
              uid: localStorage.getItem('uid'),
              token: localStorage.getItem('token')
            })
            this.rechargeShow = false
            this.isPay = true
            clearInterval(this.timerPayStatus)
          }
        })
      }, 2000)      
    },
    
    // 应该拿num-list的长度进行判断
    // document.getElementsByClassName('num-list')[0].style.width
    // 除以 num 的长度 width 得到点击的次数
    handlerSwitch(index) {
      if (index === 1 && !this.isClick) {
        return
      } 
      if (index === 0) {
        this.warnTip = false
        
        if (this.selectActive === -2) {
          // this.selectDiamond(this.diamondList[0], 0)
        } 
        if (this.isClick) return
      }
      this.isClick = !this.isClick
    },

    jdugeInput: _throttle(function () {
      this.selectType = 2 
      this.validateWxMax()
      if (this.qrcodeFlag && this.payType === 2) return
      this.goPayDiamonds()
    }, 50),

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

    openPay() {
      window.open(this.alipayUrl)
    },

    ruleRecharge() {
      window.open('/rules/recharge-service')
    },

  }
}
</script>

<style lang="scss" scoped>

 .header {
    height: 46px;
    border-radius: 6px 6px 0 0;
    p {
      display: inline-block;
      font-family: PingFangSC-Regular;
      font-size: 18px;
      color: #FFFFFF;
      letter-spacing: 0;
      padding-left: 24px;
      line-height: 46px;
      width: 400px;
      span {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #FFFFFF;
        letter-spacing: 0;
      } 
    }
    .fork {
      display: inline-block;
      width: 300px;
      text-align: right;
      color: #fff;
    }
    .iconfb_dc {
      font-size: 14px;
      cursor: pointer;
    }
  }

.recharge {
  /deep/ .ivu-modal-content {
    width: 724px;
    height: 575px;
    background-color: #f7f7f7;
    margin-left: -102px;
  }
   /deep/ {
      .ivu-modal-body {
        padding: 0
      }
   }
  .header {
    background-image: linear-gradient(180deg, #FFC037 0%, #FF7923 100%);
  }
  .content {
    padding-top: 26px;
  }
  .iconfe_da {
    font-size: 12px;
  }
  .title {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #666666;
    letter-spacing: 0;
    padding-left: 27px;
    padding-bottom: 27px;
  }
  .pb {
    padding-bottom: 11px;
  }

  .diamond {
    position: relative;
    height: 60px;
    margin-bottom: 27px;
    .sidebar {
      background: #DFDFDF;
      border-radius: 5px;
      width: 15px;
      height: 60px;
      display: inline-block;
      vertical-align: middle;
      line-height: 60px;
      cursor: pointer;
    }
    .sidebar-select {
      background-image: linear-gradient(225deg, #FFC037 0%, #FF7923 100%);
      &:hover {
        background: #FF7923;
      }
    }
    .num {
      position: relative;
      width: 630px;
      height: 60px;
      margin: 0 auto;
      text-align: center;
      overflow: hidden;
      white-space: nowrap;
      &-list {
        position: absolute;
        left: 0;
      }

      &-list__left {
        position: absolute;
        transition: 0.5s;
        transform: translate(-378px);
      }

      &-list__right {
        position: absolute;
        transition: 0.5s;
        transform: translate(0px);
      }

    }
    ul > li {
      width: 114px;
      height: 60px;
      background: #FFFFFF;
      border: 1px solid #E4E4E4;
      border-radius: 4px;
      margin-right: 12px;
      text-align: center;
      cursor: pointer;
      user-select: none;
      position: relative;
      display: inline-block;
      vertical-align: middle;

      p {
        font-family: PingFangSC-Medium;
        font-size: 14px;
        padding-top: 10px;
        color: #FF7D29;
        letter-spacing: 0;
      }
      span {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #666666;
        letter-spacing: 0;
      }
      &:hover {
        border: 1px solid#FF7D29;
      }
    }
    .active {
      border: 2px solid#FF7D29;
      &:hover {
        border: 2px solid#FF7D29;
      }
    }

    li {
      &:last-child {
        background: #FFFFFF;
        border: none;
         &:hover {
          border: none;
        }
      }
    }
    .iconfl_dj1 {
      position: absolute;
      right: -2px;
      top: 37px;
    }
    .other {
      position: relative;
      width: 240px;
      .number {
        font-family: "Microsoft YaHei";
        font-size: 14px;
        height: 60px;
        width: 240px;
        color: #FF7D29;
        border: 1px solid #E4E4E4;
        border-radius: 4px;
        padding-left: 10px;
        cursor: pointer;
        &:hover {
          border: 1px solid#FF7D29;
        }
      }
      &-active {
        border: 2px solid#FF7D29 !important;
        &:hover {
          border: 2px solid#FF7D29;
        }
      }
      .input-number {
        position: absolute;
        top: 18px;
        right: 0;
      }
      .iconfl_dj1 {
        right: 0;
        top: 40px;
      }

      /deep/ .ivu-input {
        height: 58px;
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #FF7D29;
        letter-spacing: 0;
        &:focus {
          box-sizing: border-box;
          border: none;
          box-shadow: none;
        }
      }
    }
    .fl {
      &:first-child {
        margin-right: 12px;
      }
    }
    .ml {
      margin-left: 25px;
    }
    .fr {
      margin-right: 25px;
    }
    .tip {
      font-family: PingFangSC-Regular;
      position: absolute;
      top: -20px;
      right: 108px;
      text-align: left;
      width: 180px;
      display: inline-block;
      span, i {
        color: #FF7D29;
        font-size: 12px;
      }
    }
  }
  .way {
    background: #fff;
    height: 286px;
    margin: 0 30px;
  }
  .btn {
    padding: 28px 0 26px 23px;
    .pay {
      display: inline-block;
      border: 1px solid #E4E4E4;
      width: 112px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      border-radius: 4px;
      box-sizing: content-box;
      cursor: pointer;
      i{
        &:first-child {
          padding-left: 12px;
        }
      }
      span {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #333333;
        padding-left: 5px;
      }
      .pay-alipay {
        padding-left: 9px;
      }
      .fr {
        padding-top: 11px;
        margin-right: -1px;
      }
      &:hover {
        border: 1px solid #FF7D29;
      }
    }
    .active {
      border: 2px solid #FF7D29;
      &:hover {
        border: 2px solid #FF7D29;
      }
    }
    .mr {
      margin-right: 32px;
    }
  }
  .qrcode {
    position: relative;
    text-align: center;
    &-icon {
      position: absolute;
      top: 24%;
      left: 48%;
      &__img {
        width: 30px;
      }
    }
    .img {
      display: inline-block;
      width: 115px;
      height: 115px;
    }
    .mt {
      margin-top: 18px;
    }
    &-error__tip {
      padding-bottom: 29px;
      p {
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #FF7D29;
        letter-spacing: 0;
      }
      span {
        font-family: PingFangSC-Medium;
        font-size: 12px;
        color: #999999;
        letter-spacing: 0;
      }
    }
  }
  .sidebar {
    .iconbp_ee, .iconbq_ee {
      color: #fff;
    }
  }
  
  .iconfh_dj {
    color:#00aef5;
  }
  .iconff_dj {
    color: #41b035;
  }
  
  .iconfg_dj {
    color:#ffc763;
    font-size: 64px;
  } 
  .alipay {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #666666;
    letter-spacing: 0;
    line-height: 20px;
  }
  .error {
    font-family: PingFangSC-Medium;
    color: #FF7D29;
  }
  .iconfl_dj1 {
    color: #ff7d29;
  }
  .iconfi_dj {
    font-size: 64px;
    color: #ffc763;
  }
}
.pay {
  /deep/ .ivu-modal-content {
    width: 430px;
    height: 331px;
    background-color: #fff;
  }
   /deep/ {
    .ivu-modal-body {
      padding: 0
    }
   }
}

.pay {
  .header {
    p {
      font-family: PingFangSC-Regular;
      font-size: 18px;
      color: #666666;
      line-height: 25px;
      padding: 12px;
      width: 150px;
    }
  }
  .fork {
    width: 258px;
  }
  .iconfb_dc {
    color: #999;
  }
  .content {
    border-top: 1px solid #ccc;
    margin: 0px 12px;
    text-align: center;
  }
  &-success {
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

  &-tip {
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
.recharge-close {
  &__icon {
    padding-top: 155px;
    padding-bottom: 35px;
    text-align: center;
  }
  &__tip {
    font-family: "Microsoft YaHei"; 
    display: block;
    font-size: 18px;
    color: #999999;
    letter-spacing: 0px;
    line-height: 25px;
    text-align: center;
  }
}
/deep/ .ivu-spin-fix .ivu-spin-main {
  top: 35%;
}

.open-pay {
  color: #999;
  margin: 7px 0;
  display: inline-block;
  &:hover {
    color: #3683FF;
  }
  .iconbq_ee {
    color: #999;
    font-size: 10px;
  }
}
.rule {
  p {
    width: 100%;
    display: inline-block;
    text-align: right;
    padding-top: 16px;
    padding-right: 30px
  }
  a {
    color: #3683FF;
  }
}
</style>
