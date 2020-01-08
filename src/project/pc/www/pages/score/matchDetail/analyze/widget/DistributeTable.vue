<!-- 进球分布table -->
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
import {Table} from 'iview'
export default {
  name: 'DistributeTable',
  components: {
    Table
  },
  props: [
    'titles',
    'objVal',
    'rowTitle'
  ],
  computed: {
    columns () {
      return [  
        {
          title: ' ',
          key: 'typeStr',
          width: 40
        },
        {
          title: '1-10′',
          key: 'dot1',
          align: 'center'
        },
        {
          title: '11-20′',
          key: 'dot2',
          align: 'center'
        },
        {
          title: '21-30′',
          key: 'dot3',
          align: 'center'
        },
        {
          title: '31-40′',
          key: 'dot4',
          align: 'center'
        },
        {
          title: '41-45′',
          key: 'dot5',
          align: 'center'
        },
        {
          title: '46-50′',
          key: 'dot6',
          align: 'center'
        },
        {
          title: '51-60′',
          key: 'dot7',
          align: 'center'
        },
        {
          title: '61-70′',
          key: 'dot8',
          align: 'center'
        },
        {
          title: '71-80′',
          key: 'dot9',
          align: 'center'
        },
        {
          title: '81-90+′',
          key: 'dot10',
          align: 'center'
        },
      ]
    },
    getTransferArrData(){
      return this.objVal
    },
    isEmpty () {
      return !this.objVal.length
    }
  }
}
</script>

<style scoped lang="postcss">
@import '../../Common/detail.scss';
  /deep/ {
    tr{
      td:first-child, th:first-child{
        .ivu-table-cell{
          padding-left: 16px;
          padding-right: 8px;
        }
      }
      td:not(:first-child), th:not(:first-child){
        .ivu-table-cell{
          padding-left: 4px;
          padding-right: 4px;
        }
      }
    }

  }
</style> 