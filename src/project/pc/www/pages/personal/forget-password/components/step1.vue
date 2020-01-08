<template>
  <div class="step1">
    <Form
      ref="formRef"
      label-position="right"
      :model="formItem"
      :label-width="110"
      class="c-user-form"
    >
      <FormItem
        prop="phoneNumber"
        label="手机号："
      >
        <Input
          v-model="formItem.phoneNumber"
          size="large"
          type="tel"
          placeholder="请输入手机号"
          :maxlength="11"
        />
      </FormItem>
      <FormItem
        key="phoneCode"
        prop="phoneCode"
        label="验证码："
      >
        <Input
          v-model="formItem.phoneCode"
          size="large"
          type="text"
          :maxlength="6"
          placeholder="请输入验证码"
        />
        <span
          class="phone-code"
          @click="getCode"
        >{{ codeText }}</span>
      </FormItem>
      <Button
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
export default {
  components: {
    Form,
    Input,
    FormItem,
    Button
  },
  data() {
    return {
      formItem: {
        // 手机号
        phoneNumber: '',
        // 验证码
        phoneCode: '',
      },
    }
  },
  methods: {
    // 发送验证码
    async getCode() {
      if (!this.validate()) {
        return false
      }
      

      const code = await this.getPhoneCode({
        phone: this.formItem.phoneNumber,
        type: 2
      })
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

    },
    validate(param) {
      const telRegx = /^1[3456789]\d{9}$/
      if (!this.formItem.phoneNumber) {
        this.$parent.tip = '请输入手机号'
        return false
      }
      if (!telRegx.test(this.formItem.phoneNumber)) {
        this.$parent.tip = '请输入正确的手机号'
        return false
      }
      if (param) {
        if (!this.formItem.phoneCode) {
          this.$parent.tip = '请输入验证码'
          return false
        }
      }

      return true
     
    },

    submit() {

      if (!this.validate(1)) {
        return false
      }

      this.$get('jmfen-sport-usercenter/app/findpwd/check', {
        apiType: 'gw',
        headers: {
          'Authorization': 'Basic YXBwOmFwcA=='
        },
        body: {
          userName: this.formItem.phoneNumber,
          code: this.formItem.phoneCode,
        }
      }).then(res => {
        const { code, data } = res
        if(this.$judgeCode(code)) {
          this.$emit('changeStep', {
            key: 1,
            ticket: data.ticket,
            phone: this.formItem.phoneNumber
          })
        } else {
          this.$parent.tip = res.msg
        }
      })
    },
  }
}
</script>
<style lang="postcss" scoped>
.step1 {
  padding-left: 120px;
}
</style>


