<template>
  <div>
    <p
      v-if="fetchStatus === 0"
      class="list-loading"
    >
      加载中…
    </p>
    <div v-if="fetchStatus === 1">
      <p
        v-if="len === 0"
        class="list-empty"
      >
        {{ text }}
      </p>
      <slot v-else />
    </div>
    <p
      v-if="fetchStatus === 2"
      class="list-error"
    >
      请求出错，请稍后重试
    </p>
  </div>
</template>
<script>
export default {
  props: {
    // 请求状态, 0 请求中，1请求完成，2请求出错
    fetchStatus: {
      type: Number,
      default: 0
    },
    // 列表长度
    len: {
      type: Number,
      default: 0
    },
    text: {
      type: String,
      default: '暂无数据'
    }
  }
}
</script>
<style scoped lang="postcss">
.list-loading, .list-empty{
  text-align: center;
  padding: 50px 0;
  font-size: 14px;
}

</style>


