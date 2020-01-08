<template>
  <div class="ani-video-tab">
    <div
      v-for="item in btnGroup"
      :key="item.key"
      class="btn"
      :class="{cur: item.key === curBtn}"
      @click="btnClick(item.key)"
    >
      <i
        class="iconfont"
        :class="item.icon"
      />
      <span>{{ item.name }}</span>
    </div>
  </div>
</template>
<script>
export default {
  props: ['liveType', 'hasVideo', 'hasAni'],
  data() {
    return {
      btnGroup: [
        {
          key: 1,
          name: '动画直播',
          icon: 'iconbn_cl'
        },
        {
          key: 2,
          name: '视频直播',
          icon: 'iconaf_di'
        },
      ],
      // 当前选中的btn
      curBtn: 2,
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.curBtn = this.liveType
    },
    btnClick(key) {
      if(key === 1 && !this.hasAni) {
        this.$tip('暂无动画直播')
        return
      }
      if(key === 2 && !this.hasVideo) {
        this.$tip('暂无视频直播')
        return
      }
      this.curBtn = key
      this.$emit('switchLiveType', { key })
    },
  }
}
</script>
<style lang="postcss" scoped>
.ani-video-tab {
  height: 36px;
  line-height: 36px;
  .btn {
    color: #333;
    float: left;
    width: 50%;
    text-align: center;
    cursor: pointer;
    background: rgba(255,255,255,0.5);
    &:hover,
    &.cur {
      color: #3683FF;
      background: #fff;
      .iconfont {
        color: #3683FF;
      }
    }
    &:last-child {
      .iconfont {
        font-size: 15px;
      }
    }
    .iconfont {
      color: #5c5c5c;
      font-size: 12px;
      vertical-align: top;
    }
    span {
      font-size: 14px;
      margin-left: 8px;
    }
  }
}
</style>