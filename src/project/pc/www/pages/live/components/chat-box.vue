<template>
  <div
    class="chat-box"
    :class="{'isRoom':isRoom}"
  >
    <p
      v-if="isRoom"
      class="announcement"
    >
      房间公告: {{ announcement }}
    </p>
    <div class="icon-announcement">
      <i class="iconfont iconicon_gonggao" />
    </div>
    <div
      class="room-box"
      :class="isRoom?'room':''"
    >
      <!-- tab -->
      <ul class="chat-tab">
        <li 
          v-for="item in tab"
          :key="item.key"
          :class="{cur: chatBoxTab === item.key}"
          @click="tabClick(item.key)"
        >
          {{ item.name }}
        </li>
      </ul>
      <!-- 内容 -->
      <div class="content">
        <LiveList 
          v-if="chatBoxTab === 1"
          :live-type="liveType"
          :is-room="isRoom"
          :has-video="hasVideo"
          :has-ani="hasAni"
          @switchLiveType="switchLiveType"
        />
        
        <!-- 兼容im订阅取不到最新用户信息，暂时直接显示出来 -->
        <!-- v-if="chatBoxTab === 2"  -->
        <ChatRoom
          :anchor-id="anchorId"
          :match-data="matchData"
          :sensitive-word="sensitiveWord"
          @initSensitive="initSensitive"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import LiveList from './live-list'
import ChatRoom from './chat-room'
import liveMixins from '../../../mixins/live'
export default {
  components: {
    LiveList,
    ChatRoom
  },
  mixins: [liveMixins],
  props: ['liveType', 'hasVideo', 'matchData', 'hasAni','anchorId','info','announcement','sensitiveWord'],
  data() {
    return {
      tab: [
        {
          key: 2,
          name: '聊天室'
        },
        {
          key: 1,
          name: '相关直播'
        }
      ]
    }
  },
  computed: {
    isRoom(){
      return this.$route.query.roomId?true:false
    },
    ...mapGetters(['chatBoxTab'])
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      // 如果是主播间，默认切换到聊天室
      if(this.$route.query.roomId) {
        this.$store.commit('setChatBoxTab',  2)
      }
    },
    initSensitive(){
      this.$emit('initSensitive')
    },
    tabClick(key) {
      if(this.chatBoxTab === key) return
      // this.chatBoxTab = key
      this.$store.commit('setChatBoxTab',  key)
    },
    switchLiveType(params) {
      this.$emit('switchLiveType', params)
    }
  }
}
</script>
<style lang="postcss" scoped>
.chat-box {
  height:650px;
  position: relative;
  background: #FFFFFF ;
  &.isRoom{
    height:807px;
  }
  .icon-announcement{
    position: absolute;
    font-size: 12px;
    left: 12px;
    top: 10px;
    line-height: 20px;
    z-index: 9;
    .iconfont{
      color:#999999;
      vertical-align: middle;
      font-size:12px
    }
  }
  .announcement{
    margin:11px 4px 11px 36px;
    font-size: 14px;
    color: #999999;
    width:294px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    height:40px;
    -webkit-box-orient: vertical;
    transition: height 0.5s;
    position: absolute;
    line-height: 20px;
    text-align: justify;
    &::before{
      content:'';
      display:block;

    }
    &:hover{
      overflow: auto;
      z-index:2;
      height:auto;
      cursor: pointer;
      -webkit-line-clamp: inherit;
      background:#FFFFFF;
      margin:0;
      padding:11px 4px 11px 36px;
      width:334px;
    }
  }
  .room{
    padding-top:62px;
    .content{
       /* height: calc(100% - 102px); */
    }

  }
  .chat-tab {
    height: 40px;
    line-height: 40px;
    background: #F0F0F0;
    li {
      width:50%;
      float: left;
      height: 40px;
      cursor: pointer;
      font-size: 14px;
      box-sizing:border-box;
      color: #999;
      text-align:center;
      &:hover {
        color: #3683FF;
      }
      &.cur {
        color: #3683FF;
        font-weight: bold;
        border-top: 2px solid #3683FF;
        background:white;
      }
    }
  }
  .room-box{
    height:100%;
    padding-bottom:9px;
  }
  .content {
    /* height: 509px; */
    height: calc(100% - 40px);
    overflow: hidden;
  }
}
</style>