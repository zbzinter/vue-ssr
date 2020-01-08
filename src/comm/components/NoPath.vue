<template>
  <div class="no-path">
    <h1>访问的路径不存在。</h1>
  </div>
</template>
<script>
export default {
}
</script>
<style scoped lang="postcss">
.no-path{
  position: absolute;
  left:0;
  top:0;
  width:100%;
  height:100%;
  background:#fff;
  text-align:center;
  padding: 200px 0;
  h1{
    text-align: center;
    font-size: 22px;
    font-weight: normal;
  }
}
</style>
