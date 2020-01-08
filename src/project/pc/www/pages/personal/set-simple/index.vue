<template>
  <div>
    <UserInfo />
    <div class="simple-live">
      <p class="anchor-desc mb">
        房间设置
      </p>
      <div class="content">
        <Form
          :label-width="142"
        >
          <FormItem label="直播分类：">
            <span
              class="btn"
              @click="selectLiveType"
            >
              {{ liveTypeText }}
            </span>
            <span class="tip">（用于你的网页和APP直播间直播分类展示）</span>
          </FormItem>
          <FormItem label="方言分类：">
            <Button @click="handleDialects">
              {{ text.dialect_type_name }}
            </Button> 
            <span class="tip">（选择方言进行个性化直播）</span>
          </FormItem>
          <FormItem label="房间标题：">
            <Input
              v-model="form.title"
              :maxlength="20"
            />
          </FormItem>
          <FormItem
            label=""
            class="mt20"
          >
            <Button
              type="primary"
              @click="submit"
            >
              确定
            </Button>
          </FormItem>
        </Form>
      </div>
      <DialectClassify
        ref="classify"
        @select="selectModal"
      />
    </div>
    <LiveClassify
      ref="liveClassify"
      @selectData="selectLiveTypeText"
    />
  </div>
</template>
<script>
import {
  Form,
  FormItem,
  Button,
  Input,
} from 'iview'
import {mapActions} from 'vuex'
import UserInfo from '@src/components/personal/user-info'
import LiveClassify from '@src/components/personal/live-classify'

import DialectClassify from '../set/components/tag-dialect-classify'

export default {
  components: {
    UserInfo,
    DialectClassify,
    Form,
    FormItem,
    Button,
    Input,
    LiveClassify
  },
  data() {
    return {
      text: {
        dialect_type_name: '普通话',
      },
      liveTypeText: '请选择',
      uid: '',
      data: [],
      form :{
        match_id :0,
        match_name: '',
        match_type_id: '',
        match_type_name: '',
        live_type_id: 1,
        title: '',
        dialect_type_id: 0,
      },
    }
  },
  mounted() {
    this.uid = this.getUserInfo().uid
    this.getAnchorSetInfo()
  },
  methods: {

    ...mapActions([
      'GetAnchorSetInfo',
    ]),
    
    selectLiveType() {
      this.$refs.liveClassify.openLIveClassify()
    },  

    selectLiveTypeText(data) {
      this.liveTypeText = data.name
      this.form.match_id = data.matchId
      this.form.match_name = data.team
      this.form.match_type_id = data.leagueId
      this.form.match_type_name = data.leagueName
    },

    getAnchorSetInfo() {
      this.GetAnchorSetInfo({uids: this.uid, vm: this }).then((result) => {
        this.roomId = result.room_id
        this.form.title = result.title
        if (result.live_type_id) {
          // 默认足球
          this.form.live_type_id = result.live_type_id === 0 
            ? 1 : result.live_type_id
        } else {
          this.form.live_type_id = 1
        }
      }).catch(() => {
        this.$error('请求接口报错')
      })
    },
    
    submit() {
      if (!this.form.match_id) {
        return this.$error('请选择赛事')
      }
      
      if (!this.form.title) {
        return this.$error('请填写房间标题')
      }
      this.$put('v0.1/rooms', {
        apiType: 'anchor',
        body: {
          uid: this.uid,
          ...this.form,
          room_id: this.roomId,
          user_img: this.commUserInfo.img,
          nickname: this.commUserInfo.nickName,
          stream_server_type: 'TC'
        },
      }).then((res) => {
        const {code, msg} = res
        if (this.$judgeCode(code)) {
          this.$success(msg)
          const timer = setTimeout(() => {
            this.$router.push({
              path: '/personal/set'
            })
            clearTimeout(timer)
          }, 1000)
        } else {
          this.$error(msg)
        }
      })
    },

    // 选择方言 
    selectModal({name, type_id}) {
      this.text.dialect_type_name = name
      this.form.dialect_type_id = type_id
    },

    handleDialects() {
      this.$refs.classify.getData(0)
    },
  }
}
</script>
<style lang="scss" scoped>
@import './../../../public/personal/rule.scss';

.ivu-form-item:after {
  clear: right;
}

.simple-live {
  margin-top: 10px;
  // 
  .mb {
    margin-bottom: 23px;
  }
  /deep/ .ivu-form-item-label {
    color: #333333;
    font-size: 14px;
  }
  
  .ivu-form-item {
    margin-bottom: 10px;
  }

  /deep/ .ivu-input {
    width: 500px;
    border-radius: 4px;
    border: 1px solid #dcdee2;
  }
  .tip {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #999;
    text-align: left;
    line-height: 22px;
  }
  .ivu-btn {
    width: 100px;
    height: 32px;
    line-height: 16px;
    border-radius: 4px;
    &:disabled {
      color: #fff;
      background-color: rgba(54, 131, 255, 0.6);
      border-color: none !important;
    }
  }
}
.btn {
  display: inline-block;
  min-width: 100px;
  height: 32px;
  line-height: 16px;
  border-radius: 4px;
  border: 1px solid #dcdee2;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  white-space: nowrap;
  padding: 8px 15px 6px;
  font-size: 12px;
  cursor: pointer;
}
.mt20 {
  margin-top: 20px;
}
</style>


