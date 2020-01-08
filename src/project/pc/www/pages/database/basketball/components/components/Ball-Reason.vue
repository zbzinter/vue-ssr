<template>
  <div>
    <Select
      v-model="seasonId"
      class="select-log"
      @change="selectVal"
    >
      <Option
        v-for="item in seasonList"
        :key="item.seasonId"
        :value="item.seasonId"
      >
        {{ item.seasonName }}赛季
      </Option>
    </Select>
  </div>
</template>

<script>
import {
  Select,
  Option
} from 'iview'

export default {
  components: {
    Select,
    Option,
  },
  data() {
    return {
      leagueName: '',
      seasonId: '',
      seasonList: []
    }
  },
  created() {
    this.leagueName = this.$route.query.type 
    this.getSeasonList()
  },
  methods: {
    selectVal(val) {
      this.seasonId = val
      this.$emit('selectSeason', this.seasonId)
    },

    getSeasonList() {
      this.$get('v9/basketball/league/season/list', {
        leagueName: this.leagueName,
        limit: 1000
      }).then((res) => {
        const {data} = res
        if (data && data.seasons && data.seasons.length) {
          this.seasonList = data.seasons
          this.seasonId = data.seasons[0].seasonId
          this.selectVal(this.seasonId)
        } else {
          this.seasonList= []
        }
      })
      
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./../../style/selector.scss";
</style>