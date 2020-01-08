<template>
  <div class="page-inner">
    <p class="title">
      玩法说明
    </p>
    <Rule />
  </div>
</template>

<script>
import Rule from '@src/components/personal/rule'
export default {
  components: {
    Rule
  },
}
</script>

<style lang="scss" scoped>
.page-inner {
  margin-top: 50px;
  background: #fff;
  padding: 25px;
  .title {
    font-size: 18px;
    color: #333;
    margin-bottom: 15px;
    font-weight: 700;
  }
}
</style>
