<template>
  <div class="step2">
    <Form
      ref="formRef"
      label-position="right"
      :model="formItem"
      :label-width="110"
      class="c-user-form"
    >
      <FormItem
        prop="password"
        label="新密码："
      >
        <Input
          v-model="formItem.password"
          size="large"
          type="password"
          placeholder="请设置6-20字母数字组合密码"
          :maxlength="20"
        />
      </FormItem>
      <FormItem
        prop="comfirmPassword"
        label="确认密码："
      >
        <Input
          v-model="formItem.comfirmPassword"
          size="large"
          type="password"
          placeholder="请确认密码"
          :maxlength="20"
        />
      </FormItem>
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
export default {
  components: {
    Form,
    Input,
    FormItem,
    Button
  },
  props: {
    data: {
      type: Object,
      default: function() {
        return {}
      }
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
      // debugger
      if (!this.formItem.password) {
        this.$parent.tip = '请设置6-20字母数字组合密码'
        return false
      }
      const pwdReg = new RegExp('^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$')
      if (!pwdReg.test(this.formItem.password)) {
        this.$parent.tip = '请设置6-20位字母数字组合密码'
        return false
      }

      if (!this.formItem.comfirmPassword) {
        this.$parent.tip = '请输入确认密码'
        return false
      }

      if (String(this.formItem.password) !== String(this.formItem.comfirmPassword)) {
        this.$parent.tip = '两次密码不一致'
        return false
      }

      return true
    },

    // 设置密码
    submit() {
      if(!this.validate()) return
      this.$get('jmfen-sport-passport/app/findpwd/reset', {
        apiType: 'gw',
        headers: {
          'Authorization': 'Basic YXBwOmFwcA=='
        },
        body: {
          ticket: this.data.ticket,
          userName: this.data.phone,
          passWord: this.formItem.password,
        }
      }).then(res => {
        if(res.code === 100200) {
          this.$emit('changeStep', {
            key: 2,
          })
        } else {
          this.$parent.tip = res.msg
        }
      })
    }
  }
}
</script>
<style lang="postcss" scoped>
.step2 {
  padding-left: 120px;
}
</style>


