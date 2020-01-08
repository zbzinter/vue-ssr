<!--  暂无数据 -->
<template>
  <div class="empty-text">
    {{ text }}
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: '暂无数据'
    }
  }
}
</script>

<style scoped lang="scss">
.empty-text{
  text-align: center;
  color: #909399;
  height: 60px;
  line-height: 60px;
  font-size: 14px;
}
</style>
