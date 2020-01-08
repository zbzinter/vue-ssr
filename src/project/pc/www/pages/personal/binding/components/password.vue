<template>
  <div class="set-password">
    <Form
      ref="passwordForm"
      label-position="right"
      :model="formItem"
    >
      <FormItem
        key="password"
        prop="password"
      >
        <Input
          v-model="formItem.password"
          size="large"
          type="password"
          :maxlength="20"
          placeholder="请设置6-20位字母数字组合密码"
        />
      </FormItem>
      <FormItem class="mb">
        <Input
          v-model="formItem.comfirmPassword"
          size="large"
          type="password"
          :maxlength="20"
          placeholder="请再次输入密码"
        />
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
    ticket: {
      type: String,
      default: ''
    },
    phoneNumber: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      formItem: {
        // 密码
        password: '',
        // 确认密码
        comfirmPassword: '',
      },
    }
  },
  methods: {
    validate() {
      let flag = this.newPwdVerifyHelper(this.formItem.password, this.formItem.comfirmPassword)
      return flag
    },

    newPwdVerifyHelper(value, value2) {
      const pwdReg = new RegExp('^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$')
      if (!value || !pwdReg.test(value)) {
        this.errorTip = '请设置6-20位字母数字组合密码'
        return false
      }
      if (!value2) {
        this.errorTip = '请输入确认密码'
        return false
      }
      if (value !== value2) {
        this.errorTip = '两次密码不一致，请重新输入'
        return false
      }
      return true
    },

    submit() {
      if (!this.validate()) {
        return false
      }
      http.$get('jmfen-sport-usercenter/app/setpwd', {
        apiType: 'gw',
        headers: {
          'Authorization': 'Bearer ' + this.tokenToBindPhone
        },
        body: {
          userName: this.phoneNumber,
          passWord: this.formItem.password,
          ticket: this.ticket,
        }
      }).then(res => {
        if(res.code === 100200) {
          this.$success('密码设置成功')
          this.$emit('closeBindbox')
        } else {
          this.$error(res.msg)
        }
      })
    },
    
  }
}
</script>
<style lang="scss" scoped>
@import './../../../../public/personal/login-register.scss';
.set-password {
  position: relative;
  margin: 0 50px;
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
.errorTip {
  position: absolute;
}

.submit {
  margin-top: 5px;
}
.mb {
  margin-bottom: 5px;
}
</style>


