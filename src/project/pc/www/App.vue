<template>
  <div id="app">
    <PageNav v-if="!noHeader" />
    <Personal />
    <div class="app-main">
      <router-view @hook:mounted="setNavIndex()" />
    </div>
    <PageFooter v-if="!noHeader" />
  </div>
</template>
<script>

import Vue from 'vue'
import { mapMutations, mapActions,mapGetters } from 'vuex'


export default {
  computed:{
    ...mapGetters(['noHeader'])
  },
  components: {
    'PageNav': () => import('@src/components/PageNav'),
    'PageFooter': () => import('@src/components/PageFooter'),
    'Personal': () => import('@pages/personal/login'),
  },
  beforeMount(){
    this.reloadGetUserInfo()
  },
  mounted(){
    import('@utils/initPage')
    let uweb = import('vue-uweb')
    Vue.use(uweb, '1277933609')

  },
  methods: {
    ...mapMutations(['reSecondNavTemp']),
    ...mapActions([
      'G_GetUserInfo',
    ]),
    setNavIndex(){
      // 篮球导航被选中的处理，后期路由需整体优化
      if(/basket/.test(this.$route.path)) this.reSecondNavTemp(1)
      if(/tennis/.test(this.$route.path)) this.reSecondNavTemp(2)
      if(/baseball/.test(this.$route.path)) this.reSecondNavTemp(4)
    },

    reloadGetUserInfo() {
      const uid = this.getUserInfo().uid
      const token = localStorage.getItem('token')

      if (uid && token) {
        this.G_GetUserInfo({uid, token })
          .then(() => {
          // this.reloadPage(500)
          })
          .catch(() => {
          // this.reloadPage(500)
          })
      }
      
    }
  }
}
</script>
<style scoped>
.app-main {
  min-height: 600px;
}
</style>
