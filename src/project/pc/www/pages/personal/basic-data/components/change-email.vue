<template>
  <div class="change-email">
    <Form
      ref="formRef"
      label-position="right"
      :label-width="110"
      :model="form"
      class="c-user-form"
      @submit.prevent="submit"
    >
      <FormItem
        label="当前邮箱："
        class="item-small"
      >
        <p>{{ commUserInfo.email || '暂无绑定邮箱' }}</p>
      </FormItem>
      <FormItem
        label="新邮箱地址："
      >
        <Input
          v-model="form.email"
          size="large"
          type="text"
          placeholder="请输入邮箱地址"
        />
      </FormItem>
      <input
        type="text"
        value=""
        style="display: none"
      >
      <FormItem>
        <Button
          class="btn"
          type="primary"
          size="large"
          :disabled="disabledFlag"
          @click="submit()"
        >
          发送验证邮件
        </Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import { Form, Input, FormItem, Button } from 'iview'
import { _throttle } from '@/comm/utils/common'
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
      disabledFlag: true,
      form: {
        // 邮箱
        email: '',
      },
    }
  },
  watch: {
    'form.email': {
      handler: function (val) {
        this.disabledFlag = val ? false : true
      },
      deep: true
    }
  },
  methods: {

    submit: _throttle(function () {
      
      if (!this.form.email) {
        this.msg.warn('邮箱不能为空')
        return
      }

      if (this.commUserInfo.email === this.form.email) { 
        this.msg.warn('请输入不同的邮箱')
        return
      }
      const emailReg = new RegExp('^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$')
      if (!emailReg.test(this.form.email)) {
        this.msg.warn('邮箱格式错误')
        return
      }
  
      http.$get('jmfen-sport-usercenter/users/email/send', {
        apiType: 'gw',
        body: {
          email: this.form.email,
          emailType: 1,
        }
      }).then(res => {
        const {code, msg} = res
        if(this.$judgeCode(code)) {
          this.msg.success('邮件已发送')
          this.disabledFlag = true
          const timer = setTimeout(() => {
            this.disabledFlag = false
            clearTimeout(timer)
          }, 20000)
        } else {
          this.errorTip = msg
        }
      }).catch(() => {
        this.msg.error('邮件发送失败')
      })
    }, 500) 
    
  }
}
</script>
<style lang="scss" scoped>
@import '../style/index.scss';
.ivu-form-item {
  margin-bottom: 22px;
}
.btn {
  font-family: PingFangSC-Regular;
  margin-top: 8px;
  // background: #3683FF;
  border-radius: 4px;
  // color: #fff;
  font-size: 12px;
  width: 100px;
  height: 32px;
  line-height: 17px;
}
.change-email {
  margin-left: -15px;
  position: relative;
  padding-top: 35px;
}
.error-tip {
  top: 124px;
  left: 109px;
}
</style>


