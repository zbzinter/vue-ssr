<template>
  <div>
    <div class="selector">
      <div class="reason selector-item">
        <p class="title">
          赛季
        </p>
        <SelectReason @selectSeason="getSquadList" />
      </div>
    </div>
    <squad-list-table :data="squadList" />
  </div>
</template>

<script>

import SquadListTable from '../components/SquadListTable'
import SelectReason from '../components/Ball-Reason'
// import season from './../../mixins/season'

export default {
  components: {
    SelectReason,
    SquadListTable
  },
  // mixins: [season],
  data() {
    return {
      squadList: [],
    }
  },
  methods: {
    selectSeason(seasonId) {
      this.getSquadList(seasonId)
    },

    getSquadList(seasonId) {
      this.$get('v9/basketball/team/players', 
        {teamId: this.$route.query.id, seasonId})
        .then((res) => {
          const {code, data: {players}} = res
          if(this.$judgeCode(code) && players && players.length) {
            this.squadList = players
          } else {
            this.squadList = []
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./../../style/selector.scss";
</style>
