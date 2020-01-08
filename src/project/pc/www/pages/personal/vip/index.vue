<template>
  <div>
    <UserInfo />
    <div class="personal-vip">
      <div class="big-title">
        开通会员 <span class="dot">·</span> 尊享特权
      </div>
      <div class="content clearfix">
        <div
          v-for="(item, index) in vipPackageData"
          :key="index"
          class="vip-equity"
          :class="{
            'vip-year': item.duration == 12,
            'cur': item.id == selectedVipItem.id
          }"
          @click="selectVipPackage(item)"
        >
          <div class="top">
            <span class="name">{{ item.name }}</span>
            <div class="icon">
              <i class="iconfont sub icon1 iconbs_cf" />
              <img
                class="sub icon2"
                src="../../../assets/personal/bt_cg.png"
                alt=""
              >
            </div>
          </div>
          <div class="center">
            <div
              v-for="(subItem, subIndex) in (item.duration == 12 ? vipPlusList : vipList)"
              :key="subIndex"
              class="opt"
            >
              <svg
                class="svg-icon"
                aria-hidden="true"
              >
                <use :xlink:href="subItem.icon" />
              </svg>
              <p>{{ subItem.name }}</p>
            </div>
          </div>
          <div class="bottom">
            <b class="number"><small>¥</small>{{ parseInt(item.price) }}</b>
            <span class="line">/</span>
            <span class="m">{{ item.duration }}个月</span>
          </div>
        </div>
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
        <span class="price"><small>￥</small>{{ parseInt(selectedVipItem.price || 0) }}</span>
      </div>

      <Button
        class="go-pay"
        :loading="loading"
        @click="goPay()"
      >
        去支付
      </Button>
    </div>
  </div>
</template>
<script>
import { Button } from 'iview'
import UserInfo from '@src/components/personal/user-info'
export default {
  components: {
    UserInfo,
    Button,
  },
  data() {
    return {
      // 支付方式-默认支付宝
      payType: 'alipay',
      // 会员套餐
      vipPackageData: [],
      // 选中的套餐-默认第一个
      selectedVipItem: {},
      // 微信支付二维码连接
      qrcodeLink: '',
      // 支付loading
      loading: false,
      // 普通会员内容
      vipList: [
        {
          name: '视频直播',
          icon: '#icondu_aj'
        },
        {
          name: '专属情报',
          icon: '#icondv_aj'
        },
        {
          name: '会员标识',
          icon: '#icondw_aj'
        },
        {
          name: '更多积分',
          icon: '#icondz_aj'
        },
        {
          name: '会员入场',
          icon: '#icondy_aj'
        },
        {
          name: '无限改名',
          icon: '#icondx_aj'
        },
        {
          name: '绑定客服',
          icon: '#iconea_aj'
        },
      ],
      // 年会会员内容
      vipPlusList: [
        {
          name: '昵称彩名',
          icon: '#iconeb_aj'
        },
        {
          name: '高清直播',
          icon: '#iconec_aj'
        },
        {
          name: '专属情报',
          icon: '#iconei_aj'
        },
        {
          name: '会员标识',
          icon: '#iconed_aj'
        },
        {
          name: '更多积分',
          icon: '#iconeg_aj'
        },
        {
          name: '会员入场',
          icon: '#iconef_aj'
        },
        {
          name: '无限改名',
          icon: '#iconee_aj'
        },
        {
          name: '绑定客服',
          icon: '#iconeh_aj'
        },
      ]
    }
  },
  created() {
    this.getVipEquityDesc()
  },
  methods: {
    // 会员套餐
    getVipEquityDesc() {
      this.$get('/api/v1/user.php?do=vippackage', {
        apiType: 'shop',
        body: {
          user_id: this.getUserInfo().uid
        }
      }).then(res => {
        const { code, data } = res
        if (code == '200') {
          this.vipPackageData = data.vip || []
          this.selectVipPackage(this.vipPackageData[0] || {})
        }
      })
    },
    // 选择vip套餐
    selectVipPackage(data) {
      this.selectedVipItem = data
    },
    // 选择支付方式
    checkPay(payType) {
      this.payType = payType
    },
    //支付套餐
    goPay() {
      // loading
      this.loading = true
      this.$post('/api/v1/user.php?do=vipcreate',{
        apiType: 'shop',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: {
          user_id: this.getUserInfo().uid,
          vip_id: this.selectedVipItem.id,
          alipay_return_url: window.location.origin,
          platform: 'web'
        }
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
    }
  }
}
</script>
<style lang="postcss" scoped>
.personal-vip {
  padding: 0 0 50px 40px;
  .big-title {
    font-size: 16px;
    color: #333;
    padding: 18px 0 20px 0;
    font-weight: bold;
    .dot {
      font-size: 12px;
    }
  }
  .content {
    .vip-equity {
      display: inline-block;
      width: 288px;
      margin-right: 20px;
      padding-top: 12px;
      transition: all 0.3s;
      background-image: linear-gradient(
        115deg,
        #bf955c 0%,
        #d9ae72 35%,
        #c69a52 35%,
        #e8c283 71%,
        #ddb169 71%,
        #dfba7d 100%
      );
      border: 2px solid #EFB569;
      border-radius: 8px;
      &.cur {
        transform: scale(1.02);
        box-shadow: 0 6px 24px 0 rgba(109,81,17,0.64);
        .top {
          .icon .sub {
            &.icon1 {
              display: none;
            }
            &.icon2 {
              display: block;
            }
          }
        }
      }
      .top {
        height: 22px;
        line-height: 22px;
        padding: 0 12px;
        .name {
          float: left;
          font-size: 14px;
          color: #FFFFFF;
        }
        .icon {
          float: right;
          cursor: pointer;
          .icon2 {
            width: 22px;
            height: 22px;
          }
          .sub {
            font-size: 22px;
            color: #fff;
            &.icon1 {
              display: block;
            }
            &.icon2 {
              display: none;
            }
          }
        }
      }
      .center {
        overflow: hidden;
        padding-left: 20px;
        padding-bottom: 30px;
        .opt {
          width: 80px;
          float: left;
          text-align: center;
          margin: 26px 0 0 0;
          .svg-icon {
            width: 52px;
            height: 52px;
          }
          p {
            font-size: 12px;
            color: #FFFFFF;
            line-height: 1;
            margin-top: 10px;
          }
        }
      }
      .bottom {
        height: 48px;
        line-height: 48px;
        text-align: center;
        background: linear-gradient(to right, #FFFAEE , #F0D9BB);
        border-radius: 0 0 6px 6px;
        b {
          font-size: 32px;
          font-weight: bold;
          color: #6D5111;
          vertical-align: middle;
          small {
            font-size: 20px;
          }
        }
        .line {
          font-size: 20px;
          color: #6D5111;
          vertical-align: middle;
        }
        .m {
          font-size: 16px;
          color: #6D5111;
          vertical-align: bottom;
        }
      }
    }
    .vip-year {
      background-image: linear-gradient(
        115deg,
        #232426 0%,
        #36363a 35%,
        #2f3033 35%,
        #3e3e43 71%,
        #37373b 71%,
        #252528 100%
      );
      border: 2px solid #efb569;
      border-radius: 8px;
      .top {
        .name {
          color: #E7C06A;
        }
      }
      .center .opt {
        &:nth-child(1),
        &:nth-child(2) {
          p {
            color: #F8C480;
          }
        }
        p {
          color: #8F714B;
        }
      }
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
    color: #333333;
    .price {
      margin-left: 20px;
      font-size: 30px;
      font-weight: bold; 
      small {
        font-size: 20px;
      }
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