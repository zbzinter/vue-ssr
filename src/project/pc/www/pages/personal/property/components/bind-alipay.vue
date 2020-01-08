<template>
  <div class="sec-operate">
    <div class="tab">
      <div @click="returnParent">
        <i class="iconfont iconfj_dj" /> 
        <i class="iconfont iconfk_dj" />
        <p>绑定支付宝</p>
      </div>
    </div>
    <div class="content">
      <Form
        class="form"
        label-position="right"
        :label-width="110"
      >
        <FormItem
          label="支付宝账号："
        >
          <Input
            v-model="form.aplipay"
            type="text"
            class="long-width"
            placeholder="请输入支付宝账号"
          />
        </FormItem>
        <FormItem
          label="真实姓名："
        >
          <Input
            v-model="form.name"
            type="text"
            class="long-width"
            placeholder="请输入支付宝实名认证姓名"
            :maxlength="10"
          />
        </FormItem>
        <Code ref="code" />
        <FormItem
          label=""
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
import { Button, FormItem, Form, Input } from 'iview'
import Code from '@src/components/personal/code'
import { mapActions } from 'vuex'


export default {
  components: {
    Button,
    Code,
    FormItem,
    Form, 
    Input
  },
  data() {
    return {
      form: {
        aplipay: '',
        name: '',
        code: '',
      }
    }
  },
  methods: {
    ...mapActions(['CheckCode']),

    
    returnParent() {
      this.$parent.changeType()
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

        if (item === 'name') {
          const reg = /^[\u4e00-\u9fa5]{0,}$/
          if (!reg.test(this.form.name)) {
            this.msg.warn('请输入正确的姓名')
            flag = false
            return flag
          }
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
        code: this.formItem.code,
        type: 4
      }, vm: this})
        .then((isCorrect) => {
          if (isCorrect) {
            this.bindAlipay()
          } else {
            this.errorTip = '验证码错误'
          }
        })
    },

    bindAlipay() {
      this.$post('1111', {
        apiType: 'goShop',
        body: {
        
        }
      }).then((res) => {
        if (this.$judgeCode(res.code)) {
          this.msg.success('支付宝绑定成功')
          const timer = setTimeout(() => {
            window.location.reload()
            clearTimeout(timer)
          }, 2000)
        } else {
          this.msg.error('支付宝绑定失败')
        }
      }).catch(() => {
        this.msg.error('支付宝绑定失败')
      })
    },
  }
}
</script>
<style lang="scss" scoped>
@import './../../../../public/personal/form.scss';
@import './../../../../public/personal/sec-operate.scss';
.form {
  padding-top: 40px;
  padding-left: 40px;
}

</style>


