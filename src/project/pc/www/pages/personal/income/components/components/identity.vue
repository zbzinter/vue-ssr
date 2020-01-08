<template>
  <div>
    <FormItem
      label="开户名字："
    >
      <span class="desc">{{ commUserInfo.trueName || '-' }}</span>
    </FormItem>
    <FormItem
      label="身份证号："
    >
      <span class="desc">{{ commUserInfo.hiddenCertId || '-' }}</span>
    </FormItem>
  </div>
</template>

<script>
import { FormItem } from 'iview'
export default {
  components: {
    FormItem
  }
}
</script>

<style lang="scss" scoped>
.desc {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #333;
  letter-spacing: 0;
}
</style>
