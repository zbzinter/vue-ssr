<template>
  <div class="charts-row">
    <div class="fl process process-left">
      <span
        class="inner"
        :style="{width: (data.team1 / (data.team1 + data.team2) * 100) + '%'}"
      />
    </div>
    <div class="fl ellipsis num text-r">
      {{ data.team1 }}{{ util }}
    </div>
    <div class="fl ellipsis title">
      {{ title }}
    </div>
    <div class="fl ellipsis num text-l">
      {{ data.team2 }}{{ util }}
    </div>
    <div class="fl process process-right">
      <span
        class="inner"
        :style="{width: (data.team2 / (data.team1 + data.team2) * 100) + '%'}"
      />
    </div>
  </div>
</template>
<script>
export default {
  props: ['data', 'title', 'util'],
}
</script>
<style lang="postcss" scoped>
.text-l {
  text-align: left;
}
.text-r {
  text-align: right;
}
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.charts-row {
  line-height: 18px;
  padding: 6px 0;
  overflow: hidden;
  .process {
    width: 232px;
    height: 10px;
    float: left;
    margin-top: 4px;
    background: #f5f5f5;
    position: relative;
    .inner {
      position: absolute;
      top: 0;
      width: 0;
      height: 100%
    }
  }
  .process-left {
    border-radius: 10px 0 0 10px;
    .inner {
      right: 0;
      background: #3683FF;
      border-radius: 10px 0 0 10px;
    }
  }
  .process-right {
    border-radius: 0 10px 10px 0;
    .inner {
      left: 0;
      background: #E15756;
      border-radius: 0 10px 10px 0;
    }
  }
  .num {
    width: 34px;
    float: left;
    text-align: center;
    font-weight: bold;
  }
  .title {
    width: 60px;
    color: #999;
    text-align: center;
  }
}
</style>