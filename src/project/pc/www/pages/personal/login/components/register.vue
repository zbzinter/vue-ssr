<template>
  <div class="register-form">
    <p class="register-title">
      快速注册
    </p>
    <div class="login-main">
      <Form
        ref="loginForm"
        label-position="right"
        :model="formItem"
        
        :label-width="0"
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
          />
          <span
            class="code-num fl"
            :class="!codeFlag ? '': 'grey'"
            @click="getCode"
          >{{ codeText }}</span>
        </FormItem>
        <FormItem
          class="password"
          prop="password"
        >
          <Input
            v-model="formItem.password"
            type="password"
            :maxlength="20"
            placeholder="请设置6-20位字母数字组合密码"
            @on-enter="submit"
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
          type="primary"
          class="submit"
          @click="submit()"
        >
          登录
        </Button>
      </Form>
      <div class="copyright">
        <p>
          使用即为同意<a
            href="/rules/user-policy?flag=1"
            target="_blank"
          >《用户服务协议》</a>和<a
            href="/rules/user-policy?flag=2"
            target="_blank"
          >《隐私政策》</a>
        </p>
      </div>
      <div class="quick-register">
        <p @click="returnLogin">
          返回账号登录>
        </p>
      </div>
    </div>
    <div
      v-if="codeSuccess"
      class="code-success"
    >
      验证码已发送
    </div>
  </div>
</template>
<script>
import { Form, Input, FormItem, Button } from 'iview'
import {mapActions} from 'vuex'
import Http from '@utils/Http'
const http = new Http()

export default {
  components: {
    Form,
    FormItem,
    Input,
    Button,

  },
  data() {
    return {
     
      formItem: {
        // 手机号
        phoneNumber: '',
        // 密码
        password: '',
        // 验证码
        phoneCode: '',
      },
      errorTip: '',
      codeFlag: false,
    
    }
  },
  methods: {
    ...mapActions([
      'GainAndJudgeAnchors',
    ]),
   
    // 发送验证码
    getCode() {
      if (!this.formItem.phoneNumber) {
        this.errorTip = '请输入手机号'
        return false
      }
      const telRegx = /^1[3456789]\d{9}$/
      if (!telRegx.test(this.formItem.phoneNumber)) {
        this.errorTip = '请输入正确的手机号'
        return false
      }

      http.$get('jmfen-sport-usercenter/app/send/code', {
        apiType: 'gw',
        headers: {
          'Authorization': 'Basic YXBwOmFwcA=='
        },
        body: {
          phone: this.formItem.phoneNumber,
          type: 0,        
        }
      }).then((res) => {
        const { code, msg } = res
        if (this.$judgeCode(code)) {
          this.codeFlag = true
          this.codeSuccess = true
          let timer = setInterval(() => {
            this.totalTime--
            this.codeText = `重新获取(${this.totalTime}s)`
            this.codeFlag = true
            if (this.totalTime <= 0) {
              clearInterval(timer)
              this.codeText = '重新获取'
              this.codeFlag = false
              this.totalTime = 60
            }
          }, 1000)
        } else {
          this.errorTip = msg
        }
      })
    },
    // 忘记密码
    forgetPwd() {
      this.G_SetLogin(false)
      this.$router.push({
        path: '/forget-password'
      })
    },

    validate() {
      if (!this.formItem.phoneNumber) {
        this.errorTip = '请输入手机号'
        return false
      }

      const telRegx = /^1[3456789]\d{9}$/
      if (!telRegx.test(this.formItem.phoneNumber)) {
        this.errorTip = '请输入正确的手机号'
        return false
      }

      if (!this.formItem.phoneCode) {
        this.errorTip = '请输入验证码'
        return false
      }

      const pwdFlag = this.newPwdVerifyHelper(this.formItem.password)

      return pwdFlag
    },

    submit() {
      if (!this.validate()) {
        return
      }
      http.$get('jmfen-sport-passport/app/login', {
        apiType: 'gw',
        headers: {
          'Authorization': 'Basic YXBwOmFwcA=='
        },
        body: {
          reg: 1,
          userName: this.formItem.phoneNumber,
          passWord: this.formItem.password,
          code: this.formItem.phoneCode,
        }
      }).then(res => {
        if(res.code === 100200) {
          const data = res.data || {}
          this.$success('注册成功')
          localStorage.setItem('token', data.token)
          localStorage.setItem('uid', data.uid)

          setTimeout(() => {
            window.location.reload()
          }, 2000)
          // 兼容im 订阅，先刷新
              
          // // 别删除
          // // 更新用户信息
          // this.updateUserAndMember({
          //   uid: data.uid,
          //   token: data.token
          // })
          // // 关闭弹层
          // this.G_SetLogin(false)
          // this.GainAndJudgeAnchors({uids: data.uid, vm: this})
        
        } else {
          this.errorTip = res.msg
        }
      })
    },

    returnLogin() {
      this.$emit('returnLogin', 1)
    }
    
  }
}
</script>
<style lang="postcss" scoped>
@import './../../../../public/personal/common.scss';
@import './../../../../public/personal/login-register.scss';

.register {
  &-form {
    position: relative;
    padding: 12px 40px 0 33px;
    margin: 15px 0;
    border-right: 1px solid #D8D8D8;
    height: 346px;
  }

  &-title {
    font-family: PingFangSC-Semibold;
    font-size: 20px;
    color: #666666;
    font-weight:600;
    line-height: 25px;
    margin-bottom: 18px;
  }
}

.code {
  height: 40px;
}

.quick-register {
  color: #666666;
  margin-top: -10px;
}
.password {
  margin-bottom: 10px;
}
.code-success {
  top: 140px;
  left: 73px;
}
</style>


