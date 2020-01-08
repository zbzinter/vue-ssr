<template>
  <div>
    <div class="selector">
      <span
        v-for="(e, index) in navTab"
        :key="index"
        :class="activeIndex === index ? 'active' : '' "
        class="name ellipsis"
        @click="select(e, index)"
      >{{ e.groupName }}</span>
      <div
        v-if="isShow"
        class="group"
      >
        <span
          v-for="(item, index) in groupData"
          :key="index"
          class="letter"
          :class="letterActiveIndex === index ? 'letter-active' : '' "
          @click="selectGroup(item, index)"
        >{{ item.groupName || '其它' }}</span>
      </div>
    </div>
    <div class="table-content spin-article">
      <Spin
        v-if="spinShow"
        fix
      >
        <Icon
          type="ios-loading"
          size="18"
          class="spin-icon-load"
        />
        <div>Loading</div>
      </Spin>
    
      <Table
        :columns="resultHeader"
        :data="tableData"
      >
        <template slot="name">
          {{ groupName }}
        </template>
        <template
          slot="matchTime"
          slot-scope="{ row }"
        >
          {{ dayjs(row.matchTime).format('YYYY-MM-DD HH:mm') }}
        </template>
        <template
          slot="hostTeam"
          slot-scope="{ row }"
        >
          <div class="team clearfix">
            <img
              :src="row.hostTeamLogo"
              alt=""
              class="fr"
            >
            <Tooltip
              class="fr"
              placement="top"
              :content="row.hostTeamName"
            >
              <span class="team-name ellipsis text-right">{{ row.hostTeamName }}</span>
            </Tooltip>
          </div>
        </template>
        <template
          slot="score"
          slot-scope="{ row }"
        >
          <div v-if="row.matchState !== 1">
            <span style="color:#E15756">{{ `${row.hostTeamNormalScore}` }} </span><span>:</span><span style="color:#E15756"> {{ `${row.guestTeamNormalScore}` }}</span>
          </div>
          <div v-if="row.matchState === 1">
            <span>vs</span>
          </div>
        </template>
        <template
          slot="guestTeam"
          slot-scope="{ row }"
        >
          <div class="team clearfix">
            <img
              :src="row.guestTeamLogo"
              alt=""
              class="fl"
            >
            <Tooltip
              placement="top"
              class="fl"
              :content="row.guestTeamName"
            >
              <span class="team-name ellipsis text-left">{{ row.guestTeamName }}</span>
            </Tooltip>
          </div>
        </template>
        <template
          slot="asiaRateStr"
          slot-scope="{ row }"
        >
          <span>{{ row.asiaRateStr || '-' }}</span>
        </template>
        <template
          slot="dxRateStr"
          slot-scope="{ row }"
        >
          <span>{{ row.dxRateStr || '-' }}</span>
        </template>
        <template
          slot="analyze"
          slot-scope="{ row }"
        >
          <p class="red-text">
            <router-link :to="`/score/detail/football/analyze/${row.matchId}`">
              析
            </router-link>
          </p>
        </template>
      </Table>
    </div>
  </div>
</template>

<script>

import {
  Table,
  Spin,
  Icon,
  Tooltip
} from 'iview'
import dayjs from 'dayjs'

import mixins from '../mixins'

export default {
  components: {
    Table,
    Spin,
    Icon,
    Tooltip
  },
  mixins: [mixins],
  props: {
    leagueId: {
      default: 0,
      type: Number,
    },
  },
  data() {
    return {
      spinShow: true,
      activeIndex: '',
      letterActiveIndex: -1,
      tableData: [],
      navTab: [],
      groupData: [],
      groupId: 0,
      seasonId: 0,
      isShow: false,
      id: '',
      groupName: ''
    }
  },
  watch: {
    leagueId : {
      handler: function() {
        this.seasonId = this.$store.getters.seasonId || Number(this.$route.query.seasonId)
        this.reset()
        this.init()
      },
      deep: true
    },
  },
  created() {
    // 切换
    this.seasonId = this.$store.getters.seasonId || Number(this.$route.query.seasonId)
    this.init()
  },
  methods: {
    init() {
      if (this.seasonId) {
        this.$get('/v22/queryAgenda', {seasonId: this.seasonId}).then((res) => {
          const {code,data} = res
          if (this.$judgeCode(code)) {
            this.navTab = data.rounds

            // 默认选中当前的赛事
            data.rounds.forEach((ele, index) => {
              if (ele.groupId === data.groupId) {
                this.select(ele, index)
                let roundIndex = ele.roundInfo.findIndex(item => item.groupName === data.round)
                roundIndex = roundIndex === -1 ? 0 : roundIndex
                this.selectGroup(ele.roundInfo[roundIndex], roundIndex)
              }
            })

          }
        })
      }
    },

    select(e, index) {
      this.letterActiveIndex = 0
      this.activeIndex = index
      if (e.roundInfo.length > 0) {
        this.tableData = []
        this.groupData = e.roundInfo
        this.groupId = this.groupData[0].groupId
        this.isShow = true
        this.getTableData(this.groupData[0])
      }
    },

    selectGroup(item, index) {
      this.letterActiveIndex = index
      this.groupId = item.groupId
      this.getTableData(item)
    },

    getTableData(param) {
      this.spinShow = true
      this.groupName = param.groupName
      this.tableData = []
      let postData = {
        seasonId: this.seasonId || 21,
        leagueId: this.leagueId,
        groupId: this.groupId,
      }
      if (this.groupName != null) {
        postData.round = this.groupName
      }
      
      this.$get('v4/league/round', postData).then((res) => {
        this.spinShow = false
        const {code, data} = res
        if (this.$judgeCode(code)) {
          this.tableData = data.matches
        }
      }).catch(() => {
        this.spinShow = false
      })
    },

    reset() {
      this.activeIndex = ''
      this.letterActiveIndex = -1
      this.groupData = []
      this.tableData = []
      this.navTab = []
    },

    resetAndInit() {
      this.seasonId = this.$store.getters.seasonId
      this.reset()
      this.init()
    }
  }
}
</script>

<style lang="scss" scoped>
.selector {
  margin-top: 20px;
  .name {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    border-radius: 4px;
    padding: 0 5px;
    height: 32px;
    line-height: 32px;
    color: #666666;
    border: 1px solid #D7D7D7;
    display: inline-block;
    text-align: center;
    cursor: pointer;
    margin: 0 15px 15px 0;
    width: 98px;
    &:hover {
       color: #3683FF;
       border: 1px solid #3683FF;
    }
  }
  .name:nth-of-type(8n) {
    margin-right: 0
  }
  .active {
    background: #3683FF;
    color: #fff;
    border: none;
    &:hover {
      color: #fff;
    }
  }
  .letter {
    display: inline-block;
    background: #FAFAFA;
    border-radius: 4px;
    font-size: 14px;
    color: #666666;
    width: 100px;
    padding: 5px 0;
    text-align: center;
    margin:0 8px 8px 0;
    cursor: pointer;
    &:hover {
      color: #3683FF;
    }
  }
  .letter-active {
    background: #3683FF;
    color: #fff;
    border: none;
    &:hover {
      color: #fff;
    }
  }
}

.table-content {
  margin-top: 20px;
  margin-bottom: 40px;
}
.team {
  display: inline-block;
  min-width: 120px;
  vertical-align: middle;
  img {
    width: 24px;
    height: 24px;
    display: inline-block;
    margin-top: 10px;
  }

  .team-name {
    width: 100px;
    padding-top: 12px;
    display: inline-block;
  } 
  .text-left {
    text-align: left;
    padding-left: 5px;
  }
  .text-right {
    text-align: right;
    padding-right: 5px;
  }
}
/deep/ .ivu-table-cell {
  padding: 0 5px;
}
.red-text {
  a {
    color: #F82301;
  }
}
</style>
