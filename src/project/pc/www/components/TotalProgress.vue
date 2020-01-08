<template>
  <div class="progress-section">
    <p
      v-if="position === 'left'"
      class="percent"
      :class="[`percent-${position}`]"
    >
      <slot />
    </p>
    <div
      class="progress"
      :class="[`progress-${position}`]"
    >
      <p
        class="progress-inner"
        :style="{width: `${percent}%`}"
      />
    </div>
    <p
      v-if="position === 'right'"
      class="percent"
      :class="[`percent-${position}`]"
    >
      <slot />
    </p>
  </div>
</template>
<script>
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    },

    // left: 进度条从左往右 or right：进度条从左往右
    position: {
      type: String,
      default: 'left'
    },

    //  是否展示文本
    isShowText: {
      type: Boolean,
      default: true
    }
  }
}
</script>
<style lang="postcss" scoped>
.progress-section {
  overflow: hidden;
  line-height: 20px;
  .percent{
    width: 43px;
  }
  .percent-left{
    float: right;
    text-align: right;
  }
  .percent-right{
    float: right;
    text-align: left;
  }
  .progress {
    width: 88px;
    height: 8px;
    background: #d8d8d8;
    overflow: hidden;
    margin-top: 6px;
    position: relative;
    .progress-inner {
      position: absolute;
      top: 0;
      z-index: 5;
      height: 100%;
      background: #f5aa58;
    }
  }
  .progress-left{
    border-radius: 0 4px 4px 0;
    float: left;
    .progress-inner {
      left: 0;
    }
  }
  .progress-right{
    border-radius: 4px 0 0 4px;
    float: right;
    .progress-inner {
      right: 0;
    }
  }
}
</style>