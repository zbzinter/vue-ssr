
<template>
  <div class="header clearfix">
    <div class="fl">
      <div class="clearfix info">
        <img
          :src="logoUrl"
          alt=""
          class="fl"
        >
        <span class="name fl">{{ name }}</span>
      </div>
    </div>
    <div class="fr select">
      <Select
        v-model="seasonId"
        style="width:150px"
        @on-change="selectSeasonId"
      >
        <Option
          v-for="item in season"
          :key="item.seasonId"
          :value="item.seasonId"
        >
          {{ item.seasonName }} 赛季
        </Option>
      </Select>
    </div>
  </div>
</template>

<script>
import {
  Select, Option
} from 'iview'

export default {
  components: {
    Select,
    Option
  },
  props: {
    leagueId: {
      default: 0,
      type: Number,
    }
  },
  data() {
    return {
      type: '',
      id: '',
      season: [],
      seasonId: '',
      logoUrl: '',
      name: '',
    }
  },
  watch: {
    leagueId : {
      handler: function(val) {
        this.getLogoName(val)
        this.init(val)
      },
      deep: true
    }
  },
  methods: {
    init(val) {

      this.$get('/v4/league/seasons', {
        leagueId : val || 2
      }).then((res) => {
        const {code, data} = res
        if(this.$judgeCode(code)) {
          this.season = data.seasons
          this.seasonId = data.seasons[0].seasonId
          // this.$store.commit('setSeasonId', this.seasonId)
          this.selectSeasonId(this.seasonId)
        }
      })

    },

    getLogoName(val) {
      this.$get('v9/league/info', {leagueId: val || 2})
        .then((res) => {
          const {code, data, msg} = res
          if (this.$judgeCode(code)) {
            this.logoUrl = data.logoUrl
            this.name = data.cnName || data.cnAlias
          } else {
            this.$error(msg)
          }
        })
    },

    selectSeasonId(val) {
      this.$store.commit('setSeasonId', val)
      this.$emit('selectSeasonId', val)
    },

  }
}
</script>

<style lang="scss" scoped>
.header {
  background: #fff;
  padding: 40px 40px 40px 48px;
  width: 970px;
  .info {
    width: 470px;
    display: inline-block;
  }
  img {
    display: inline-block;
    width: 82px;
    height: 82px;
    border-radius: 41px;
  }
  .name {
    font-family: PingFangSC-Semibold;
    font-size: 28px;
    color: #333333;
    padding: 20px 0 0 20px;
  }
}

</style>
