<template>
  <div class="line-up">
    <div class="team-title">
      <DefaultImg
        :src="teamData.teamLogo"
        class="logo"
        :default-url="defaultImg.basketball"
      />
      <span :class="type">{{ teamData.teamName }}</span>
    </div>
    <div class="list">
      <dl>
        <dt>
          <div class="title">
            球员
          </div>
          <div class="cell">
            时间
          </div>
          <div class="cell">
            得分
          </div>
          <div class="cell">
            篮板
          </div>
          <div class="cell">
            助攻
          </div>
          <div class="cell">
            投篮
          </div>
          <div class="cell">
            三分
          </div>
          <div class="cell">
            罚球
          </div>
          <div class="cell">
            抢断
          </div>
          <div class="cell">
            盖帽
          </div>
          <div class="cell">
            失误
          </div>
          <div class="cell">
            犯规
          </div>
        </dt>
        <dd
          v-for="(item, index) in list"
          :key="index"
          :class="{'is-total': item.isTotal}"
        >
          <div class="title">
            {{ item.name || item.playerName }} {{ item.position ? `(${item.position})` : '' }}
          </div>
          <div :class="['cell', item.playTimeMax]">
            {{ item.playTime || '-' }}
          </div>
          <div :class="['cell', item.pointMax]">
            {{ item.point }}
          </div>
          <div :class="['cell', item.reboundMax]">
            {{ item.rebound }}
          </div>
          <div :class="['cell', item.assistMax]">
            {{ item.assist }}
          </div>
          <div :class="['cell', item.fieldGoalMadeRateMax]">
            {{ item.fieldGoalMade }}/{{ item.fieldGoalAttempted }}
          </div>
          <div :class="['cell', item.threePointMadeRateMax]">
            {{ item.threePointMade }}/{{ item.threePointAttempted }}
          </div>
          <div :class="['cell', item.freeThrowMadeRateMax]">
            {{ item.freeThrowMade }}/{{ item.freeThrowAttempted }}
          </div>
          <div :class="['cell', item.stealMax]">
            {{ item.steal }}
          </div>
          <div :class="['cell', item.blockMax]">
            {{ item.block }}
          </div>
          <div :class="['cell', item.turnoverMax]">
            {{ item.turnover }}
          </div>
          <div :class="['cell', item.foulMax]">
            {{ item.foul }}
          </div>
        </dd>
      </dl>
    </div>
  </div>
</template>
<script>
import DefaultImg from '@src/components/DefaultImg'
export default {
  components: {
    DefaultImg
  },
  props: {
    teamData: {
      type: Object,
      default: function() {
        return {}
      }
    },
    type: {
      type: String,
      default: 'red'
    }
  },
  data() {
    return {
      // 本场最佳列表
      playerTopList: [],
    }
  },
  computed: {
    list(){
      let arr = this.teamData.data || []
      let total = { // 统计初始值
        point: 0, 
        fieldGoalMade: 0,
        fieldGoalAttempted: 0,
        threePointMade: 0,
        threePointAttempted: 0,
        freeThrowMade: 0,
        freeThrowAttempted: 0,
        rebound: 0,
        assist: 0,
        steal: 0,
        block: 0,
        turnover: 0,
        foul: 0,
        offensiveRebound: 0,
        defensiveRebound: 0,
      }
      if(arr.length) {
        arr.forEach((item, index) => {
          item.fieldGoalMadeRate = item.fieldGoalMade/item.fieldGoalAttempted || 0
          item.threePointMadeRate = item.threePointMade/item.threePointAttempted || 0
          item.freeThrowMadeRate = item.freeThrowMade/item.freeThrowAttempted || 0
          // 统计计算
          total.point += parseFloat(item.point)
          total.fieldGoalMade += parseFloat(item.fieldGoalMade)
          total.fieldGoalAttempted += parseFloat(item.fieldGoalAttempted)
          total.threePointMade += parseFloat(item.threePointMade)
          total.threePointAttempted += parseFloat(item.threePointAttempted)
          total.freeThrowMade += parseFloat(item.freeThrowMade)
          total.freeThrowAttempted += parseFloat(item.freeThrowAttempted)
          total.rebound += parseFloat(item.rebound)
          total.offensiveRebound += parseFloat(item.offensiveRebound)
          total.defensiveRebound += parseFloat(item.defensiveRebound)
          total.assist += parseFloat(item.assist)
          total.steal += parseFloat(item.steal)
          total.block += parseFloat(item.block)
          total.turnover += parseFloat(item.turnover)
          total.foul += parseFloat(item.foul)
        })
        
        arr.push({ // 插入统计
          name: '统计',
          rowName: 'total',
          start: 1,
          playTime: null,
          point: total.point,
          fieldGoalMade: total.fieldGoalMade,
          fieldGoalAttempted: total.fieldGoalAttempted,
          threePointMade: total.threePointMade,
          threePointAttempted: total.threePointAttempted,
          freeThrowMade: total.freeThrowMade,
          freeThrowAttempted: total.freeThrowAttempted,
          rebound: `${total.rebound||0}(${total.offensiveRebound||0}/${total.defensiveRebound||0})`,
          assist: total.assist||'',
          steal: total.steal,
          block: total.block,
          turnover: total.turnover,
          foul: total.foul,
          isTotal: true
        })
        this.setMaxValue(arr.slice(0, arr.length-1), ['playTime', 'point', 'fieldGoalMadeRate', 'threePointMadeRate', 'freeThrowMadeRate', 'rebound', 'assist', 'steal', 'block', 'turnover', 'foul'])
      }
      return arr || []
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
    },
    setMaxValue(arr, value){
      if(Array.isArray(value)){
        value.forEach((per) =>{
          this.setPerMaxValue(arr, per)
        })
        return
      }
      this.setPerMaxValue(arr, value)
    },
    setPerMaxValue(arr, value){
      let valueArr = arr.map(o => o[value])
      let getMax = Math.max.apply(null, valueArr)
      arr.forEach((item) => { //将最大值设置属性
        if(item[value] === getMax) {
          this.$set(item, `${value}Max`, 'max-value')
        }
      })
    }
  }
}
</script>
<style lang="postcss" scoped>
.line-up {
  padding: 40px 12px 0 12px;
  .team-title {
    height: 44px;
    line-height: 44px;
    padding-left: 18px;
    .logo {
      float: left;
      width: 44px;
      height: 44px;
    }
    span {
      float: left;
      margin-left: 12px;
      font-size: 22px;
      color: #E15756;
      &.blue {
        color: #3683FF;
      }
    }
  }
  .list {
    margin-top: 12px;
    .max-value {
      font-weight: 600;
    }
    dl {
      dt {
        height: 42px;
        line-height: 42px;
        background: #FAFAFA;
        .title {
          color: #666666;
        }
      }
      dd {
        height: 52px;
        line-height: 52px;
        overflow: hidden;
        border-bottom: 1px solid #EAEAEA;
        .title {
          color: #333;
          min-height: 52px;
        }
        .cell{
          min-height: 52px;
        }
        &.is-total{
          font-weight: 600
        }
      }
      .title {
        float: left;
        width: 240px;
        font-size: 14px;
        padding-left: 18px;
      }
      .cell {
        width: 75px;
        float: left;
        text-align: center;
        font-size: 14px;
        color: #666666;
      }
    }
  }
}
</style>