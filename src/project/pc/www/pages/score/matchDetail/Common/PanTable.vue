<!-- 亚盘table -->
<template>
  <div class="pan-table">
    <table>
      <thead>
        <tr>
          <th>公司</th>
          <th colspan="3">
            初指
          </th>
          <th colspan="3">
            即时
          </th>
          <th />
        </tr>
        <tr>
          <th
            v-for="(item, index) in titles"
            :key="index"
          >
            {{ item }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in oddsData"
          :key="index"
        >
          <td class="w-160 b-r">
            {{ item.bookName }}
          </td>
          <td class="w-160">
            {{ type === 'dx' ? item.value0ForType1:item.value0ForType2 }}
          </td>
          <td class="w-160">
            {{ item.ovalue0 }}
          </td>
          <td class="w-160 b-r">
            {{ type === 'dx' ? item.value0ForType2:item.value0ForType1 }}
          </td>
          <td class="w-160">
            {{ type === 'dx' ? item.valueForType1:item.valueForType2 }}
          </td>
          <td class="w-160">
            {{ item.ovalue }}
          </td>
          <td class="w-160 b-r">
            {{ type === 'dx' ? item.valueForType2:item.valueForType1 }}
          </td>
          <td>
            <router-link :to="`/score/detail/basketball/zhishu/${matchData.matchId}?type=${type}&bookId=${item.bookId}&typeId=${item.typeId}`">
              查看
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
    <no-data v-if="!oddsData.length" />
  </div>
</template>

<script>
import NoData from '@src/components/NoData'

export default {
  components: {
    NoData
  },
  props: [
    'ischeck',
    'isEarlyPan',
    'type',
    'titles',
    'matchData',
    'oddsData'
  ],
  data () {
    return {

    }
  },
  computed: {
  },
  watch: {

  },
  created () {

  },
  mounted () {

  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
/deep/ {
  .empty-text{
    background: #fff;
  }
}
$gray: #dedede;
$bg-gray: #f7f7f8;
  .w-100{
    width: 100px;
  }
  .w-160{
    width: 160px;
  }
  .w-260{
    width: 260px;
  }
  .w-320{
    width: 320px;
  }
.b-r{
  border-right:1px solid $gray;
}

    .pan-table{
      padding: 30px 0;
      background: #fff;
    }
    table{
      thead{
        tr:nth-of-type(1) th{
          background: #dedede;
        }
      }
      width: 100%;
      th{
        background: $bg-gray;
        padding: 8px 0;
      }
      tr{
        td{
          padding: 8px 0;
          border-bottom: 1px solid $gray;
        }
      }
      text-align: center;
    }
</style>
