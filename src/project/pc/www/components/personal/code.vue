<template>
  <div class="code">
    <FormItem
      label="验证码："
    >
      <Input
        v-model="code"
        type="text"
        style="width:200px;margin-right: 8px;"
        placeholder="请输入验证码"
        :maxlength="6"
        @on-keyup="code = code.replace(/[^0-9]/g, '')"
      /> 
      <Button
        type="primary"
        :disabled="!codeFlag"
        @click="getCode()"
      >
        {{ codeText }}
      </Button>
      <span class="block tip">验证码将发送到手机 <span class="tip-number">{{ commUserInfo.hiddenMobile }}</span></span>
    </FormItem>
  </div>
</template>

<script>

import { FormItem, Button,Input } from 'iview'
export default {
  components: {
    FormItem,
    Button,
    Input
  },
  data() {
    return {
      code: '',
      codeText: '获取验证码'
    }
  },
  methods: {
    async getCode() {
      this.timer = setInterval(() => {
        this.totalTime--
        this.codeText = `重新获取(${this.totalTime}s)`
        this.codeFlag = false
        if (this.totalTime <= 0) {
          window.clearInterval(this.timer)
          this.codeText = '重新获取'
          this.codeFlag = true
          this.totalTime = 60
        }
      }, 1000)
      
      this.msg.info('短信已发送，请注意查收您的手机')
      const code = await this.getPhoneCode({
        phone: this.commUserInfo.mobile,
        type: 4,
      })
    },

    getInputCode() {
      return this.code
    }

  },
}
</script>

<style lang="scss" scoped>
.code {
  /deep/ .ivu-btn {
    padding: 0
  }
}

.ivu-btn-primary {
  width: 88px;
  height: 32px;
  line-height: 19px;
  font-family: PingFangSC-Regular;
}
.tip {
  color: #999;
  &-number {
    color: #151515;
  }
}
</style>
