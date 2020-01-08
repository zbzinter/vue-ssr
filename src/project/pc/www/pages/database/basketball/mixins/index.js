import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      seasonId: '',
      seasonList: []
    }
  },
  computed: {
    ...mapGetters(['ballType'])
  },
  created() {
    // this.getCurrentSeasonId()
    this.getSeasonList()
  },
  methods: {
    async getCurrentSeasonId() {
      const { code, data: { seasonId }, msg } = await this.$get('v9/basketball/season/current',
        { leagueName: this.ballType || 'NBA' })
      if (this.$judgeCode(code)) {
        this.seasonId = seasonId
        localStorage.setItem('seasonId', seasonId)
      } else {
        this.$error(msg)
      }
    },

    // 获取赛季列表
    async getSeasonList() {
      try {
        const { code, data, msg } =
          await this.$get('v9/basketball/league/season/list',
            { leagueName: this.ballType || 'NBA' })
        if (this.$judgeCode(code)) {
          this.seasonList = data.seasons
        } else {
          this.$error(msg)
        }
      } catch (e) { this.$error('请求赛季接口失败') }
    },

  }

}