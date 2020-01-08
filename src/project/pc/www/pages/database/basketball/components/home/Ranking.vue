<template>
  <div class="ranking">
    <div class="header-search clearfix">
      <p class="fl title">
        {{ seasonName }} {{ ballType || 'NBA' }}常规赛排名
      </p>
      <div class="fr">
        <div class="clearfix">
          <div class="fl btn">
            <span
              v-for="item in rank"
              :key="item.key"
              :class="activeRanking === item.key ? 'active': '' "
              @click="ranking(item.key)"
            >{{ item.name }}</span>
          </div>

          <div class="fl">
            <Select
              v-model="seasonId"
              style="width:140px;margin-right:16px;"
              @on-change="selectSeason"
            >
              <Option
                v-for="item in seasonList"
                :key="item.seasonId"
                :value="item.seasonId"
              >
                {{ item.seasonName }}赛季
              </Option>
            </Select>

            <Select
              v-model="gameType"
              style="width:92px"
              @on-change="getEastWestOrAreaList"
            >
              <Option :value="2">
                常规赛
              </Option>
              <Option :value="1">
                季前赛
              </Option>
            </Select>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="activeRanking === 1"
      class="content"
    >
      <RankingTable
        :type="activeRanking"
        :rank-data="eastWestData"
      />
    </div>
    <div
      v-if="activeRanking === 2"
      class="content"
    >
      <RankingTable
        :type="activeRanking"
        :rank-data="areaData"
      />
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'  
import {
  Select,
  Option
} from 'iview'
import RankingTable from '../components/RankingTable'
// import season from './../mixins/season'

export default {
  components: {
    Select,
    Option,
    RankingTable
  },
  // mixins: [season],
  props: {
    seasonList: {
      type: Array,
      default:() => []
    }
  },
  data() {
    return {
      rank: [
        {name: '东西部排名', key: 1},
        {name: '赛区排名', key: 2}
      ],
      activeRanking: 1,
      seasonId: '',
      seasonName: '',
      gameType: 2,
      eastWestData: [],
      areaData: [],
    }
  },
  computed: {
    ...mapGetters(['ballType'])
  },
  watch: {
    seasonId(val) {
      this.selectSeason(val)
    },
    seasonList(){
      let {seasonId} = Array.isArray(this.seasonList) && this.seasonList[0]
      this.seasonId = seasonId
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    ranking(index) {
      this.activeRanking = index
      this.getEastWestOrAreaList()
    },
    selectSeason(val) {
      const {seasonName} =  this.seasonList.find(item => item.seasonId === val)
      this.seasonName = seasonName
      this.getEastWestOrAreaList()
      this.selectGameType()
    },
    // 获取东西部排名OR获取赛区列表
    getEastWestOrAreaList() {
      const url = {
        1: 'alliance',
        2: 'section'
      }
      
      this.$get('v9/nba/teamRank/' + url[this.activeRanking], {seasonId: this.seasonId, groupId: this.gameType})
        .then((res) => {
          const {code, data} = res
          if (this.$judgeCode(code)) {
            if (this.activeRanking === 1) {
              this.eastWestData = data.ranks
            } else {
              this.areaData = data.ranks
            }
          } else {
            if (this.activeRanking === 1) {
              this.eastWestData = []
            } else {
              this.areaData = []
            }
          }
        })
    },

    selectGameType() {
      this.$emit('statistic', {groupId: this.gameType, seasonId: this.seasonId})
    }
  }
}
</script>

<style lang="scss" scoped>
.ranking {
  border-top: 1px solid #eee;
  margin-top: 40px;
  padding:0 40px 40px;
  background: #fff;
  .header-search {
    padding-top: 20px;
  }
  .title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    line-height: 29px;
  }

  .btn {
    display: inline-block;
    margin-right: 40px;
    span {
      width: 90px;
      height: 26px;
      line-height: 26px;
      font-size: 14px;
      text-align: center;
      color: #666;
      background: #FFFFFF;
      display: inline-block;
      cursor: pointer;
      &:hover {
        color: #FFFFFF;
        background: #3683FF;
      }
    }
    span:first-child {
       border: 1px solid #3683FF;
       border-right: none;
       border-radius: 4px 0 0 4px;
    }
    span:last-child {
      border: 1px solid #3683FF;
      border-left: none;
      border-radius: 0 4px 4px 0;
    }
    .active {
      font-size: 14px;
      color: #FFFFFF;
      background: #3683FF;
    }
  }

  /deep/ .ivu-select-selection {
    height: 26px;
    /deep/ .ivu-select-selected-value {
      height: 26px;
      line-height: 26px;
    }
    .ivu-icon-ios-arrow-down:before {
      font-size: 16px;
    }
  }
}
</style>
