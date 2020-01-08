<template>
  <div class="change-phone">
    <div
      v-if="!flag"
      class="form"
    >
      <div class="form-group">
        <span class="tip">请设置新手机号</span>
      </div>
      <div class="form-group">
        <label
          for=""
          class="tit"
        >手机号：</label>
        <div class="cont phone-number">
          <Input
            v-model="formItem.phoneNumber"
            type="text"
            clearable
            placeholder="请输入要绑定的手机号码"
            :maxlength="11"
          />
          <span class="num-flag">
            +86
          </span>
        </div>
      </div>
    
      <div class="form-group">
        <label
          class="tit"
        >验证码：</label>
        <div class="cont code">
          <Input
            v-model="formItem.phoneCode"
            type="text"
            clearable
            placeholder="请输入验证码"
            :maxlength="11"
          />
          <button
            class="code-number"
            :disabled="codeFlag"
            @click="getCode"
          >
            {{ codeText }}
          </button>
        </div>
      </div>
      <div class="form-group">
        <label
          class="tit"
          style="width:56px;"
        />
        <div class="cont">
          <span
            class="submit"
            @click="submit()"
          >
            完成
          </span>
        </div>
      </div>
    </div>
    <div
      v-if="flag"
      class="form"
    >
      <div class="form-group">
        <span class="tip">为了您的账号安全，请先验证当前手机号</span>
      </div>
      <div class="form-group">
        <label
          for=""
          class="tit"
        >手机号：</label>
        <div class="cont">
          <span class="cur-mobile">{{ commUserInfo.mobile }}</span>
        </div>
      </div>
      <div class="form-group mb">
        <label
          class="tit"
        >验证码：</label>
        <div class="cont code">
          <Input
            v-model="formItem.phoneCode"
            type="text"
            clearable
            placeholder="请输入验证码"
            :maxlength="11"
          />
          <button
            class="code-number"
            :disabled="codeFlag"
            @click="getCode"
          >
            {{ codeText }}
          </button>
        </div>
      </div>
      <div class="form-group">
        <label
          class="tit"
          style="width:56px;"
        />
        <div class="cont">
          <span
            class="submit"
            @click="nextStep()"
          >
            下一步
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Input } from 'iview'
import Http from '@utils/Http'
const http = new Http()
export default {
  components: {
    Input,
  },
  data() {
    return {
      codeText: '获取验证码',
      totalTime: 60,
      formItem: {
        // 手机号
        phoneNumber: '',
        // 验证码
        phoneCode: '',
      },
      codeFlag: false,
      timer: null,
      oldPhone: '',
      flag: true,
    }
  },
  created() {
    this.flag = !!this.commUserInfo.mobile
    this.oldPhone = this.commUserInfo.mobile
    if (this.commUserInfo.mobile) {
      this.formItem.phoneNumber = this.commUserInfo.mobile
    }
  },
  destroyed() {
    if (this.timer) {
      window.clearInterval(this.timer)
    }
  },
  methods: {
    // 发送验证码
    async getCode() {

      if (!this.flag) {
        if (String(this.oldPhone) === String(this.formItem.phoneNumber)) {
          this.msg.warn('不能绑定相同的手机号')
          return false
        }
      }
      
      if (!this.formItem.phoneNumber) {
        this.msg.warn('请输入手机号码')
        return
      }

      if (this.codeFlag) {
        return
      }

      let type = 3
      
      // type为3 修改手机号码 需要验证手机号是否被注册 4不需要
      if (this.flag) {
        type = 4
        this.msg.info('验证码已发送')
        const code = await this.getPhoneCode({
          phone: this.formItem.phoneNumber,
          type
        })
        this.countdownHelper()
      } else {
        this.$get('jmfen-sport-usercenter/app/send/code', {
          apiType: 'gw',
          headers: {
            'Authorization': 'Basic YXBwOmFwcA=='
          },
          body: {
            phone: this.formItem.phoneNumber,
            type,        
          }
        }).then((res) => {
          const { code, data, msg } = res
          if (this.$judgeCode(code) && data) {
            this.codeFlag = true
            this.codeSuccess = true
            this.countdownHelper()
          } else {
            this.msg.error(msg)
          }
        })
      }
    },
    
    countdownHelper() {
      this.totalTime = 60
      this.timer = setInterval(() => {
        this.totalTime--
        this.codeText = `重新获取(${this.totalTime}s)`
        this.codeFlag = true
        if (this.totalTime <= 0) {
          clearInterval(this.timer)
          this.codeText = '重新获取'
          this.codeFlag = false
          this.totalTime = 60
        }
      }, 1000)
    },

    nextStep() {
      if (!this.formItem.phoneCode) {
        this.msg.warn('请输入验证码')
        return
      }
    
      this.validateOldPhone()
    },

    validateOldPhone() {
      http.$get('/jmfen-sport-usercenter/app/check/code', {
        apiType: 'gw',
        body: {
          phone: this.oldPhone,
          code: this.formItem.phoneCode,
          type: 4,
        }
      }).then(res => {
        if(this.$judgeCode(res.code) && res.data) {
         
          this.flag = false
          this.formItem.phoneCode = ''
          this.formItem.phoneNumber = ''
          window.clearInterval(this.timer)
          this.codeText = '获取验证码'
          this.codeFlag = false
        } else {
          this.msg.error('验证码错误')
        }
      })
    },

    submit() {
      if (!this.formItem.phoneNumber) {
        this.msg.warn('请输入手机号码')
        return
      }

      const telRegx = /^1[3456789]\d{9}$/
      if (!telRegx.test(this.formItem.phoneNumber)) {
        this.msg.warn('请输入正确的手机号')
        return
      }
      
      if (!this.formItem.phoneCode) {
        this.msg.warn('请输入验证码')
        return
      }
      
      http.$get('jmfen-sport-usercenter/v1/user/personal/' + this.getUserInfo().uid, {
        apiType: 'gw',
        body: {
          mobile: this.formItem.phoneNumber,
          code: this.formItem.phoneCode,
        }
      }).then(res => {
        if(res.code === 100200) {
          this.msg.success('修改成功')
          const timer = setTimeout(() => {
            this.$parent.changeTab(1)
            clearTimeout(timer)
          }, 1501)
        } else {
          this.msg.error(res.msg)
        }
      })
    },
    
  }
}
</script>
<style lang="scss" scoped>
@import '../style/index.scss';
.change-phone {
  position: relative;
}
.tip {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #999999;
  letter-spacing: 0;
}

.phone-number {
  position: relative;
  /deep/ .ivu-input-wrapper {
    width: 240px;
  }
  /deep/ .ivu-input {
    border-right: none; 
    width: 240px;
    border-top-right-radius: 0; 
    border-bottom-right-radius: 0;
  }
}
.num-flag {
  position: absolute;
  display: inline-block;
  width: 60px;
  border: 1px solid #ccc;
  border-left: none;
  border-top-right-radius: 4px; 
  border-bottom-right-radius: 4px;
  height: 32px;
  line-height: 32px;
  top: 0;
  left: 240px;
  text-align: center;
}
.mb {
  margin-bottom: 31px;
}
.code {
  /deep/ .ivu-input-wrapper {
    width: 200px;
  }
   /deep/ .ivu-input {
    width: 200px;
  }
  &-number {
    font-size: 12px;
    margin-left: 8px;
    display: inline-block;
    width: 88px;
    height: 32px;
    line-height: 32px;
    color: #fff;
    background: #3683FF;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      background: #2679FF;
    }
  }
  &-number:disabled {
    display: inline-block;
    width: 88px;
    height: 32px;
    line-height: 32px;
    background: #B3B3B3;
    font-size: 12px;
    color: #FFFFFF;
  }
}
.cur-mobile {
  display: inline-block;
  width: 300px;
  height: 32px;
  line-height: 32px;
  text-align: left;
  padding-left: 15px;
  background: #F2F2F2;
  border-radius: 4px;
}

.error-tip {
  top: 175px;
  left: 60px;
}

</style>


