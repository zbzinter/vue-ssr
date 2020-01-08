<template>
  <div class="status">
    <p :class="[`cls${status}`]">
      <img
        :src="iconImg"
        alt=""
      >
      <span>{{ texts[status] }}</span>
    </p>
  </div>
</template>
<script>
export default {
  props: {
    status: {
      type: [Number, String],
      // 1,未开始 2，正在进行 3已结束 4，异常
      default: 2
    }
  },
  data(){
    return {
      texts: {
        '1': '进行中',
        '2': '未开始',
        '3': '已完场',
        '4': '异常的比赛',
      },
      iconImg: null
    }
  },
  created(){
    switch(parseInt(this.status)){
    case 1 : this.iconImg = require('@src/assets/score/av_bj.png');break
    case 2 : this.iconImg = require('@src/assets/score/aw_bj.png');break
    case 3 : this.iconImg = require('@src/assets/score/ax_bj.png');break
    default : this.iconImg = require('@src/assets/score/ay_bj.png');break
    }
  }
}
</script>
<style lang="postcss" scoped>
.status{
  font-size: 16px;
  text-align: center;
  padding: 10px 0;
  p{
    img{
      width: 19px;
      height: 19px;
    }
    span{
      color: #999999;
      vertical-align: middle;
    }
  }
}

</style>
