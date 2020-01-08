<template>
  <div class="change-nickname">
    <div class="form">
      <div class="form-group">
        <label
          for=""
          class="tit"
        >当前昵称：</label>
        <div class="cont">
          <span class="cur-name">{{ commUserInfo.nickName }}</span>
        </div>
      </div>
      <div class="form-group mb">
        <label
          class="tit"
        >新昵称：</label>
        <div class="cont">
          <Input
            v-model="nickName"
            type="text"
            clearable
            placeholder="请输入新的昵称"
            :maxlength="16"
          />
        </div>
      </div>
      <div class="form-group">
        <label class="tit" />
        <div class="cont">
          <span
            class="submit"
            @click="submit()"
          >
            确认修改
          </span>
        </div>
      </div>
    </div>
    <div class="explain">
      <div class="title">
        说明：
      </div>
      <p>1.非会员30天仅能修改一次昵称，会员可无限修改昵称。</p>
      <p>2.新昵称需符合注册规范，可使用数字，字母，汉字，2到16个字符。</p>
      <p>3.如遇服务器更新或其它问题导致昵称修改失败，请联系客服。</p>
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

      // 昵称
      nickName: '',
  
      reg: /[\u4E00-\u9FA5]/g,
    }
  },
  watch: {
    nickName: {
      handler: function (str) {
        let val = str.trim()
        let len = 0
        if (this.reg.test(val)) {
          len = val.match(this.reg).length + val.length
        } else {
          len =  val.length
        }
        if (len > 16) {
          this.$nextTick(() => {
            this.nickName = val.substr(0, val.length-1)
          })
        }
      },
      deep: true,
    }
  },
  methods: {
    submit() {
     
      if (!this.nickName) {
        this.msg.warn('请输入新的昵称')
        return
      }

      const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/
      if (!reg.test(this.nickName)) {
        this.msg.error('昵称不符合规范')
        return
      }
      
      http.$get('jmfen-sport-usercenter/v1/user/personal/' + this.getUserInfo().uid, {
        apiType: 'gw',
        body: {
          nickName: this.nickName
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

.tit { 
  width: 70px;
}
.cur-name {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #666666;
  text-align: left;
  line-height: 22px;
}
.mb {
  margin-bottom: 30px;
}

.explain {
  padding-top: 80px;
  font-size: 12px;
  color: #999;
  line-height: 24px;
}
.error-tip {
  top: 120px;
  left: 74px;
}

</style>


