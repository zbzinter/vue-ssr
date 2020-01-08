<template>
  <div
    class="chat-room"
    :class="{'is-obs': isObs}"
  >
    <div class="top-room">
      <!-- 小礼物 -->
      <div
        id="sGiftWrap"
        class="gift-box small"
      />
      <!-- 大礼物 -->
      <div
        id="bGiftWrap"
        class="gift-box"
      />
      <!-- 点击弹出的用户信息框，禁言，拉黑等 -->
      <div
        v-if="curSelectUser && Object.keys(curSelectUser).length"
        id="userInfoBox"
        class="user-info-box"
      >
        <div class="info">
          <DefaultImg
            :src="curSelectUser.avatar"
            class="user-img"
            :default-img="defaultImg.avatar"
          />
          <p class="name">
            {{ curSelectUser.nickName }}
          </p>
        </div>
        <div class="btn-wrap">
          <div
            class="btn"
            @click="disabledSendMsg"
          >
            禁言5分钟
          </div>
        </div>
      </div>
      <!-- 聊天室 -->
      <div
        ref="msgList"
        class="room-scroll c-scroll"
        @scroll="scroll"
      >
        <div
          class="sensitive-word"
          :class="isShow"
        >
          {{ (sensitiveWord || {}).content }}
        </div>
        <div
          ref="historyList"
          class="historyList"
        >
          <template v-for="(item, index) in listItems">
            <div
              v-if="index >= startIndex && index <= endIndex"
              :key="index+'_0'"
            >
              <!-- msg -->
              <div
                v-if="item.msgType && item.msgType !== 5"
                class="msg-list"
                :class="userType(item)"
              >
                <span
                  class="name"
                  :data-show="JSON.stringify(item)"
                >{{ item.nickName }}：</span>
                <span class="msg">{{ item.content }}</span>
              </div>
              <!-- 进入直播间提示 不显示提示 -->
              <div
                v-if="item.msgType === 5"
                class="tip color_red"
              >
                <i class="iconfont iconicon_massige" />{{ item.content }}
              </div>
            </div>
          </template>
        </div>
        <div
          v-for="(item, index) in liveChatMsg"
          :key="index"
        >
          <!-- msg -->
          <div
            v-if="item.msgType && item.msgType !== 5"
            class="msg-list"
            :class="userType(item)"
          >
            <span
              class="name"
              :data-show="JSON.stringify(item)"
              @click.stop="handleUserName(item)"
            >{{ item.nickName }}：</span>
            <span class="msg">{{ item.content }}</span>
          </div>
          <!-- 进入直播间提示 不显示提示 -->
          <div
            v-if="item.msgType === 5"
            class="tip color_red"
          >
            <i class="iconfont iconicon_massige" />{{ item.content }}
          </div>
        </div>
      </div>
    </div>
    <div class="emoji-top-box">
      <Poptip
        trigger="hover"
        theme="light"
        placement="top-end"
      >
        <div class="child emoji">
          <i class="iconfont iconicon_face" />
        </div>
        <div
          slot="content" 
          class="emoji-box"
        >
          <Picker
            set="emojione"
            emoji="point_up"
            :include="['people']"
            :show-search="false"
            :infinite-scroll="false"
            :show-preview="false"
            :show-categories="false"
            :emoji-tooltip="false"
            @select="addEmoji"
          />
        </div>
      </Poptip>
    </div>
    <!-- 消息输入框 -->
    <div class="msg-input-box">
      <div class="child input-box">
        <textarea
          v-model.trim="message"
          type="text"
          placeholder="我也来说几句"
          maxlength="30"
          @keydown.enter.prevent="submit"
        />
      </div>
      <div
        class="child btn"
        :class="{disabled: !message}"
        @click="submit"
      >
        发送
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters,mapMutations } from 'vuex'
import { Poptip } from 'iview'
import { Picker } from 'emoji-mart-vue' 
import MqttBase from '@utils/MqttBase'
import { setTimeout, clearTimeout } from 'timers'

export default {
  components: {
    Poptip,
    Picker
  },
  props: {
    matchData: {
      type: Object,
      default: function() {
        return {}
      }
    },
    sensitiveWord:{
      type: Object,
      default: () => {}
    },
    // 是嵌入在obs软件里用的
    isObs: {
      type: Boolean,
      default: false
    },
    anchorId: {
      type:Number,
      default:0
    }
  },
  data() {
    return {
      // 消息输入框
      message: '',
      mqtt: null,
      // url参数
      query: {},
      // 消息列表
      msgList: [],
      comeInText: '进入直播间，和大家打个招呼吧',
      sessionId: '',
      time: 0,
      sendNum: 0,
      setIntervalTime: null,
      isShow:'',
      startIndex:'',
      //存储历史聊天记录
      listItems:[],
      //每次删除长度
      deleteLong:100,   //100
      //当前显示条目的删除临界值
      currentLong:400,   //500
      //历史条目的删除临界值
      historyLong:10000,  //10000
      //防抖
      timeout:null,
      //渲染出来历史记录的高度、
      historyHeight:0,
      //是否自动拖动到底部
      autoBottom:true,
      timeoutStartindexChange:null,
      // 当前选择的用户
      curSelectUser: null,
    }
  },
  computed: {
    // 系统消息：红

    // 主播发言：蓝色

    // 普通用户：黑色

    // 用户自己看到自己的发言：橙色

    // 用户送礼文案颜色：橙色
    userType(){
      return function(item){
        let style = ''
        if(item.msgType == 2){
          style = 'color_orange'
        }else{
          if(item.userId == this.anchorId){
            if(item.userId == this.getUserInfo().uid){
              style = 'color_orange is-self'
            }else{
              style = 'color_blue'
            }
          }else if(item.userId == this.getUserInfo().uid){
            style = 'color_orange is-self'
          }else{
            style = 'color_black'
          }
        }
        return style
      }
    },
    ...mapGetters(['liveChatMsg']),
    endIndex(){
      return this.listItems.length - 1
    }
  },
  watch: {
    sensitiveWord(val){
      if(val && Object.keys(val).length){
        this.isShow = 'animated fadeIn'
        setTimeout(() => {
          this.isShow = 'animated fadeOut'
          // 延迟清除数据，以免造成空白
          setTimeout(() => {
            this.$emit('initSensitive')
          }, 1500)
        }, 2000)
      }
    },
    liveChatMsg(val) {
      if(val.length == this.currentLong){
        if(this.listItems.length < this.historyLong){
          this.listItems = this.listItems.concat(val.slice(0,this.deleteLong))
        }
        this.setLiveChatMstShift(this.deleteLong)
      }
      this.autoBottom?this.scrollChat(val):''
    },
    listItems(val,oldval){
      if(val.length >= this.historyLong){
        this.listItems = this.listItems.slice(val.length-this.historyLong) 
      }
      // this.startIndex ?this.startIndex = this.startIndex + this.deleteLong:val.length-1   仅显示分页的条数 数据会有突变的问题
      if(this.startIndex && this.startIndex !== oldval.length-1){
        this.startIndex = this.startIndex
      }else{
        this.startIndex = val.length-1
      }
    },
    startIndex(val,oldval){
      this.initTime()
    }
  },
  mounted() {
    this.init()
    
    // 点击document 关闭用户信息框
    document.addEventListener('click', e => {
      console.log('chat-room-click')
      const userInfoBox = document.getElementById('userInfoBox')
      if(userInfoBox && !userInfoBox.contains(e.target)) {
        this.curSelectUser = {}
      }
    })
  },
  methods: {
    initTime(){
      this.timeoutStartindexChange && window.clearTimeout(this.timeoutStartindexChange)
      this.timeoutStartindexChange = window.setTimeout(()=>{
        this.autoBottom = true
      },60000)
    },
    scroll(){
      if(this.$refs.msgList.scrollTop<this.historyScrollTop){
        this.autoBottom = false
      } 
      this.debounces(function(){
        if(this.$refs.msgList.scrollTop<30 && this.listItems.length !=0){
          this.startIndex=this.startIndex-20<0?0:this.startIndex-20
          this.$nextTick(()=>{
            this.$refs.msgList.scrollTop = this.$refs.historyList.offsetHeight - this.historyHeight
            this.historyHeight = this.$refs.historyList.offsetHeight
          })
        }else if(this.$refs.msgList.scrollTop>this.$refs.msgList.scrollHeight - this.$refs.msgList.offsetHeight- 40){
          this.startIndex = this.endIndex>=0?this.endIndex:0
          this.autoBottom = true
          this.historyHeight = 0
        }
      },200)
    },
    debounces(fn,delay){
      this.timeout?window.clearTimeout(this.timeout):''
      this.timeout = window.setTimeout(()=>{
        fn.apply(this)
      },delay)
    },
    init() {
      this.getParams()
      if (this.query.roomId) {
        this.sessionId = 'live_' + this.query.roomId
      } else {
        this.sessionId = 'match_' + this.query.id
      }
      this.mqtt = new MqttBase()
    },
    // 消息滚动
    scrollChat(msg) {
      if(!msg) return
      this.$nextTick(()=>{
        this.$refs.msgList.scrollTop = this.$refs.msgList.scrollHeight
        this.historyScrollTop = this.$refs.msgList.scrollTop
        this.startIndex = this.endIndex
      })
    },
    // 存储页面参数
    getParams() {
      this.query = this.$route.query || {}
    },
    // 选择表情
    addEmoji(e) {
      this.message += e.native
    },
    // 发送聊天消息
    sendChat(params) {
      let msg = this.mqtt.sendMessage(this.sessionId, params)
      if (msg.code === 200){
        if(msg.msgType !== 99){
          this.message = ''
        }
      }
    },
    submit() {
      // 判断登录
      const userInfo = localStorage.getItem('userInfo')
      if(!this.message) return
      if(!localStorage.getItem('token') || !userInfo || userInfo === '{}') {
        this.G_SetLogin(true)
        return
      }
      // 10秒之内只能发三次信息
      if (!this.setIntervalTime) {
        this.setIntervalTime =  window.setInterval(this.addTime, 1000)
      }
      this.sendNum += 1
      if (this.time < 10 && this.sendNum < 4) {
        const msgBase = {
          fontColor: '#333333',
          nickName: this.commUserInfo.nickName || '访客',
          sessionId: this.sessionId,
          userId: this.commUserInfo.uid,
          userLevel: this.commUserInfo.userLevel || 1,
          avatar: this.commUserInfo.img,
          userType: this.commMemberInfo.vip ? this.commMemberInfo.vip.level : ''
        }
        this.sendChat({
          ...msgBase,
          content: this.message,
          msgType: 1
        })
      }else{
        this.$tip('亲你说话的速度太快了')
      }
    },
 
    addTime() {
      this.time += 1
      if (this.time === 10) {
        this.time = 0
        this.sendNum = 0
        if (this.setIntervalTime) {
          window.clearInterval(this.setIntervalTime)
          this.setIntervalTime = null
        }
      }
    },
    ...mapMutations(['setLiveChatMstShift']),
    // 管理点击用户做禁言操作
    handleUserName(item) {
      // 如果不是房管，return
      const _key = 'roomUserType_' + this.query.roomId + '_' + this.commUserInfo.uid
      // 当前用户是否是主播
      const isAnchor = this.commUserInfo.uid === this.anchorId
      // 不能点击自己
      if(item.userId === this.commUserInfo.uid) {
        return
      }
      // 当前主播或者管理员可以禁言
      if(isAnchor || sessionStorage.getItem(_key)) {
        this.curSelectUser = item
      }
    },
    // 禁言
    disabledSendMsg() {
      this.$post('v2.1/roommanager/keepslient', {
        apiType: 'anchor',
        body: {
          roommanager_uid: this.commUserInfo.uid,
          uid: this.curSelectUser.userId,
          room_id: this.$route.query.roomId,
          type: 1,
          // 5分钟
          keep_time: 5 * 60
        }
      }).then((res) => {
        const {code, msg} = res
        if (this.$judgeCode(code)) {
          this.curSelectUser = {}
          this.$success('禁言成功')
        } else {
          this.$error(msg)
        }
      }).catch(() => {
        this.$error('服务器出错')
      })
    }
  }
}
</script>
<style lang="postcss" scoped>
.gift-box {
  position: absolute;
  left: 0;
  top: 250px;
  width: 100%;
  max-height: 260px;
  &.small {
    top: 84px;
  }
  /deep/ {
    #bigGiftboxInner {
      #giftCanvas {
        height: 260px;
      }
      .big-gift-title {
        width: 182px;
        height: 26px;
        line-height: 26px;
        position: relative;
        border-radius: 26px;
        overflow: hidden;
        margin: 0 auto 18px auto;
        background-image: linear-gradient(90deg, #F0AA21 0%, #FF521E 100%);
        .user-img {
          width: 26px;
          height: 26px;
          border-radius: 26px;
          border: 1px solid #EB9D1E;
          background: #EB9D1E;
          float: left;
        }
        .txt {
          float: left;
          margin-left: 4px;
          line-height: 26px;
          p {
            float: left;
            font-size: 12px;
            color: #FFFFFF;
            margin-right: 5px;
            &.name {
              max-width: 60px;
            }
          }
        }
      }
    }
    #smallGiftBox {
      width: 184px;
      height: 48px;
      margin: 0 18px 0 14px;
      padding-left: 20px;
      position: relative;
      border-radius: 10px 65px 57px 35px;
      background-image: linear-gradient(90deg, #F0AA21 0%, #FF521E 100%);
      .user-img {
        width: 28px;
        height: 28px;
        border-radius: 28px;
        border: 1px solid #EB9D1E;
        background: #EB9D1E;
        position: absolute;
        left: -13px;
        top: 0;
      }
      .txt {
        width: 100px;
        max-height: 48px;
        padding: 4px;
        float: left;
        overflow: hidden;
        p {
          color: #fff;
          font-size: 12px;
          height: 20px;
          line-height: 20px;
          overflow: hidden;
        }
      }
      .gift {
        position: absolute;
        left: 130px;
        top: 4px;
        width: 170px;
        .s-gift {
          width: 40px;
          height: 40px;
          float: left;
        }
        .num {
          float: left;
          color: #fff;
          font-size: 18px;
          margin-left: 22px;
          margin-top: 10px;
          img {
            float: left;
            height: 24px;
            margin-right: 1px;
            &.x {
              height: 18px;
              margin-top: 4px;
            }
          }
        }
      }
    }
  }
}
.chat-room {
  .user-info-box {
    width: 60%;
    background: rgba(0,0,0,0.8);
    position: absolute;
    left: 20%;
    top: 35%;
    border-radius: 20px;
    text-align: center;
    .info {
      padding-top: 20px;
      .user-img {
        width: 60px;
        height: 60px;
        border-radius: 60px;
        display: block;
        margin: 0 auto;
      }
      .name {
        line-height: 40px;
        font-size: 14px;
        color: #fff;
      }
    }
    .btn-wrap {
      border-top: 1px solid #666;
      .btn {
        color: #fff;
        font-size: 14px;
        cursor: pointer;
        line-height: 40px;
        &:hover {
          color: #0D8CFF;
        }
      }
    }
  }
  .emoji-top-box{
     width:334px;
    border-top:1px solid #F1F1F1;
    box-sizing: border-box;
    height:34px;
  }
  /deep/ .ivu-poptip-rel{
    padding:0 6px;
    height:34px;
    line-height:34px;
    &:hover{
      cursor: pointer;
    }
  }
  height: 100%;
  /* position: relative; */
  /* 针对bos 做界面调整 */
 &.is-obs {
    height: 100vh;
    .top-room,
    .room-scroll {
      height: calc(100vh - 115px);
      .msg-list {
        &.color_black {
          color: #fff;
        }
        &.color_orange.is-self {
          color: #fff;
        }
      }
    }
    .emoji-top-box {
      width: 100%;
      border-color: #333;
    }
    .emoji-top-box {
      /deep/ .ivu-poptip-popper {
        width: 270px;
      }
    }
    .msg-input-box {
      .input-box {
        width: calc(100% - 60px);
        textarea {
          width: 100%;
        }
      }
      /deep/ .ivu-poptip-popper {
        width: 270px;
      }
    }
  }
  .top-room {
    /* height: 465px; */
    height:calc(100% -114px);
    position: relative;
  }
  .room-scroll {
    /* height: 465px; */
    height:100%;
    padding-bottom: 10px;
    overflow-y: auto;
    .sensitive-word{
      opacity: 0;
      background: rgba(0,0,0,0.80);
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #FFFFFF;
      width:295px;
      padding:20px 0;
      text-align:center;
      line-height:22px;
      position:absolute;
      left:50%;
      top:50%;
      transform:translate(-50%);
    }
  }
  /deep/ .ivu-poptip-body {
    white-space: normal;
    word-break: break-all;
    .emoji-mart-category-label {
      display: none;
    }
  }
  .emoji-box {
    padding: 10px 0;
  }
  .msg-input-box {
    /* height: 44px;
    line-height: 44px; */
    height:78px;
    margin:0 5px 0 6px;
    overflow: hidden;
    background: #FFFFFF;
    
    .ivu-poptip {
      float: left;
    }
    .child {
      float: left;
    }
    .input-box {
      /* width: 110px; */
      textarea{
        width:262px;
        height:78px;
        box-sizing:border-box;
        border:1px solid #F1F1F1;
        resize:none;
        line-height:17px;
        padding:13px 8px;
        font-szie:12px;
        color: #999999
      }
      input {
        width: 100%;
        height: 100%;
        color: #999;
        line-height: 34px;
        padding: 5px 10px;
        background: none;
        border: none;
      }
    }
    .emoji {
      width: 50px;
      float: left;
      cursor: pointer;
      text-align: center;
      .iconfont {
        color: #666;
      }
    }
    .btn {
      width: 60px;
      font-size: 12px;
      color: #fff;
      cursor: pointer;
      text-align: center;
      line-height:78px;
      background: #3683ff;
      &.disabled {
        cursor: default;
        background: #CCCCCC;
      }
    }
  }
  .msg-list {
    font-size: 14px;
    color: #333333;
    line-height: 22px;
    padding: 10px 15px 0 15px;
    .name {
      color: #0D8CFF;
      font-size:12px;
      cursor: pointer;
    }
    .msg {
      font-size: 12px;
      word-break: break-all;
    }
  }
  .color_red{
    color:#E15756;
    .name{
      color: #E15756;
    }
  }
  .color_blue{
    color:#0D8CFF;
  }
  .color_black{
    color:#333333;
    .name{
      color:#0D8CFF;
    }
  }
  .color_orange{
    color:#FC8E3E;
    .name{
      color:#FC8E3E;
    }
    &.is-self{
      color:#333333;
    }
  }
  .tip {
    color: #e15756;
    padding: 15px 15px 0 15px;
    font-size:12px;
    .iconfont{
      font-size:12px;
      margin-right:4px;
    }
  }
}
</style>