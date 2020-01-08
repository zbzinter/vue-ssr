<template>
  <div class="sec-operate">
    <div class="tab">
      <div @click="returnParent">
        <i class="iconfont iconfj_dj" /> 
        <i class="iconfont iconfk_dj" /> 
        <p>收益兑换</p>
      </div>
    </div>
    <div
      style="padding-left: 62px;"
      class="pt"
    >
      <Balance />
    </div>
    <Form
      class="form"
      label-position="right"
      :label-width="110"
    >
      <Identity />
      <FormItem
        label="开户银行："
      >
        <span class="desc">{{ bankName || '-' }}</span>
        <span
          class="warn-tip"
          @click="changeBank"
        >修改账户</span>
      </FormItem>
      <FormItem
        label="兑换金额："
      >
        <Input
          v-model="formItem.money"
          :maxlength="100000"
          type="text"
          style="width:300px"
          placeholder="请输入兑换金额"
        />
        <span class="block tip">兑换金额必须为 <span>整数且不低于100元</span>。由于扣税银行转账手续费等因素，请以实际到账金额为准。</span>
      </FormItem>
      <Code ref="code" />
      <FormItem
        label=""
      >
        <Button
          class="bt-width"
          type="warning"
          @click="submit()"
        >
          立即提交
        </Button>
      </FormItem>
    </Form>
    <div
      v-if="errorTip"
      class="error-tip"
      :class="tip ? 'warn': 'err' "
    >
      {{ errorTip }}
    </div>
    <div
      v-if="successTip"
      class="success-tip"
    >
      {{ successTip }}
    </div>
  </div>
</template>
<script>
import { Button, Input,Form, FormItem } from 'iview'
import { mapActions } from 'vuex'
import Code from '@src/components/personal/code'
import Balance from './components/balance'
import Identity from './components/identity'

export default {
  components: {
    Button,
    Input,
    Form, 
    FormItem,
    Balance,
    Identity,
    Code
  },
  data() {
    return {
      formItem: {
        bankName: '',
        bankAccount: '',
        userName: '',
        money: '',
        code: ''
      },
      bankName: '',
      timeHelper: null,
      errorTip: '',
      tip: false,
      successTip: '',
    }
  },
  watch: {
    'formItem.money': function (val) {
      clearTimeout(this.timeHelper)
      if (val) {
        this.formItem.money = this.formItem.money.replace(/^0/g, '')
        this.timeHelper = setTimeout(() => {
          this.formItem.money = this.formItem.money.replace(/[^0-9]/g, '')
        }, 1000)
      } 
    },
  },
  created() {
    this.init()
  },

  methods: {
    ...mapActions(['GetBankInfo', 'CheckCode']),
    init() {
      this.GetBankInfo({ id: this.getUserInfo().uid, vm: this })
        .then((data) => {
          this.formItem.bankName = data.bank_name
          this.bankName = data.bank_name + data.bank_address +  data.bank_subbranch
          this.formItem.bankAccount = data.bank_account
          this.formItem.userName = data.bank_username
        })
    },

    validate() {
      if (!this.formItem.money) {
        this.tip = false
        this.errorTip = '必填项不能为空'
        return
      }

      if (Number(this.formItem.money) > Number(this.$store.getters.getBalance)) {
        this.tip = true
        this.errorTip = '余额不足'
        return
      }
      if (Number(this.formItem.money) < 100) {
        this.tip = true
        this.errorTip = '最低兑换金额为100元'
        return
      }

      this.formItem.code = this.$refs.code.getInputCode()
      if (!this.formItem.code) {
        this.tip = false
        this.errorTip = '必填项不能为空'
        return
      }
     
    },

    submit() {
      
      this.validate()
      if (this.errorTip) {
        return 
      }
      this.CheckCode({param: {
        phone: this.commUserInfo.mobile, 
        code: this.formItem.code,
        type: 4
      }, vm: this})
        .then((isCorrect) => {
          if (isCorrect) {
            this.rechangeIncome()
          } else {
            this.errorTip = '验证码错误'
          }
        })
    },

    rechangeIncome() {
      this.$post('v2/cashs/add/' + this.getUserInfo().uid, {
        apiType: 'goShop',
        body: {
          user_id: this.getUserInfo().uid,
          mobile: this.commUserInfo.mobile,
          platform: 'web',
          cashout_type: 'anchor',
          cashout_way: 'bank_transfer',
          bank_name: this.formItem.bankName,
          bank_account: this.formItem.bankAccount,
          bank_username: this.formItem.userName,
          money: Number(this.formItem.money)
        }
      }).then((res) => {
        if (this.$judgeCode(res.code)) {
          this.successTip = '提交成功！您的提现申请已提交，审核通过后将在下个月10号打入您的账户，请注意查收。'
          setTimeout(() => {
            window.location.reload()
          }, 3000)
        } else {
          this.tip = false
          this.errorTip = res.msg
        }
      }).catch(() => {
        this.tip = false
        this.errorTip = '出错了，请稍候重试'
      })
    },

    returnParent() {
      this.$parent.flag = true
    },

    changeBank() {
      this.$parent.goBindCard(1)
    },
  }
}
</script>
<style lang="scss" scoped>
@import '../style/index.scss';
@import './../../../../public/personal/form.scss';
@import './../../../../public/personal/sec-operate.scss';

.tab {
  p {
    padding-left: 6px;
  }
}
.form {
  padding-top: 20px;
  padding-left: 35px;
}
.tip {
  color: #999;
  span {
    color: #151515;
  }
}
.error-tip {
  top: 50%;
  left: 50%;
  margin-top: -16px;
  margin-left: -40px;
}
.warn {
  background: #E16F28;
}
.warn-tip {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #FFA029;
  padding-left: 8px;
  cursor: pointer;
}

</style>


