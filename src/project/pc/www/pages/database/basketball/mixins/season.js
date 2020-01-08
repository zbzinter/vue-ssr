import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      seasonList: []
    }
  },
  computed: {
    ...mapGetters(['ballType'])
  },
  created() {
    this.getSeasonList()
  },
  methods: {

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