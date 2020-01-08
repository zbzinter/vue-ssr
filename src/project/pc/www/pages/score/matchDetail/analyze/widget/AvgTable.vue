<!--平均统计table -->
<template>
  <div>
    <Table
      :columns="columns"
      :data="getTransferArrData"
      size="small"
    />
  </div>
</template>

<script>
import { Decimal } from 'decimal.js'
import {Table} from 'iview'
export default {
  name: 'AvgTable',
  components: {
    Table
  },
  props: [
    'titles',
    'objVal',
    'rowTitle'
  ],
  computed: {
    getTrendData(){
      return this.objVal || {}
    },
    columns () {
      return [  
        {
          title: '赛事',
          key: 'name',
          width: 120
        },
        {
          title: '总平均数',
          key: 'count',
          width: 120,
          align: 'center'
        },
        {
          title: '主场',
          key: 'win',
          align: 'center'
        },
        {
          title: '客场',
          key: 'lost',
          align: 'center'
        }
      ]
    },
    getTransferArrData(){
      let {getPercent, getTrendData, objVal} = this
      if (!Object.keys(getTrendData).length) return []
      let getTransferArrData = []
      let $ind = 0
      for (let [index, item] of Object.entries(this.rowTitle)) {
        getTransferArrData[$ind] = getTransferArrData[$ind] || {}
        getTransferArrData[$ind] = {
          name: item,
          count: getPercent(objVal[`host${index}`] + objVal[`guest${index}`]),
          win: (objVal[`host${index}`] || objVal[`host${index}`]===0) ? `${objVal[`host${index}`]}球` : '-',
          lost: (objVal[`guest${index}`] || objVal[`guest${index}`]===0) ? `${objVal[`guest${index}`]}球` : '-'
        }
        $ind++
      }
      return getTransferArrData
    }
  },
  methods: {
    getPercent (total) {
      return total ? `${new Decimal(total).dividedBy(2)}球` : '-'
    }
  }
}
</script>

<style scoped lang="postcss">
@import '../../Common/detail.scss';
</style> 