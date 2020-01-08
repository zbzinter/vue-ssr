<template>
  <div
    v-if="matches.length"
    class="competition-list"
    :class="[type, {'no-instant': selectTabActive != 0}]"
  >
    <div
      v-if="titleName && selectTabActive === 0"
      class="title"
    >
      <div class="competition-list__name">
        <img
          v-if="type==='going'"
          class="status-img"
          src="../../../../assets/score/av_bj.png"
        >
        <img
          v-if="type==='uncoming'"
          class="status-img"
          src="../../../../assets/score/aw_bj.png"
        >
        <img
          v-if="type==='finished'"
          class="status-img"
          src="../../../../assets/score/ax_bj.png"
        >
        <img
          v-if="type==='unknown'"
          class="status-img"
          src="../../../../assets/score/ay_bj.png"
        >
        <span class="title-name">{{ titleName }} </span>
      </div>
    </div>
    <div class="list-info">
      <div
        v-for="(match, index) in matches"
        :key="type === 'stick' ? index : match.matchId"
        class="row"
      >
        <MatchItem
          v-if="type === 'stick' || !stickList || !stickList.length || stickList.indexOf(match.matchId) === -1"
          :match="match"
          :type="type"
          v-bind="$attrs"
          @tempHide="tempHide"
        />
        <div
          v-if="titleName && dayjs(match.matchTime).format('YYYY-MM-DD') !== dayjs(matches[Math.min(index+1, matches.length-1)].matchTime).format('YYYY-MM-DD')"
          :class="[`cls${match.status}`, 'no-today']"
        >
          <img src="../../../../assets/score/gk_dj@2x.png">
          <span>{{ dayjs(matches[Math.min(index+1, matches.length-1)].matchTime).format('YYYY年MM月DD日') }}</span>
        </div> 
      </div>
    </div>
  </div>
</template>

<script>
  
import MatchItem from './MatchItem.vue'
const statusText = {
  going: '进行中',
  uncoming: '未开始',
  finished: '已完场',
  unknown: '异常的比赛'
}


export default {
  components: {
    MatchItem
  },
  props: ['type', 'matches', 'stickList', 'selectTabActive'],
  data() {
    return {
      tempHideList: [],
    }
  },
  computed: {
    titleName() {
      if (this.type === 'stick') {
        return ''
      } else {
        const isAllStick = this.stickList && this.matches.every(item => this.stickList.includes(item.matchId))
        return isAllStick ? '' : statusText[this.type]
      }
    }
  },
  methods: {
    tempHide(isChecked, id) {
      this.$parent.tempHide(isChecked, id)
    }
  }
}
</script>

<style lang="scss">
  $borderColor: #EAEAEA;

  .competition-list {
    &.stick{
      margin-top: 10px;
      &.no-instant{
        margin-bottom: 10px;
      }
    }
    .title{
      padding-left: 98px;
    }
    .competition-list__name{
      .status-img{
        width: 20px;
        height: 20px;
        margin-right: 2px;
        vertical-align: bottom;
      }
      .title-name {
        color: #999999;
      }
    }
  }

  .competition-list {
    .list-info{
      position: relative;
      // .row{
      //   position: relative;
      // }
      .row:not(:last-child){
        .competition-list__table{
          margin-bottom: 12px;
        }
      }
      &::before{
        content: ' ';
        position: absolute;
        left: 78px;
        width: 1px;
        height: 100%;
        background: #D8D8D8;
        opacity: 0.44;
      }
      .no-today{
        padding-left: 103px;
        text-align: left;
        font-weight: 400;
        font-size: 12px;
        position: relative;
        text-align: center;
        img{
          width: 24px;
        }
        span{
          margin-left: 2px;
        }
        &.cls1{
          color: #3683FF;
        }
        &.cls2{
          color: #F5AA58;
        }
        &.cls3{
          color: #999999;
        }
        &.cls4{
          color: #E15756;
        }
      }
    }
    .title {
      text-align: center;
    }
    &__name {
      display: inline-block;
      height: 40px;
      text-align: center;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #3683FF;
      letter-spacing: 0;
      padding: 9px 0;
    }

    .content {
      text-align: center;
      height: 40px;

      td {
        font-size: 12px;
        color: #333;
        letter-spacing: 0;
        font-weight: 500;
        vertical-align: middle;
        border-left: 1px solid $borderColor;
        border-top: 1px solid $borderColor;
        >div{

        }
      }

      .checkbox {
        border-top: none;
        border-bottom: none;
        border-left: none;
      }
    }
    .content {

      td:first-child {
        border-left: none;
      }

    }

    .checkbox {
      width: 98px !important;

      .iconbm_ci {
        color: #E15756;
        font-size: 12px;
      }

      &-time {
        padding-right: 16px;
      }
    }

    .name {
      width: 183px;
      box-sizing: border-box;
      text-align: left;
      img {
        width: 24px;
      }
      img + span {
        display: inline-block;
        vertical-align: middle;
        white-space: nowrap;
        width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .lesson{
      width: 170px;
    }
    .up-down {
      width: 80px;
    }
    .all {
      width: 60px;
    }
    .diff {
      width: 80px;
    }
    .score-total {
      width: 80px; 
    }
    .pay {
      width: 60px;
    }
    .rang-score{
      width: 130px;
    }
    .big-small {
      width: 130px;
      &__first {
        font-size: 12px;
        color: #E4742F;
        letter-spacing: 0;
        width: 49px;
        display: inline-block;
      }
      span {
        float: left;
        width: 50%;
      }
    }

    .live {
      width: 120px;
      .iconbn_cl {
        color: #168058;
      }
    }

    .analyze {
      width: 48px;
      span {
        color: #E13F3D;
      }
    }

    .opera {
      width: 40px;
      i {
        cursor: pointer;
      }
    }

    .intelligence {
      span {
        display: block;
        cursor: pointer;
      }
    }
    .red {
      color: #E15756;
    }
  }
</style>