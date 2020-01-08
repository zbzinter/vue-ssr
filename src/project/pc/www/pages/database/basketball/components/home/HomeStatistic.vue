<template>
  <div class="clearfix">
    <div
      v-for="(item, index) in statisticData"
      :key="index"
      class="statistic fl mr"
    >
      <p class="title">
        {{ item.statType | returnStatTypeText }}
      </p>
      <ul>
        <li
          v-for="e in item.stats"
          :key="e.playerId"
          class="statistic-item clearfix"
        >
          <img
            :src="e.playerLogo"
            alt=""
            class="fl"
          >
          <div class="iblock fl">
            <span class="name">{{ e.playerName }}</span>
            <span class="desc">{{ e.teamName }}</span>
          </div>
          <div class="fr score">
            {{ e.value }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    statisticData: {
      default: () => [],
      type: Array
    }
  },
}
</script>

<style lang="scss" scoped>


.statistic {
  margin: 40px 10px 0 0;
  width: 232px;
  box-sizing: border-box;
  background: #fff;
  box-shadow: 0 6px 24px 0 rgba(0,0,0,0.04);
  .title {
    font-family: PingFangSC-Medium;
    font-size: 14px;
    height: 44px;
    line-height: 44px;
    font-weight: 700;
    letter-spacing: 0;
    border-bottom: 1px solid #eaeaea;
    color: #3683FF;
    text-align: center;
  }
  li {
    border-bottom: 1px solid #eaeaea;
    margin: 0 10px;
    img {
      display: inline-block;
      width: 40px;
      height: 40px;
      border-radius: 20px;
      margin: 15px 15px 15px 10px;
      background-color: aqua;
    }
  }
  li:last-child {
    border-bottom: none;
  }

  .name {
    font-size: 16px;
    line-height: 16px;
    padding-top: 17px;
    font-weight: 600;
    text-align: center;
    display: block;
    color: #333333;
  }
  .desc {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0; 
    color: #666666;
    text-align: center;
    display: inline-block;
  }

  .score {
    font-family: DINCondensed-Bold;
    font-size: 18px;
    padding: 27px 10px 0 0;
    line-height: 17px;
    font-weight: 700;
    letter-spacing: 0;
    color: #333333;
    text-align: right;
  }
}
.statistic:last-child {
  margin-right: 0;
}
</style>
