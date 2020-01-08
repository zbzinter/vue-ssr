<template>
  <div class="login-form login-register">
    <ul class="login-mode clearfix">
      <li
        v-for="item in tag" 
        :key="item.id"
        :class="{cur: curId === item.id}"
        @click="tagClick(item.id)"
      >
        <span>{{ item.title }}</span>
      </li>
    </ul>
    <div class="login-main">
      <Form
        ref="loginForm"
        label-position="right"
        :model="formItem"
        :label-width="0"
      >
        <FormItem
          v-if="curId === 1"
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
          v-if="curId === 2"
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
        </FormItem>
        
        <FormItem
          v-if="curId === 1"
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
        <FormItem
          v-if="curId === 2"
          class="password-mb"
          prop="password"
        >
          <Input
            v-model="formItem.password"
            size="large"
            type="password"
            :maxlength="20"
            placeholder="请输入密码"
            @on-enter="submit"
          />
        </FormItem>
        <div class="clearfix">
          <div class="fl cb">
            <Checkbox v-model="formItem.checkbox">
              一周自动登录
            </Checkbox>
          </div>
          <div
            v-if="curId === 2"
            class="fr forget-pwd"
            @click="forgetPwd"
          >
            忘记密码?
          </div>
        </div>
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
        <p @click="register">
          快速注册>
        </p>
      </div>
    </div>
    <span
      v-if="codeSuccess"
      class="code-success"
    >
      验证码已发送
    </span>
  </div>
</template>
<script>
import { Form, Input, FormItem, Button, Checkbox } from 'iview'
import {mapActions} from 'vuex'
import LoginService  from '@service/login'

export default {
  components: {
    Form,
    FormItem,
    Input,
    Button,
    Checkbox
  },
  data() {
    return {
      // 手机登录 密码登录
      curId: 1,
      tag: [
        {
          id: 1,
          title: '手机验证码登录',
        },
        {
          id: 2,
          title: '账号密码登录',
        },
      ],
      formItem: {
        // 手机号
        phoneNumber: '',
        // 密码
        password: '',
        // 验证码
        phoneCode: '',
        // 一周自动登录
        checkbox: true,
      },
      errorTip: '',
      codeFlag: false,
    }
  },
  watch: {
    'formItem.phoneNumber': {
      handler: function(val) {
        if (val && Number(String(val).length) === 11) {
          this.codeFlag = true
        } else {
          this.codeFlag = false
        }
      },  
      deep: true,
    }
  },
  methods: {
    ...mapActions([
      'G_GetUserInfo',
    ]),
    tagClick(id) {
      if(id === this.curId) return
      this.curId = id
      this.formItem = {
        // 手机号
        phoneNumber: '',
        // 密码
        password: '',
        // 验证码
        phoneCode: '',
        // 一周自动登录
        checkbox: true,
      }
    },
    // 发送验证码
    async getCode() {
      if (!this.codeFlag) {
        return
      }
      
      const code = await this.getPhoneCode({
        phone: this.formItem.phoneNumber,
        type: 1
      })
      let timer = setInterval(() => {
        this.totalTime--
        this.codeText = `重新获取(${this.totalTime}s)`
        this.codeFlag = false
        if (this.totalTime <= 0) {
          clearInterval(timer)
          this.codeText = '重新获取'
          this.codeFlag = true
          this.totalTime = 60
        }
      }, 1000)
      
    },
    // 忘记密码
    forgetPwd() {
      this.G_SetLogin(false)
      this.$router.push({
        path: '/forget-password'
      })
    },

    validate() {
      const telRegx = /^1[3456789]\d{9}$/
      if (!telRegx.test(this.formItem.phoneNumber)) {
        this.errorTip = '请输入正确的手机号'
        return false
      }

      if (this.curId === 2) {
        if (!this.formItem.password) {
          this.errorTip = '请输入密码'
          return false
        }
      }
      
      if (this.curId === 1) {
        if (!this.formItem.phoneNumber) {
          this.errorTip = '请输入正确的手机号'
          return false
        }
        if (!this.formItem.phoneCode) {
          this.errorTip = '请输入验证码'
          return false
        }
      }
      return true
    },

    submit() {
      if (!this.validate()) {
        return
      }
      LoginService.login({
        userName: this.formItem.phoneNumber,
        passWord: this.formItem.password,
        code: this.formItem.phoneCode,
      }).then((res) => {
        const {code, data, msg} = res
        if (this.$judgeCode(code) && data.token) {
          this.$success('登录成功')
          localStorage.setItem('token', data.token)
          localStorage.setItem('uid', data.uid)

          this.G_GetUserInfo({uid: data.uid, token: data.token})
            .then(() => {
              // this.reloadPage(500)
              this.G_SetLogin(false)
            })
            .catch(() => {
              // this.reloadPage(500)
              this.G_SetLogin(false)
            })
        } else {
          this.errorTip = msg
        }
      }).catch(() => {
        this.errorTip = '请稍后重试'
      })
     
     
    
    },

    reloadPage(param) {
      const timer = setTimeout(() => {
        clearTimeout(timer)
        window.location.reload()
      }, param)
    },
    
    register() {
      this.$emit('register', 2)
    }
  }
}
</script>
<style lang="postcss" scoped>
@import './../../../../public/personal/common.scss';
@import './../../../../public/personal/login-register.scss';

.login-form {
  padding:18px 40px 0 33px;
  margin: 15px 0;
  border-right: 1px solid #D8D8D8;
  height: 346px;
  .login-mode {
    padding-bottom: 35px;
    li {
      font-family: PingFangSC-Semibold;
      float: left;
      padding: 0 10px 0 0;
      font-size: 20px;
      line-height: 25px;
      cursor: pointer;
      span {
        font-weight: 500;
      }
      &:first-child {
        border-right: 1px solid #eee;
      }
      &:last-child {
        padding-left: 10px;
      }
      &.cur {
        color: #3683ff;
      }
      &:hover {
        color: #3683ff;
      }
    }
  }
  .login-main {
    .forget-pwd {
      cursor: pointer;
      padding-top: 10px;
      color: #999;
    }
  }
}

.code {
  height: 20px;
}
.cb {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  margin-top: 10px;
  line-height: 20px;
  letter-spacing: 0;
  color: #999999;
}

.ic_checked_cf {
  display: inline-block;
  width: 14px;
  height: 14px;
  background: url(../../../../assets/score/football/bt_cg.png) center center
    no-repeat;
  background-size: 100% auto;
  background-repeat: no-repeat;
}
.iconbs_cf {
  font-family: "iconfont";
  font-size: 14px;
}

/deep/ .ivu-checkbox {
  &.ivu-checkbox-checked {
    width: 14px;
    height: 14px;
    .ivu-checkbox-inner {
      border: 0;
      background-color: transparent;
      @extend .ic_checked_cf;
      &:after {
        display: none;
      }
      &:before {
        display: none;
      }
    }
  }
  .ivu-checkbox-focus {
    box-shadow: none;
  }
  .ivu-checkbox-inner {
    transition: none;
    background-color: transparent;
    border: 0;
    width: 14px;
    height: 14px;
    @extend .iconbs_cf;
    &:before {
      content: "\e632";
    }
  }
}

.quick-register {
  color: #3683FF;
}
.password-mb {
  margin-bottom: 0px;
}
.login-register {
  position: relative;
  .code-success {
    top: 165px;
    left: 75px;
  }
}


</style>


