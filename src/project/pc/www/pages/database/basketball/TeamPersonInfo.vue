
<template>
  <div class="database page-inner">
    <NavHeader
      :home-and-team="homeAndTeam"
      :ball-type="ballType"
      :team-name="name"
      @selectHomeAndTeam="selectHomeAndTeam"
    />
    <TeamInfo />
    <div class="operate">
      <span
        class="operate-name"
        :class="activeIndex === 1 ? 'active' : ''"
        @click="handleTab(1)"
      >球员数据</span>
      <span
        class="operate-name"
        :class="activeIndex === 2 ? 'active' : ''"
        @click="handleTab(2)"
      >赛程赛果</span>
      <span
        class="operate-name"
        :class="activeIndex === 3 ? 'active' : ''"
        @click="handleTab(3)"
      >阵容名单</span>
    </div>
    <div class="inner">
      <component :is="componentName" />
    </div>
  </div>
</template>

<script>

import NavHeader from './components/Header'
import TeamInfo from './components/team-person-info/TeamInfo'
import PlayerData from './components/team-person-info/PlayerData'
import SquadList from './components/team-person-info/SquadList'
import GameResults from './components/team-person-info/GameResults'

export default {
  components: {
    NavHeader,
    TeamInfo,
    'playerData' : PlayerData,
    'gameResults' : GameResults,
    'squadList' : SquadList,
  },
  data () {
    return {
      activeIndex: 1,
      name: '',
      componentName: 'playerData',
      componentObj: {
        1: 'playerData',
        2: 'gameResults',
        3: 'squadList'
      },
      homeAndTeam: '',
      ballType: '',
    }
  },
  watch: {

  },
  created() {
    
  },
  mounted () {
    // 默认选中
    setTimeout(() => {
      this.homeAndTeam = this.$route.query.key
      this.ballType = this.$route.query.type
    }, 400)
    if (this.$route.query.index) {
      this.name = this.$route.query.name
      this.handleTab(Number(this.$route.query.index))
    }
  },
  methods: {
    handleTab(index) {
      this.activeIndex = index
      this.componentName = this.componentObj[index]
    },

    selectHomeAndTeam() {

    }
  },
  
}
</script>

<style scoped lang="scss">

.page-inner {
  margin-top: 50px;
}

.operate {
  border-bottom: 1px solid #ccc;
  background: #fff;
  &-name {
    font-size: 16px;
    height: 56px;
    line-height: 56px;
    margin-left: 40px;
    color: #333;
    text-align: center;
    display: inline-block;
    cursor: pointer;
    &:hover {
      color: #2d8cf0;
      border-bottom: 4px solid #3683FF;
    }
  }
  .active {
    color: #2d8cf0;
    border-bottom: 4px solid #3683FF;
  }
}
.inner {
  background: #fff;
}
</style>
