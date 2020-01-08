<template>
  <div class="ranking">
    <table class="table">
      <thead>
        <tr class="table-header">
          <th class="table-column_1">
            比赛日期
          </th>
          <th class="table-column_2">
            赛事
          </th>
          <th class="table-column_3">
            对阵
          </th>
          <th class="table-column_4">
            场馆
          </th>
        </tr>
      </thead>
      <tbody>
        <tr class="table-tbody">
          <td class="table-column_1">
            2012-01-09 04:03:00
          </td>
          <td class="table-column_2">
            <div>
              <p>美国男子职业篮球赛</p>
              <p>季后赛</p>
            </div>
          </td>
          <td class="table-column_3">
            <div>
              <div class="name pb">
                <img
                  src=""
                  alt=""
                  class="avatar"
                >
                <span>多啦是大</span>
              </div>
              <div class="name">
                <img
                  src=""
                  class="avatar"
                  alt=""
                >
                <span>多啦是大</span>
              </div>
            </div>
          </td>
          <td class="table-column_4">
            1
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    gameResult: {
      default: () => [],
      type:Array,
    }
  },
}
</script>

<style lang="scss" scoped>
.table {
  width: 100%;
  &-header {
    background: #eee;
    border: 1px solid #eee;
    height: 40px;
    line-height: 40px;
    th {
      width: 300px
    }
  }

  &-tbody {
    td {
      padding: 10px 0;
      text-align: center
    }
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 20px;
      display: inline-block;
      background: #eee;
    }
    .pb {
      padding-bottom: 5px;
    }
  }
}
</style>
