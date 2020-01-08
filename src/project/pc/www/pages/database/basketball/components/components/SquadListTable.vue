<template>
  <div class="squad-list">
    <table
      v-if="data.length"
      class="table"
    >
      <thead>
        <tr>
          <th class="table-column_1">
            号码
          </th>
          <th class="table-column_2">
            球员
          </th>
          <th class="table-column_3">
            位置
          </th>
          <th class="table-column_4">
            年龄
          </th>
          <th class="table-column_5">
            身高/cm
          </th>
          <th class="table-column_6">
            体重/kg
          </th>
          <th class="table-column_7">
            国籍
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in data"
          :key="index"
          class="content"
        >
          <td class="table-column_1">
            {{ item.shirtNo }}
          </td>
          <td class="table-column_2">
            <div class="clearfix">
              <img
                :src="item.playerLogo"
                alt=""
                class="logo fl"
              >
              <span class="name fl">{{ item.playerName }}</span>
            </div>
          </td>
          <td class="table-column_3">
            {{ item.position || '-' }}
          </td>
          <td class="table-column_4">
            {{ item.age }}
          </td>
          <td class="table-column_5">
            {{ item.height }}
          </td>
          <td class="table-column_6">
            {{ item.weight }}
          </td>
          <td class="table-column_7">
            {{ item.nation || '-' }}
          </td>
        </tr>
      </tbody>
    </table>
    <NoData v-else />
  </div>
</template>

<script>

import NoData from '@src/components/NoData'

export default {
  components: {
    NoData
  },
  props: {
    data: {
      default: () => [],
      type: Array,
    }
  }
}
</script>

<style lang="scss" scoped>

@import "./../../style/index.scss";

.squad-list {
  padding-bottom: 40px;
}
.table {
  width: 1120px;
  margin-left: 40px;

  td {
    padding: 0;
    height: 52px;
    line-height: 52px;
    color: #333;
  }
}
.table-column_1 {
  width: 70px;
}
.table-column_2 {
  width: 195px;
  text-align: left !important;
}

.table-column_3 {
  width: 90px;
}
.table-column_4, .table-column_5, .table-column_6 {
  width: 120px;
}

.table-column_7 {
  width: 105px;
}

.content {

  .logo {
    width: 32px;
    height: 32px;
    margin-top: 10px;
    display: inline-block;
  }
  
  .name {
    font-size: 14px;
    padding-left: 20px;
    font-weight: 700;
    color: #333;
  }
}
</style>
