<template>
  <div class="rule-details">
    <!-- <p
      @click="showRule"
    >
      <span class="title rule">
        玩法说明
      </span>
    </p> -->
    猜球互动详细说明：
    <div v-if="isShowRule">
      <div class="item">
        <p class="title">
          什么是猜球？
        </p>
        <span>
          为了活跃直播间气氛，给自己带来人气值，球会直播提供了直播间猜球互动，主播发起与赛事关联的直播时，可以发起猜球，让观众参与竞猜，猜猜看比赛最终是哪一个队伍赢。猜对的观众会瓜分猜错的观众的球豆。
        </span>
      </div>
      <div class="item">
        <p class="title">
          主播发起猜球之前要做什么？
        </p>
        <span>
          选择赛事，关联直播：开播前，先在网页个人中心的“直播设置”里选择赛事分类，选中其中一场比赛，然后根据这场比赛进行开播；
        </span>
      </div>
      <div class="item">
        <p class="title">
          主播如何发起猜球？
        </p>
        <span>
          在网页个人中心的“猜球管理”中点击“发起猜球”。要注意的是，猜球是针对整场比赛进行竞猜，不是猜单节比赛，所以主播可以评估一下，距离整场比赛还有多长时间结束，去选择猜球的结束时间，也就是猜球的封盘时间。

          小贴士：不一定要一开播就进行猜球哦，可以在比赛白热化或者开赛一段时间之后再发起
        </span>
      </div>
      <div class="item">
        <p class="title">
          发起猜球后，主播在哪里查看发起的记录？
        </p>
        <span>
          发起之后，主播发起的猜球就进入到猜球管理“正在进行的猜球”列表里。鼠标点击主题、选项，均可查看这场比赛的参赛队伍全名。在列表中，可以看到猜球的开始时间，如果竞猜时间到，还会显示封盘时间。可以对猜球进行封盘操作、流局操作、结算操作。

          小贴士：发起猜球后，应该鼓励观众积极参与，猜最终的比赛结果。鼓励观众尽快参与，因为有竞猜的时间，所以要告诉观众，赶快参与，不然封盘之后就不能参与了。
        </span>
      </div>
      <div class="item">
        <p class="title">
          主播如何进行结算操作？
        </p>
        <span>
          封盘操作：主播可以随时结束猜球。主播发起猜球时选择的封盘倒计时太长的话，想提前结束猜球，就可以点击封盘，结束这场猜球。

          流局操作：比赛全部结束之后，两个队伍如果是平局，就点击流局。

          结算操作：比赛全部结束之后，选择赢的一个队伍，再点击结算。

          注意：结算的结果是按照整场比赛的总结果进行结算的哦，所以不要以单节比赛的时间进行结算。在整场比赛结束之后，主播如果结算错误，系统也会提示你结算不对，这时候主播可以重新看看自己是不是手误结算错（一定要注意结算的结果是正常比赛的结果，不是单节比赛！）
        </span>
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
.rule-details {
  padding: 0 40px;
}
.item {
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