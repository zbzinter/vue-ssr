<template>
  <div class="team-statistic clearfix">
    <div
      v-for="item in teamStatistic"
      :key="item.id"
      class="statistic mr"
    >
      <p>{{ item.statType | returnStatTeamText }}</p>
      <ul>
        <li
          v-for="(e, index) in item.stats"
          :key="e.teamId"
          class="statistic-item clearfix"
        >
          <span class="sort fl">{{ index + 1 }}</span>
          <img
            :src="e.logoUrl"
            alt=""
            class="fl mr"
          >
          <span class="fl name">{{ e.teamName }}</span>
          <span class="fr score">{{ e.value }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    teamStatistic: {
      default: () => [],
      type: Array
    }
  }
}
</script>

<style lang="scss" scoped>

.statistic {
  margin-bottom: 15px;
  width: 280px;
  height: 340px;
  background: #fff;
  box-sizing: border-box;
  p {
    font-size: 18px;
    font-weight: 700;
    text-align: center;
    line-height: 35px;
    height: 35px;
    background: #eaeaea;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  li {
    border-top: 1px solid #eee;
    padding: 10px 5px;
    img {
      display: inline-block;
      width: 40px;
      height: 40px;
      border-radius: 20px;
      background-color: aqua
    }
  }

  .sort {
    display: inline-block;
    padding-top: 8px;
    padding-right: 5px;
    font-size: 16px;
  }

  .danger {
    color: red;
  }

  .name {
    text-align: center;
    display: inline-block;
    padding-top: 10px;
  }

  .score {
    padding-top: 10px;
  }
}
</style>
