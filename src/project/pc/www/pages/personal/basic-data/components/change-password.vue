<template>
  <div class="change-password">
    <Form
      ref="formRef"
      label-position="right"
      :model="formItem"
      :label-width="110"
      class="c-user-form"
    >
      <FormItem
        v-if="commUserInfo.modifyPwd"
        label="当前密码："
      >
        <Input
          v-model="formItem.oldPassword"
          type="password"
          placeholder="请输入当前密码"
          :maxlength="20"
        />
      </FormItem>
      <FormItem
        label="新密码："
      >
        <Input
          v-model="formItem.password"
          type="password"
          placeholder="请设置6-20位字母数字组合密码"
          :maxlength="20"
        />
      </FormItem>
      
      <FormItem
        label="确认密码："
      >
        <Input
          v-model="formItem.comfirmPassword"
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
        确认修改
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
  data() {
    return {
      formItem: {
        // 密码
        password: '',
        // 原密码
        oldPassword: '',
        // 确认密码
        comfirmPassword: '',
      },
    }
  },
  methods: {
  
    submit() {
      const pwdReg = new RegExp('^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$')
      if (this.commUserInfo.modifyPwd) {
        if (!this.formItem.oldPassword) {
          this.msg.warn('请输入当前密码')
          return
        }

        if (this.formItem.oldPassword) {
          if (!pwdReg.test(this.formItem.oldPassword)) {
            this.msg.warn('当前密码错误')
            return
          } 
        }
      }

      if (this.formItem.password === '' && this.formItem.comfirmPassword === '') {
        this.msg.warn('请输入新密码')
        return
      }
      
      if (!pwdReg.test(this.formItem.password)) {
        this.msg.warn('请设置6-20位字母数字组合密码')
        return
      } 

      if (this.formItem.oldPassword === this.formItem.password) {
        this.msg.warn('新密码不能为当前密码')
        return
      }

      if (this.formItem.comfirmPassword !== this.formItem.password) {
        this.msg.warn('两次密码不一致')
        return
      }


      // 修改密码
      if(this.commUserInfo.modifyPwd) {
        http.$get('jmfen-sport-usercenter/v1/user/personal/' + this.getUserInfo().uid, {
          apiType: 'gw',
          body: {
            oldPwd: this.formItem.oldPassword,
            newPwd: this.formItem.password,
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
      } else {
        // 获取ticket
        http.$get('jmfen-sport-usercenter/app/setpwd/ticket', {
          apiType: 'gw',
        }).then(response => {
          const { code, data={} } = response
          if(code === 100200) {
            // 设置密码
            this.setPwd(data.ticket)
          }
        })
      }
    },
    // 设置密码
    setPwd(ticket) {
      http.$get('jmfen-sport-usercenter/app/setpwd', {
        apiType: 'gw',
        body: {
          ticket,
          userName: this.commUserInfo.mobile,
          passWord: this.formItem.password,
        }
      }).then(res => {
        if(res.code === 100200) {
          this.msg.success('设置成功')
          const timer = setTimeout(() => {
            this.$parent.changeTab(1)
            clearTimeout(timer)
          }, 1501)
        } else {
          this.msg.error(res.msg)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../style/index.scss';
.mb {
  margin-bottom: 0;
}
.c-user-form {
  margin-left: -30px;
  .submit {
    height: 32px;
    line-height: 16px;
  }
}
.change-password {
  position: relative;
  padding-top: 35px;
}
.error-tip {
  top: 195px;
  left: 79px;
}
</style>


