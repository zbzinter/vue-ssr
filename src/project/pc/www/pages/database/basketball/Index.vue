<template>
  <div class="page-inner">
    <NavHeader @selectHomeAndTeam="selectHomeAndTeam" />
    <div
      v-if="key === 'home'"
      class="inner"
    >
      <Home />
    </div>
    <div
      v-if="key === 'team'"
      class="inner"
    >
      <Team />
    </div>
  </div>
</template>
<script>

import NavHeader from './components/Header'
import Home from './Home'

export default {
  components: {
    NavHeader,
    Home,
    'Team': () => import('./Team')
  },
  data() {
    return {
      ballType: 'NBA',
      key: 'home',
    }
  },
  methods: {
    selectHomeAndTeam({ballType, key}) {
      this.ballType = ballType
      this.key = key
    }
  }
}
</script>
<style scoped>
.page-inner {
  margin-top: 50px;
}
.inner {
  margin-top: 40px;
}
</style>
