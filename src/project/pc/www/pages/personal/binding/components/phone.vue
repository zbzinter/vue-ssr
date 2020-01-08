<template>
  <div class="binding-phone">
    <Form
      ref="formInline"
      label-position="right"
      :model="formItem"
    >
      <FormItem
        class="phone-validate"
        prop="phoneNumber"
      >
        <Input
          v-model="formItem.phoneNumber"
          size="large"
          type="tel"
          clearable
          placeholder="请输入手机号"
          :maxlength="11"
        />
        <span class="phone-validate__flag">+86</span>
      </FormItem>
      <FormItem
        class="code clearfix"
      >
        <Input
          v-model="formItem.phoneCode"
          type="text"
          :maxlength="6"
          class="fl"
          placeholder="请输入短信验证码"
          @on-keyup="formItem.phoneCode = formItem.phoneCode.replace(/[^0-9]/g, '')"
          @on-enter="submit"
        />
        <span
          class="code-num fl"
          :class="codeFlag ? '': 'grey'"
          @click="getCode"
        >{{ codeText }}</span>
      </FormItem>
      <div
        class="error-tip"
      >
        <i
          v-show="errorTip"
          class="iconfont iconex_ei"
        />
        <span>{{ errorTip }}</span>
      </div>
      <Button
        long
        type="primary"
        size="large"
        class="submit"
        @click="submit()"
      >
        下一步
      </Button>
    </Form>
  </div>
</template>
<script>
import { Form, Input, FormItem, Button } from 'iview'
import Http from '@utils/Http'
const http = new Http()

export default {
  components: {
    Form,
    FormItem,
    Input,
    Button,
  },
  props: {
    tokenToBindPhone: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      formItem: {
        // 手机号
        phoneNumber: '',
        // 验证码
        phoneCode: '',
      },
      ruleInline: {
        phoneNumber: [
          {
            required: true,
            validator: this.mobileVerify,
            trigger: 'blur'
          },
        ],
        phoneCode: [
          {
            required: true,
            message: '请输入验证码',
            trigger: 'blur'
          },
        ],
      }
    }
  },
  methods: {
    tagClick(id) {
      if(id === this.curId) return
      this.curId = id
    },
    // 获取验证码
    getCode() {
      this.validateCode({
        phone: this.formItem.phoneNumber,
        type: 1
      })  
    },
    // 验证手机号
    mobileVerify(rule, value, callback) {
      const telRegx = /^1[3456789]\d{9}$/
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else if (!telRegx.test(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    },
    validate() {
      let flag = this.validatePhoneNum()
      return flag
    },

    submit() {
      
      if (!this.validate()) {
        return false
      }
      http.$get('jmfen-sport-passport/auth/bindmobile', {
        apiType: 'gw',
        headers: {
          'Authorization': 'Basic YXBwOmFwcA=='
        },
        body: {
          token: this.tokenToBindPhone,
          mobile: this.formItem.phoneNumber,
          code: this.formItem.phoneCode,
        }
      }).then(res => {
        if(res.code === 100200) {
          const data = res.data || {}
          localStorage.setItem('token', data.token)
          localStorage.setItem('uid', data.uid)
          // localStorage.setItem('userInfo', JSON.stringify(data))
          // 存储store
          // this.G_SetUserInfo(data)
              
          // 更新用户信息
          this.updateUserAndMember({
            uid: data.uid,
            token: data.token
          })

          // 第一次用手机登录，需要设置密码
          if(data.ticket) {
            this.$emit('changeTab', data.ticket, this.formItem.phoneNumber)
          } else {
            this.$success('绑定成功')
            setTimeout(() => {
              window.location.reload()
            }, 500)
          }
        } else {
          this.$error(res.msg)
        }
      })
    },
    
  }
}
</script>
<style lang="postcss" scoped>
@import './../../../../public/personal/login-register.scss';

.binding-phone {
  position: relative;
  margin: 0 63px;
  >>>input {
    border: 1px solid #ddd;
  }
  .phone-code {
    position: absolute;
    right: 10px;
    top: 0;
    height: 36px;
    line-height: 36px;
    cursor: pointer;
  }
}
.submit {
  margin-top: 36px;
}
.error-tip {
  position: absolute;
  top: 105px
}
</style>


