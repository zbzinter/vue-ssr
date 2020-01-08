<template>
  <div class="beans sec-operate">
    <div class="tab">
      <div @click="returnParent">
        <i class="iconfont iconfj_dj" /> 
        <i class="iconfont iconfk_dj" />
        <p>球豆提现</p>
      </div>
    </div>
    <div class="content">
      <Balance />
      <span
        v-if="authUrl"
        class="tip"
      >您还未绑定支付吧，绑定支付宝后可直接提现！</span>
      <Button
        v-if="authUrl"
        type="warning"
        class="bt-width"
        @click="goBindAlipay"
      >
        去绑定
      </Button>
      <div v-if="!authUrl">
        <Button
          type="warning"
          class="bt-width"
          @click="goWithdraw"
        >
          去提现
        </Button>

        <div class="top">
          <Poptip
            trigger="hover"
            placement="top-start"
            content="content"
          >
            <span class="block rule">《提现说明》</span>
            <div
              slot="content"
              class="pop-content"
            >
              <div class="desc">
                提现说明
              </div>
              <p>
                1、提现到账时间：
              </p>
              <span>
                通常情况下提交提现后24-48小时到账，请各位球友耐心等待哦；
              </span>
              <p>
                2、首次提现只需50,000球豆，可以提现5元，后续提现最少需要100,000球豆以上，最低提现金额为10元；
              </p>
              <p>
                3、提现金额分为10元、20元、30元三档，对应消耗的球豆为10万、20万、30万，每次提现时您可以选择所需的一档提现额度，剩余球豆可以在下次满足前述提现额度时再提现。
              </p>
              <p>
                4、每日只允许提现3次
              </p>
            </div>
          </Poptip>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Button, Poptip } from 'iview'
import Balance from './components/balance-beans'

export default {
  components: {
    Button,
    Balance,
    Poptip
  },
  data() {
    return {
      authUrl: '',
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.$get('v2/pay/alipay/web/ouath',  {
        apiType: 'goShop',
        body: {
          user_id: this.getUserInfo().uid,
          return_url: window.location.href
        }
      })
        .then((res) => {
          const {code , data: {
            auth_url
          }, msg} = res
          if (this.$judgeCode(code)) {
            this.authUrl = auth_url
          } else {
            this.msg.error(msg)
          }
        })
    },

    returnParent() {
      this.$router.push({
        path: '/personal/property/index',
      })  
    },

    goBindAlipay() {
      window.open(this.authUrl)
    },

    goWithdraw() {
      this.$router.push({
        path: '/personal/property/withdraw/details',
      })  
    }
  
  }
}
</script>
<style lang="scss" scoped>
@import './../../../public/personal/btn.scss';
@import './../../../public/personal/form.scss';
@import './../../../public/personal/sec-operate.scss';

.beans {
  .content {
    padding: 0 40px;
  }
}
.tip {
  display: block;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #666660;
  padding-bottom: 9px;
}
.rule {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  margin-top: 8px;
  color: #FFA029;
  letter-spacing: 0;
  line-height: 20px;
  width: 100px;
  text-align: center;
}

/deep/ {
  .ivu-poptip-popper {
    width: 324px;
    background: #fff;
  }
  .ivu-poptip-title {
    padding: 12px 16px 20px 16px;
  }
  .ivu-poptip-body {
    padding: 0px 16px 0 16px;
  }
  .ivu-poptip-body-content {
    overflow: hidden;
  }
  .pop-content {
    width: 292px;
    .desc {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #333333;
      font-weight: 600;
      text-align: center;
      padding: 12px 0 20px 0;
    }
    p, span {
      font-family: PingFangSC-Regular;
      display: block;
      font-size: 14px;
      color: #333333;
      line-height: 24px;
      padding-bottom: 10px;
      word-break: break-all;
      white-space: normal;
    }
  }
}
</style>


