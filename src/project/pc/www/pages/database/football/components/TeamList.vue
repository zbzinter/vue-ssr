<template>
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
    <div class="clearfix">
      <div class="item fl mr">
        <p class="tit">
          进球榜
        </p>
        <Table
          :columns="goalNav1"
          :data="goalData"
        >
          <template
            slot="index"
            slot-scope="{ row, index }"
          >
            <span>{{ index + 1 }}</span>
          </template>
          <template
            slot="name"
            slot-scope="{ row }"
          >
            <div class="item-name clearfix">
              <img
                :src="row.logoUrl"
                alt=""
                class="fl"
              >
              <span class="fl">{{ row.cnName }}</span>
            </div>
          </template>
          <template
            slot="number"
            slot-scope="{ row }"
          >
            <span>{{ row.total }} ({{ row.penaltyKick }})</span>
          </template>
        </Table>
      </div>
      <div class="item fl">
        <p class="tit">
          射门榜
        </p>
        <Table
          :columns="goalNav2"
          :data="shootData"
        >
          <template
            slot="index"
            slot-scope="{ row, index }"
          >
            <span>{{ index + 1 }}</span>
          </template>
          <template
            slot="name"
            slot-scope="{ row }"
          >
            <div class="item-name clearfix">
              <img
                :src="row.logoUrl"
                alt=""
                class="fl"
              >
              <span class="fl">{{ row.cnName }}</span>
            </div>
          </template>
          <template
            slot="number"
            slot-scope="{ row }"
          >
            <span>{{ row.total }} ({{ row.shotOnGoal || '0' }})</span>
          </template>
        </Table>
      </div>
      <div
        class="item"
        style="width:890px"
      >
        <p class="tit">
          犯规、红黄牌
        </p>
        <Table
          :columns="foulNav"
          :data="data"
        >
          <template
            slot="index"
            slot-scope="{ row, index }"
          >
            <span>{{ index + 1 }}</span>
          </template>
          <template
            slot="name"
            slot-scope="{ row }"
          >
            <div class="item-name clearfix">
              <img
                :src="row.logoUrl"
                alt=""
                class="fl"
              >
              <span class="fl">{{ row.cnName }}</span>
            </div>
          </template>
          <template
            slot="number"
            slot-scope="{ row }"
          >
            <span>{{ row.total }} ({{ row.penaltyKick || '0' }})</span>
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
  props: {
    leagueId: {
      default: 0,
      type: Number,
    }
  },
  data() {
    const goalNavData = [
      {
        title: '排名',
        align: 'center',
        width: '80',
        slot: 'index'
      },
      {
        title: '球队',
        align: 'left',
        slot: 'name'
      },
    ]
    return {
      spinShow: false,
      goalData: [],
      shootData: [],
      data: [],
      goalNav1: [
        ...goalNavData,
        {
          title: '进球(点球)',
          align: 'center',
          slot: 'number',
          width: '120'
        },
      ],
      goalNav2: [
        ...goalNavData,
        {
          title: '射门（射正）',
          align: 'center',
          slot: 'number',
          width: '120'
        },
      ],
      foulNav: [
        {
          title: '排名',
          align: 'center',
          slot: 'index'
        },
        {
          title: '球队',
          align: 'left',
          slot: 'name'
        }, 
        {
          title: '犯规',
          key: 'total',
          align: 'center',
        },
        {
          title: '红牌',
          align: 'center',
          key: 'redCard',
        },
        {
          title: '黄牌',
          align: 'center',
          key: 'yellowCard',
        },
      ]
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      const dataObj = {
        0: 'goalData',
        1: 'shootData',
        2: 'data' 
      };
      [...'.'.repeat(3)].forEach((item, index) => {
        this.spinShow = true
        this.$get('v9/queryMatchStat', {
          seasonId: this.$store.getters.seasonId,
          statType: index + 1,
        }).then((res) => {
          const {code, data} = res
          this.spinShow = false
          if(this.$judgeCode(code)) {
            this[dataObj[index]] = data
          } else {
            this[dataObj[index]] = []
          }
        }).catch(() => {
          this.spinShow = false
        })
      })
    },

    resetAndInit() {
      this.seasonId = this.$store.getters.seasonId
      this.init()
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
  width: 437px;
  display: inline-block;
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
.tit {
  font-family: PingFangSC-Semibold;
  font-size: 16px;
  color: #3683FF;
  letter-spacing: 0;
  display: inline-block;
  width: 100px;
  padding: 20px 0 12px 0;
}
</style>
