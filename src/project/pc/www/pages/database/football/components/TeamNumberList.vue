<template>
  <div class="number-list">
    <div class="btn">
      <span
        :class="activeIndex === 0 ? 'active' : ''"
        @click="handleClickTab(0)"
      >射手榜</span>
      <span
        :class="activeIndex === 1 ? 'active' : ''"
        @click="handleClickTab(1)"
      >助攻榜</span>
    </div>

    <div class="spin-article">
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
      <div style="min-height: 400px;">
        <Table
          v-if="activeIndex === 0"
          :columns="goalNav"
          :data="tableData"
        >
          <template
            slot="index"
            slot-scope="{ row, index }"
          >
            <span>{{ index + 1 }}</span>
          </template>
          <template
            slot="playerName"
            slot-scope="{ row }"
          >
            <div class="item-name clearfix">
              <img
                :src="row.playerLogo"
                alt=""
                class="fl"
              >
              <span class="fl">{{ row.playerName }}</span>
            </div>
          </template>
      
          <template
            slot="goalsPenalties"
            slot-scope="{ row }"
          >
            <span class="goals-penalties">{{ row.goals }} ({{ row.penalties }})</span>
          </template>
          <template
            slot="playingTimeGoals"
            slot-scope="{ row }"
          >
            <span v-if="row.playingTime && row.goals">{{ (row.playingTime/row.goals).toFixed(2) }}</span>
            <span v-else>-</span>
          </template>
        </Table>
        <Table
          v-if="activeIndex === 1"
          :columns="assistNav"
          :data="tableData"
        >
          <template
            slot="index"
            slot-scope="{ row, index }"
          >
            <span>{{ index + 1 }}</span>
          </template>
          <template
            slot="playerName"
            slot-scope="{ row }"
          >
            <div class="item-name clearfix">
              <img
                :src="row.playerLogo"
                alt=""
                class="fl"
              >
              <span class="fl">{{ row.playerName }}</span>
            </div>
          </template>
      
          <template
            slot="goalsPenalties"
            slot-scope="{ row }"
          >
            <span class="goals-penalties">{{ row.goals }} ({{ row.penalties }})</span>
          </template>
        </Table>
      </div>
    </div> 
  </div>
</template>

<script>
import {
  Table,
  Spin,
  Icon
} from 'iview'

export default {
  components: {
    Table,
    Spin,
    Icon
  },
  data() {
    return {
      spinShow: false,
      activeIndex: 0,
      tableData: [],
      goalNav: [
        {
          title: '排名',
          align: 'center',
          slot: 'index',
          width: '60'
        },
        {
          title: '球员',
          align: 'center',
          slot: 'playerName',
          width: '200'
        },
        {
          title: '球队',
          align: 'center',
          key: 'teamName'
        }, 
        {
          title: '国籍',
          key: 'nationality',
          align: 'center',
        },
        {
          title: '场次(替补)',
          align: 'center',
          key: 'presence',
        },
        {
          title: '出场时间',
          key: 'playingTime',
          align: 'center',
        },
        {
          title: '进球(点球)',
          align: 'center',
          slot: 'goalsPenalties'
        },
        {
          title: '进球耗时(分)',
          align: 'center',
          slot: 'playingTimeGoals',
          width: '110'
        },
      ],
      assistNav: [
        {
          title: '排名',
          align: 'center',
          slot: 'index',
          width: '60'
        },
        {
          title: '球员',
          align: 'center',
          slot: 'playerName',
          width: '200'
        },
        {
          title: '球队',
          align: 'center',
          key: 'teamName'
        }, 
        {
          title: '国籍',
          key: 'nationality',
          align: 'center',
        },
        {
          title: '助攻',
          key: 'assist',
          align: 'center',
        },
      ],
    }
  },
  created() {
    this.getTableData(0)
  },
  methods: {
    handleClickTab(index) {
      this.activeIndex = index
      this.getTableData(this.activeIndex)
    },

    getTableData(index) {
      this.spinShow = true
      this.$get('v9/queryShooterRank', {
        seasonId: this.$store.getters.seasonId,
        statType: index + 1,
      }).then((res) => {
        this.spinShow = false
        const {code, data} = res
        if(this.$judgeCode(code)) {
          this.tableData = data
        } else {
          this.tableData = []
        }
      }).catch(() => {
        this.spinShow = false
      })
    },

    resetAndInit() {
      this.seasonId = this.$store.getters.seasonId
      this.getTableData(0)
    }
    
  }
}
</script>

<style lang="scss" scoped>
.number-list {
  .btn {
    padding: 20px 0;
    span {
      display: inline-block;
      width: 92px;
      border-radius: 4px;
      font-size: 14px;
      color: #666;
      height: 26px;
      line-height: 26px;
      text-align: center;
      border: 1px solid #D7D7D7;
      cursor: pointer;
      margin-right: 15px;
      &:hover {
        color: #3683FF;
      }
    }
    .active {
      background: #3683FF;
      color: #ffffff;
      border: 1px solid #3683FF;
      &:hover {
        color: #ffffff;
      }
    }
  }
  .item-name {
    img {
      width: 24px;
      height: 24px;
    }
    span {
      font-size: 12px;
      padding: 3px 0 0 5px;
      color: #333333;
      display: inline-block;
    }
  }
  .goals-penalties {
    font-size: 12px;
    color: #E15756;
  }
}
.spin-article {
  min-height: 100px !important;
}
</style>
