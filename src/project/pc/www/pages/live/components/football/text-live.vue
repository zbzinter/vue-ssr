<template>
  <div class="text-live">
    <!-- 统计 -->
    <TextLiveCharts :match-data="matchData" />
    <!-- 内容节点 -->
    <TextLiveNode :match-data="matchData" />
  </div>
</template>
<script>
import TextLiveCharts from './text-live-charts'
import TextLiveNode from './text-live-node'
export default {
  components: {
    TextLiveCharts,
    TextLiveNode
  },
  props: ['matchData'],
  data() {
    return {
    }
  },
  methods: {
  }
}
</script>
<style lang="postcss" scoped>
.text-live {
}
</style>