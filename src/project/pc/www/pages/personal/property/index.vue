<template>
  <div class="property">
    <UserInfo />
    <router-view />
  </div>
</template>
<script>
import UserInfo from '@src/components/personal/user-info'

export default {
  components: {
    UserInfo,
  }
}
</script>


