<template>
  <div class="ranking-table">
    <div v-if="rankData.length">
      <div
        v-for="(item, index) in rankData"
        :key="index"
        class="item"
      >
        <p
          v-if="item.alliance"
          class="title"
        >
          {{ item.alliance === 1 ? '东部': '西部' }}排名
        </p>
        <p
          v-if="item.sectionId"
          class="title"
        >
          {{ item.sectionId | returnAreaText }}
        </p>
        <table class="table">
          <thead>
            <tr>
              <th class="table-column_1">
                排名
              </th>
              <th class="table-column_2">
                球队
              </th>
              <th class="table-column_3">
                胜
              </th>
              <th class="table-column_4">
                负
              </th>
              <th class="table-column_5">
                胜率
              </th>
              <th class="table-column_6">
                胜场差
              </th>
              <th class="table-column_7 equate">
                主场
              </th>
              <th class="table-column_8 equate">
                客场
              </th>
              <th class="table-column_9 equate">
                赛区
              </th>
              <th
                v-if="type === 1"
                class="table-column_10 equate"
              >
                {{ item.alliance === 1 ? '东部': '西部' }}
              </th>
              <th class="table-column_11 equate">
                得分/场
              </th>
              <th class="table-column_12 equate">
                失分/场
              </th>
              <th class="table-column_13 equate">
                净胜/场
              </th>
              <th class="table-column_14 equate">
                近10场
              </th>
              <th class="table-column_15">
                连胜/负
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(e, key) in item.teams"
              :key="e.teamId"
              class="content"
            >
              <td class="table-column_1">
                {{ key + 1 }}
              </td>
              <td class="table-column_2">
                <a
                  class="team"
                  target="_blank"
                >
                  <img
                    :src="e.logoUrl"
                    alt=""
                  >
                  <span class="name w-142">{{ e.teamName }}  <span class="tip"> -联 </span> </span>
                </a>
              </td>
              <td class="table-column_3">
                {{ e.winNum }}
              </td>
              <td class="table-column_4">
                {{ e.loseNum }}
              </td>
              <td class="table-column_5">
                {{ e.winRate }}
              </td>
              <td class="table-column_6">
                {{ e.absWinLose }}
              </td>
              <td class="table-column_7">
                {{ e.hostWinNum }} - {{ e.hostLoseNum }}
              </td>
              <td class="table-column_8">
                {{ e.guestWinNum }} - {{ e.guestLoseNum }}
              </td>
              <td class="table-column_9">
                {{ e.sectionWinNum }} - {{ e.sectionLoseNum }}
              </td>
              <td
                v-if="type === 1"
                class="table-column_10"
              >
                {{ e.allianceWinNum }} - {{ e.allianceLoseNum }}
              </td>
              <td class="table-column_11">
                {{ e.avgWinScore }}
              </td>
              <td class="table-column_12">
                {{ e.avgLoseScore }}
              </td>
              <td class="table-column_13">
                {{ e.absAvgScore }}
              </td>
              <td class="table-column_14">
                {{ e.last10WinNum }} - {{ e.last10LoseNum }}
              </td>
              <td class="table-column_15">
                {{ e.resultStat | returnResultStat }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <NoData v-else />
  </div>
</template>

<script>

import NoData from '@src/components/NoData'

export default {
  components: {
    NoData
  },
  filters: {
    returnResultStat(val) {
      if (val > 0) {
        return val + '连胜'
      }
      if (val < 0) {
        const value = String(val)
        return value.slice(1) + '连负'
      }
      if (val === 0) {
        return '-'
      }
    }
  },
  props:{
    type: {
      default: 1,
      type: Number,
    },
    rankData: {
      default: () => [],
      type: Array,
    }
  }
}
</script>

<style lang="scss" scoped>

@import "./../../style/index.scss";

.ranking-table {
  margin-top: 28px;
  .item {
    margin-bottom: 40px;
  }
  .item:last-child {
    margin-bottom: 0px;
  }
  .title {
    font-weight: 700;
    padding: 0 0 12px 0;
    font-size: 14px;
    color: #3683FF;
  }

  
  .table {
    tr > th {
      padding: 12px 0;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #666666;
      letter-spacing: 0;
      text-align: center;
      background-color: #F0F0F0;
    }
    &-column_1 {
      width: 60px;
      font-family: DINAlternate-Bold;
      font-size: 18px;
      color: #333333;
      letter-spacing: 0;
      text-align: center;
      font-weight: 700
    }
    &-column_2 {
      width: 170px;
      text-align: left;
      img{
        width: 24px;
        vertical-align: middle;
        margin-right: 4px;
      }
    }
    &-column_3, 
    &-column_4,
    &-column_5{
      width: 60px;
    }
    &-column_6{
      width: 85px;
    }
    .equate {
      width: 70px;
    }
    .content {
      td {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #333333;
        letter-spacing: 0;
      }
      .table-column_1 {
        font-family: DINAlternate-Bold;
        font-size: 18px;
        font-weight: 700;
        letter-spacing: 0;
        color: #333333;
        text-align: center;
      }
      .name {
        font-size: 14px;
        color: #333333;
        font-weight: 700;
        vertical-align: middle;
      }
    }
  } 
}
</style>
