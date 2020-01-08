<template>
  <div>
    <div
      v-if="status === 0"
      class="loading-box"
    >
      <!-- 
      // 待解决loading导致页面闪烁问题
      <Spin fix>
        <Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
        <div>Loading</div>
      </Spin>

      -->
    </div>
    <slot v-if="status === 1" />
    <div
      v-if="status === 2"
      class="loading-empty"
    >
      <p>{{ emptyText }}</p>
    </div>
  </div>
</template>
<script>
import { Spin, Icon } from 'iview'


export default {
  components: {
    Spin,
    Icon
  },
  props: {
    status: {
      type: Number,
      // 0 加载中，1 加载成功，2 无数据， 其他 不显示内容
      default: 0
    },
    emptyText: {
      type: String,
      default: '暂无数据'
    }
  }
}
</script>
<style lang="postcss" scoped>
.loading-box {
  height: 100px;
  position: relative;
  border: 1px solid #eee;
}
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.loading-empty{
  line-height: 100px;
  text-align:center;
}
</style>
