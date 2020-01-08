<template>
  <div>
    <div v-if="isShowRule">
      <div class="item">
        <p class="title">
          什么是猜球？
        </p>
        <span>
          猜球互动是由主播发起的，关于本场赛事直播的一道竞猜，竞猜题目就是本场比赛的两个队伍，其中有两个选项，观众可以在两个选项之间竞猜，当整场比赛结束，主播结算了最终结果后，胜利的一方将会平分失败的一方的球豆。
        </span>
      </div>
      <div class="item">
        <p class="title">
          观众怎么参与？
        </p>
        <span>
          猜球是猜比赛的最终结果，不是单节比赛哦。在网页的直播间，或者手机直播间打开猜球活动，点击你要支持的选项，选择或输入投注球豆后点击提交。猜球时间到封盘后，等待整场比赛结束，主播会在比赛结束的12小时内结算。当主播结算后赢的一方即可获得球豆，输的一方球豆会被扣除。
        </span>
      </div>
      <div class="item">
        <p class="title">
          什么是流局？
        </p>
        <ul>
          <li>1、竞猜时，只有一个选项有人投注、或两个选项没有任何人投注，则本题目会变为流局，系统自动返还观众所参与的球豆。</li>
          <li>2、若出现不可抗力导致题目关闭，或直播间被关闭，均被判为流局，系统自动返还观众所参与的球豆。</li>
          <li>3、比赛结束后，主播忘记结算，题目将在12小时后自动判为流局，系统自动返还观众所参与的球豆。</li>
          <li>4、比赛结束后，两个队伍平局，主播在结算的时候选择流局，返还给观众所参与的球豆。</li>
        </ul>
      </div>
      <div class="item">
        <p class="title">
          球豆能做什么？
        </p>
        <ul>
          <li>1、球豆只能球会体育产品内部使用，不可以线下交易，不涉及博彩，禁止其他一切形式的具有倒卖嫌疑的交易。一旦发现违规，将进行封号等处理。</li>
          <li>2、猜球仅为娱乐互动游戏，平台无收益，不涉及任何盈利。</li>
        </ul>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      isShowRule: true,
    }
  },
  methods: {
    showRule() {
      this.isShowRule = !this.isShowRule
    },
  },
}
</script>

<style lang="scss" scoped>
.item {
  white-space: normal;
  margin-bottom: 22px;
}
.title {
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #666666;
  letter-spacing: 0;
  line-height: 22px;
  font-weight: 700;
}
span, li {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #666666;
  letter-spacing: 0;
  line-height: 22px;
}
.rule {
  color: #3683FF;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  line-height: 40px;
  font-weight: 700;
  letter-spacing: 0;
  color: #333333;
  cursor: pointer;
}
</style>