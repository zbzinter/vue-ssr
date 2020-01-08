<template>
  <div class="guessball-rule">
    <div class="guessball-rule__header clearfix">
      <p class="title fl">
        发起猜球
      </p>
      <p
        class="return fr"
        @click="returnManage"
      >
        返回
      </p>
    </div>
    
    <div class="content">
      <div class="form">
        <div class="form-group title">
          <label>当前房间标题：</label>
          <span>{{ title }}</span>
        </div>
        <div class="form-group">
          <label class="desc">主题：</label>
          <div class="cont">
            {{ theme }}
          </div>
        </div>
        <div class="form-group">
          <label
            class="desc"
            style="vertical-align: top;"
          >选项：</label>
          <div class="cont">
            <span
              class="block mb"
            >{{ optionA }}</span>
            <span class="block">{{ optionB }}</span>
          </div>
        </div>
        <div class="form-group">
          <label class="desc">倒计时：</label>
          <div class="cont">
            <span
              v-for="(item, key) in countdown"
              :key="item.key"
              :class="activeIndex === key ? 'active': ''"
              class="time"
              @click="selectTime(item.key, key)"
            >{{ item.time }}</span>
          </div>
        </div>
        <div
          class="form-group"
          style="margin-bottom: 12px;"
        >
          <span class="tip">
            小提示：如果比赛结束，则自动封盘，不受倒计时影响。
            发起猜球后可到“正在进行的猜球”中随时结束竞猜
          </span>
        </div>
        <Button
          :disabled="isDisable"
          @click="startGuessBall"
        >
          发起猜球
        </Button>
      </div>
      <div>
        <span
          class="view"
          @click="isShowRule = !isShowRule"
        >{{ isShowRule ? '查看' : '隐藏' }}玩法说明</span>
        <Rule v-if="!isShowRule" />
      </div>
    </div>
    
    <div class="options">
      <div class="mb">
        <p>注意事项：</p> 
        <span class="block">1、猜球将在自己的直播间展示，用户参与，主播不会有利益损失</span>
        <span class="block">2、猜球仅为娱乐互动功能，主播不会获得任何盈利，但可以带动直播间气氛，增加观众数量</span>
        <span class="block">3、比赛结束后主播应及时进行结算</span>
      </div>
      <div>
        <p>处罚事项：</p> 
        <span class="block">1、主播因忘记结算而导致流局太多，会受到处罚甚至取消发起竞猜的资格</span>
        <span class="block">2、主播出现错判现象，经官方核实后，视情节严重将对主播进行不同程度的处罚</span>
      </div>
    </div>
  </div>
</template>
<script>

import {
  Button,
} from 'iview'
import {mapActions} from 'vuex'
import Rule from '@src/components/personal/rule'
import mixins from './../../mixins'

export default {
  components: {
    Button,
    Rule,
  },
  mixins: [mixins],
  data() {
    return {
      title: '',
      theme: '',
      optionA: '',
      optionB: '',
      activeIndex: -1,
      time: '',
      roomId: 0,
      successTip: '',
      isShowRule: true,
    }
  },
  computed: {
    isDisable() {
      return  !this.time
    }
  },
  created() {
    this.init()
  },
  methods: {
    ...mapActions([
      'GetAnchorSetInfo',
    ]),

    init() {
      this.GetAnchorSetInfo({uids: this.getUserInfo().uid, vm: this }).then((result) => {
        this.roomId = result.room_id
        this.title = result.title
        this.theme = result.match_name
        const [optionA, optionB] = this.theme.split('vs')
        this.optionA = optionA
        this.optionB = optionB
      })
    },

    startGuessBall() {
      this.$post('/v0.2/anchorUsers/guessingCompetitions',{
        apiType: 'anchor',
        body: {
          uid: this.getUserInfo().uid || '',
          room_id: this.roomId,
          theme: this.theme,
          option_a: this.optionA,
          option_b:  this.optionB,
          count_down: this.time
        }
      })
        .then((res) => {
          if (res.code === 200) {
            this.$parent.successTip = '竞猜已经成功发起，比赛结束后请在个人中心-竞猜管理 中选择竞猜结果进行结算'
            setTimeout(() => {
              this.returnManage()
            }, 3000)
          } else {
            this.$parent.tipFlag = true
            this.$parent.tip = res.msg
          }
        })
    },

    returnManage() {
      this.$parent.returnManage()
    },

    selectTime(key, index) {
      this.activeIndex = index
      this.time = key
    }
  }
}
</script>
<style lang="scss" scoped>

.title {
  font-family: PingFangSC-Regular;
  font-size: 16px;
  line-height: 22px;
  color: #333;
  letter-spacing: 0;
}

.guessball-rule {
  min-height: 700px;
  position: relative;
  &__header {
    height: 22px;
    margin-bottom: 18px;
    padding-left: 40px;
  }
  
  .content {
    border-top: 1px solid #F0F0F0;
    padding: 0 40px;
  }
  .form {
    margin-top: 40px;
    .title {
      font-weight: 700;
      margin-bottom: 32px;
    }

    .mb {
      margin-bottom: 20px;
    }

    &-group {
      @extend .mb;
    }

    .desc {
      display: inline-block;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      line-height: 20px;
      color: #333;
      letter-spacing: 0;
      min-width: 56px;
      text-align: left;
    }
    .cont {
      display: inline-block;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #666666;
      text-align: left;
      line-height: 22px;
    }

    .tip {
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #999999;
      text-align: left;
      line-height: 22px;
    }
  }
  .return {
    text-align: right;
    font-size: 14px;
    color: #666;
    padding-right: 40px;
    cursor: pointer;
    &:hover {
      color: #3683FF;
    }
  }

  .time {
    display: inline-block;
    font-size: 12px;
    width: 80px;
    height: 30px;
    line-height: 30px;
    margin-right: 20px;
    border-radius: 5px;
    border: 1px solid#CCC;
    text-align: center;
    cursor: pointer;
    &:hover {
      color: #fff;
      border: 1px solid#3683FF;
      background: #3683FF;
    }
  }
  .active {
    color: #fff;
    border: 1px solid#3683FF;
    background: #3683FF;
  }
}
  

.ivu-btn {
  width: 140px;
  height: 32px;
  color: #3683FF;
  border: 1px solid #3884FF;
  span {
    font-size: 12px;
  }
  &:hover {
    color: #fff;
    border: 1px solid#3683FF;
    background: #3683FF;
  }
  &:disabled {
    color: #fff;
    background: #CCC;
    border: 1px solid #CCC;
    border-radius: 4px;
  }
}

.options {
  margin-top: 40px;
  padding-left: 40px;
  p {
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #666666;
    letter-spacing: 0;
    line-height: 22px;
    font-weight: 600;
  }
  span {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #666666;
    letter-spacing: 0;
    line-height: 22px;
  }
  .mb {
    margin-bottom: 22px;
  }
}
.view {
  font-family: PingFangSC-Regular;
  cursor: pointer;
  font-size: 12px;
  color: #3683ff;
}

</style>


