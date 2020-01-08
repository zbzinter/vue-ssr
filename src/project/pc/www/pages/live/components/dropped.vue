<template>
  <div class="dropped">
    <div class="bg-img" />
    <div class="no-data">
      <p>
        {{ info }}
      </p>
      <img :src="imgUrl">
    </div>
  </div>
</template>
<script>
import noNetwork from  '../../../assets/live/img_no_network.png'
import noVideo from '../../../assets/live/img_no_video.png'
export default {
  props:{
    type:{
      default:0,
      type:Number
    }
  },
  data(){
    return {
      imgUrl: noNetwork,
      info:'主播好像网络开小差哦，耐心等待一下吧'  //  暂时没有直播哦，去看看别的内容吧！
    }
  },
  mounted(){
    if(this.type == 1){
      this.imgUrl = noVideo
      this.info = '暂时没有直播哦，去看看别的内容吧！'
    }
  }
}
</script>
<style lang="postcss" scoped>
.dropped {
  position: absolute;
  left:0;
  right:0;
  bottom:0;
  top:0;
  background:#000000;
  .bg-img {
    width:100%;height:100%;
    background:url(../../../assets/live/bg_img.png);
    margin: 0 auto;
    background-size: 100% 100%;
    width: 1000px;
    height: 450px;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    position: absolute;
  }
  .no-data {
    font-family: PingFangSC-Regular;
    font-size: 20px;
    color: #FFFFFF;
    padding-top:130px;
    text-align: center;
    line-height: 20px;
    img {
      width:250px;
      margin-top:30px;
      position: relative;
    }
  }
}
</style>