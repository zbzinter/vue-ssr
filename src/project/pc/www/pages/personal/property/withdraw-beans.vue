<template>
  <div class="sec-operate">
    <div class="tab">
      <div @click="returnParent">
        <i class="iconfont iconfj_dj" /> 
        <i class="iconfont iconfk_dj" />
        <p>球豆提现详情</p>
      </div>
    </div>
    <div class="content">
      <Balance />
      <div class="selector">
        <span class="tip block">请选择提现金额</span>
        <div class="money-item">
          <ul class="clearfix">
            <li
              v-for="(item, index) in moneyList"
              :key="index"
              class="fl"
              :class="selectActive === index ? 'active' : ''"
              @click="selectMoney(index, item)"
            >
              <p>
                {{ item.key }}元
              </p>
              <span class="block">
                价值：{{ item.value }}球豆
              </span>
             
              <svg
                v-if="index === 0 && item.key === 5"
                class="svg-icon iconfont first-tip"
                aria-hidden="true"
              >
                <use xlink:href="#iconweb_icon_xsc" />
              </svg>

              <i
                v-if="selectActive === index"
                class="iconfont iconfl_dj1"
              />
            </li>
          </ul>
        </div>
      </div>
      <Form
        class="form"
        label-position="left"
      >
        <FormItem
          label="真实姓名："
        >
          <span class="desc">{{ commUserInfo.trueName || '-' }}</span>
        </FormItem>
        <Code ref="code" />
        <FormItem
          label="     "
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
    </div>
  </div>
</template>
<script>
import { Button, FormItem, Form } from 'iview'
import Code from '@src/components/personal/code'
import { mapActions } from 'vuex'
import Balance from './components/balance-beans'


export default {
  components: {
    Balance,
    Button,
    Code,
    FormItem,
    Form, 
  },
  data() {
    return {
      form: {
        code: '',
      },
      selectActive: 0,
      moneyList: [],
    }
  },
  created() {
    this.init()
  },
  methods: {
    ...mapActions(['CheckCode']),

    returnParent() {
      this.$router.push({
        path: '/personal/property/withdraw',
      })
    },

    init() {
      this.$get('v2/members/beans/config', {
        apiType: 'goShop',
        body: {
          user_id: this.getUserInfo().uid
        }
      }).then((res) => {
        const {data} = res
        if (data && Array.isArray(data) && data.length) {
          this.moneyList = []
          this.$nextTick(() => {
            this.moneyList = data
          })
          this.money = data[0].key
          this.beans = data[0].value
        }
      })
    },

    selectMoney(index, item) {
      this.selectActive = index
      this.money = item.key
      this.beans = item.value
    },

    validate() {
      this.form.code = this.$refs.code.getInputCode()
      const text = '必填项不能为空'
      let flag = true
      Object.keys(this.form).forEach(item => {
        if (this.form[item] === '') {
          this.msg.warn(text)
          flag = false
          return flag
        }
      })
    
      return flag
    },

    submit() {
      if (!this.validate()) {
        return 
      }

      this.CheckCode({param: {
        phone: this.commUserInfo.mobile,
        code: this.form.code,
        type: 4
      }, vm: this})
        .then((isCorrect) => {
          if (isCorrect) {
            this.withdraw()
          } else {
            this.msg.error('验证码错误')
          }
        })
    },

    withdraw() {
      this.$post('v2/members/beans/add', {
        apiType: 'goShop',
        body: {
          user_id: this.getUserInfo().uid,
          mobile: this.commUserInfo.mobile,
          platform: 'web',
          money: this.money,
          beans_total: this.beans
        }
      }).then((res) => {
        if (this.$judgeCode(res.code)) {
          this.msg.success('提交成功！您的提现申请已提交，48小时内将会打入您的账户，请注意查收。')
          const timer = setTimeout(() => {
            this.returnParent()
            clearTimeout(timer)
          }, 2000)
        } else {
          this.msg.error(res.msg)
        }
      }).catch(() => {
        this.msg.error('提现失败')
      })
    },
  }
}
</script>
<style lang="scss" scoped>
@import './../../../public/personal/btn.scss';
@import './../../../public/personal/form.scss';
@import './../../../public/personal/sec-operate.scss';
.balance {
  padding-left: 40px;
}
.form {
  padding-left: 40px;
  padding-top: 0px;
  margin-top: -10px;
}

/deep/{
  .ivu-form .ivu-form-item-label {
      padding: 10px 0px 10px 0;
  }
  .ivu-form-item-label {
    min-width: 60px;
  }
}
.selector {
  padding-left: 40px;
  .tip {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    line-height: 12px;
    color: #666660;
    padding-bottom: 10px;
  }
  ul {
    height: 81px;
    margin-bottom: 30px;
  }
  ul > li {
    height: 81px;
    margin-right: 20px;
    background: #F7F7F7;
    border: 2px solid #fff;
    border-radius: 4px;
    position: relative;
    cursor: pointer;
    &:hover {
      border: 2px solid #FFA029;
    }
    p {
      font-family: PingFangSC-Semibold;
      font-size: 24px;
      line-height: 33px;
      color: #FFA029;
      letter-spacing: 0;
      text-align: center;
      padding: 9px 0 7px 0;
    }
    span {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #666666;
      letter-spacing: 0;
      text-align: center;
      padding: 0 10px;
    }
  }
  .active {
    border: 2px solid #FFA029;
  }
}
.iconfl_dj1 {
  position: absolute;
  bottom: -3px;
  right: -2px;
  color: #FFA029;
}
.first-tip {
  position: absolute;
  top: -2px;
  left: -2px;
  width: 32px;
}
</style>


