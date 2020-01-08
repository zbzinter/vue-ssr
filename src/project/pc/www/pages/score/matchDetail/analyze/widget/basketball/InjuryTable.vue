<!-- 伤停名单table -->
<template>
  <div :class="['injury-inner', {'no-empty': injuryData.length}]">
    <Table
      :columns="columns"
      :data="injuryData"
    />
  </div>
</template>

<script>
import { Table } from 'iview'
export default {
  name: 'InjuryTable',
  components: {
    Table
  },
  props: {
    injuryData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      
    }
  },
  computed: {
    columns () {
      return [  
        {
          title: '球队',
          key: 'teamName',
          width: 180
        },
        {
          title: '球员',
          key: 'playerName',
          width: 180,
          align: 'center'
        },
        {
          title: '位置',
          key: 'position',
          width: 80
        },
        {
          title: '原因',
          key: 'reason',
          minWidth: 200,
          align: 'center'
        },
        {
          title: '日期',
          key: 'date',
          width: 100,
          align: 'left',
          // render: (h, {row})=>{
          //   return h('span', {
          //   }, this.format(this.dayjs(row.matchTime).format('YYYY-MM-DD')))
          // }
        },
        {
          title: '备注',
          key: 'remark',
          minWidth: 150,
          align: 'center'
        }
      ]
    }
  },
  methods: {
    
  }
}
</script>

<style scoped lang="postcss">
  i{
    font-style: normal
  }
  table.recent-table{
    width: 100%;
    thead{
      th{
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #666666;
        letter-spacing: 0;
        text-align: left;
        width: 130px;
        height: 42px;
        line-height: 42px;
        background: #FAFAFA;
      }
    }
    tbody{
      tr{
        
      }
    }
  }
</style>
