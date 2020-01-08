<template>
  <div class="text-live">
    <div class="b-title">
      <span class="txt">文字直播</span>
    </div>
    <div class="content">
      <ul class="live-txt-node">
        <li
          :class="{cur: curTag === '全场'}"
          @click="nodeTabClick('全场')"
        >
          全场
        </li>
        <li
          v-for="(item, index) in nodeTag"
          :key="index"
          :class="{cur: curTag === item}"
          @click="nodeTabClick(item)"
        >
          {{ item }}
        </li>
      </ul>
      <ul class="scroll c-scroll big-scroll">
        <li
          v-for="(item, index) in filerliveList"
          :key="index"
        >
          <div class="fl section">
            {{ item.section || '-' }}
          </div>
          <div class="fl time">
            {{ item.time }}
          </div>
          <div class="fl line" />
          <div class="fl con">
            {{ item.cnText }}
          </div>
        </li>
        <!-- 无数据 -->
        <li
          v-if="!filerliveList || !filerliveList.length"
          class="no-data"
        >
          暂无直播内容
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import MqttBase from '@utils/MqttBase'
export default {
  components: {
  },
  props: {
  },
  data() {
    return {
      // 直播数据
      liveList: [],
      // mqtt
      mqtt: null,
      // 订阅聊天地址
      subscribePath: null,
      // 节数
      nodeTag: [],
      curTag: '全场',
      tagAll: ['第一节', '第二节', '第三节', '第四节', '加时'],
    }
  },
  computed: {
    filerliveList() {
      if(!this.liveList && !this.liveList.length) return []
      // 如果当前是全场tag 则展示所有
      if(this.curTag === '全场') return this.liveList
      // 否则通过tag 过滤
      return this.liveList.filter(item => item.section === this.curTag)
    }
  },
  mounted() {
    this.init()
  },
  destroyed(){
    this.mqtt.unsubscribe(this.subscribePath)
  },
  methods: {
    init() {
      // 查询文字直播
      this.getMatchPhrase()
      // 订阅直播
      this.setMqtt()
    },
    getMatchPhrase() {
      this.$get('v7/queryMatchPhrase', {
        matchId: this.$route.query.id,
        page: 1,
        pageSize: 1000,
      }).then(res => {
        const { code, data } = res
        if(code === 200) {
          if(data && data.length) {
            this.liveList = data
            this.filterTag(this.liveList)
          } else {
            this.$store.commit('toggleTextLiveBasket', false)
          }
        }
      })
    },
    setMqtt(){
      const mqtt = new MqttBase(this.getMessage)
      this.mqtt = mqtt
      this.subscribePath = `topic_mq/match/${this.query.id}/phrase`
      this.mqtt.subscribe(this.subscribePath)
    },
    // 处理消息
    getMessage(topic, mqttMsg = {}) {
      if(topic.indexOf(this.subscribePath) !== -1) {
        this.liveList.push(mqttMsg)
        this.filterTag(this.liveList)
      }
    },
    // 筛选节数
    filterTag(data) {
      let tags = []
      let sortTags = []
      if(data && data.length) {
        data.forEach(item => {
          if(tags.indexOf(item.section) === -1) {
            tags.push(item.section)
          }
        })
      }
      this.tagAll.forEach(item => {
        tags.forEach(tag => {
          if(item === tag) {
            sortTags.push(item)
          }
        })
      })
      this.nodeTag = sortTags
    },
    // 切换节数
    nodeTabClick(tag) {
      if(this.curTag === tag) return
      this.curTag = tag
    },
  }
}
</script>
<style lang="postcss" scoped>
.text-live {
  border-top: 10px solid #f2f2f2;
  .b-title {
    padding-left: 30px;
    margin-bottom: -8px;
    font-weight: bold;
    height: 66px;
    line-height: 66px;
    border-bottom: 1px solid #f1f1f1;
    .txt {
      font-size: 20px;
      color: #3683FF;
      display: inline-block;
      height: 100%;
      border-bottom: 4px solid #3683FF;
    }
  }
  .content {
    padding: 20px;
    .live-txt-node {
      height: 46px;
      line-height: 46px;
      margin-left: -10px;
      li {
        padding: 0 20px;
        font-size: 16px;
        color: #999999;
        float: left;
        cursor: pointer;
        &:hover,
        &.cur {
          color: #3683FF;
        }
      }
    }
    .scroll {
      height: 520px;
      overflow-y: auto;
      li {
        height: 30px;
        line-height: 30px;
        padding: 0 20px;
        font-size: 12px;
        color: #666;
        &.no-data {
          font-size: 16px;
          text-align: center;
          padding: 100px 0;
          &:hover {
            background: #fff;
          }
        }
        &:hover {
          background: #f6f6f6;
        }
        &:first-child {
          .line {
            &:before {
              display: none;
            }
          }
        }
        .section {
          width: 50px;
        }
        .time {
          width: 50px;
          text-align: right;
        }
        .line {
          width: 0;
          height: 100%;
          margin: 0 30px;
          position: relative;
          &:after {
            content: '';
            width: 5px;
            height: 5px;
            border-radius: 5px;
            background: #ddd;
            position: absolute;
            left: -2px;
            top: 50%;
            margin-top: -2px;
          }
          &:before {
            content: '';
            height: 100%;
            position: absolute;
            left: 0;
            top: -50%;
            border-left: 1px solid #ddd;
          }
        }
      }
    }
  }
}
</style>