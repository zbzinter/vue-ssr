<!-- poptip odds -->
<template>
  <div class="odds">
    <!-- 亚盘 -->
    <div
      v-if="item.odds"
      class="cell-line"
    >
      <div v-if="!entertainedExcute('yapan')">
        <p :class="[setZhiShu(item, ['icon1'], 'yapan')]">
          {{ setZhiShu(item, ['valueForType1', 'value0ForType1'], 'yapan') }}
        </p>
        <p :class="[setZhiShu(item, ['icon'], 'yapan')]">
          {{ setZhiShu(item, ['ovalue', 'ovalue0'], 'yapan') }}
        </p>
        <p :class="[setZhiShu(item, ['icon2'], 'yapan')]">
          {{ setZhiShu(item, ['valueForType2', 'value0ForType2'], 'yapan') }}
        </p>
      </div>
      <div v-else>
        封
      </div>
    </div>

    <!-- 大小 -->
    <div
      v-if="item.odds"
      class="cell-line"
    >
      <div v-if="!entertainedExcute('dx')">
        <p :class="[setZhiShu(item, ['icon1'], 'dx')]">
          {{ setZhiShu(item, ['valueForType1', 'value0ForType1'], 'dx') }}
        </p>
        <p :class="[setZhiShu(item, ['icon'], 'dx')]">
          {{ setZhiShu(item, ['ovalue', 'ovalue0'], 'dx') }}
        </p>
        <p :class="[setZhiShu(item, ['icon2'], 'dx')]">
          {{ setZhiShu(item, ['valueForType2', 'value0ForType2'], 'dx') }}
        </p>
      </div>
      <div v-else>
        封
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'setZhiShu',
    'item'
  ],
  methods: {
    entertained(val1, val2){ // 分盘
      let flag = !!(parseFloat(val1)===0 && parseFloat(val2)===0)
      return {
        flag,
        text: '封'
      }
    },
    entertainedExcute(type){
      let {entertained, setZhiShu, item: match} = this 
      return entertained(setZhiShu(match, ['valueForType1', 'value0ForType1'], type), setZhiShu(match, ['valueForType2', 'value0ForType2'], type)).flag
    },
  }
}
</script>

<style scoped lang="scss">
.cell-line {
  overflow: hidden;
  width: 100%;
  p {
    float: left;
    width: 70px;
    min-height: 17px;
    position: relative;
    white-space: nowrap;
    &.iconca_ei,
    &.iconca_el {
      font-family: 'iconfont';
      font-size: 12px;
      font-style: normal;   
      &.iconca_el{
        /* 下降 */
        color: #629500;
      }
      &.iconca_ei{
        color: #E15756;
      }
    }
    &.iconca_ei:before, &.iconca_el:before{
      position: absolute;   
      right: 0;
    }
  }
}
.odds {
  width: 180px;
  min-height: 44px;
  text-align: center;
  .cell-line:nth-of-type(1){
    color: #999;
  }
  .cell-line:nth-of-type(2){
    color: #666;
  }
}
</style>
