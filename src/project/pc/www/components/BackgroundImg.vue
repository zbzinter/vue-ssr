<template>
  <div
    :class="['background-img', {'video': tempVideo.value}]"
    :style="styleStr"
  >
    <div :class="['transparent']" />
  </div>
</template>
<script>
export default {
  props: {
    src: {
      type: String,
      default: ''
    },
    defaultUrl: {
      type: String,
      default: require('@src/assets/default-background.png')
    },
    size:{
      type:Object,
      default:()=>{
        return{

        }
      }
    },
    isVideo: {
      type: [Object, Boolean, String],
      default: () => {
        return {
          width: 'auto',
          height: 'auto',
          value: false
        }
      }
    },

  },
  data () {
    return {
      styleStr: '',
      tempVideo: {},
      isLoad: false,
      pictureSize:{
        width:0,
        height:0
      },
      Multiple:1.8,

    }
  },
  mounted () {
    if(this.size.width){
      this.pictureSize={
        width:parseInt(this.size.width*this.Multiple),
        height:parseInt(this.size.height*this.Multiple),
      }
    }
    if(Object.prototype.toString.call(this.isVideo) !== '[object Object]') {
      this.tempVideo = {
        width: 'auto',
        height: 'auto',
        value: this.isVideo
      }
    } else {
      this.tempVideo = this.isVideo
    }
    if(!this.isLoad) {
      let local=false
      this.styleStr = this.setBg(this.defaultUrl,local)
    }
    let img = new Image()
    if (this.src) {
      //这里判断组件传入图片链接中是否有参数 地址链接中出现'?'
      // 后面继续拼接上'&' or 按照传入图片宽高拼接上对应参数
      if(this.src.indexOf('?')!=-1){

        img.src=this.src+`&x-oss-process=image/resize,m_mfit,h_${this.pictureSize.height},w_${this.pictureSize.width}`
      }else{

        img.src=this.src+`?x-oss-process=image/resize,m_mfit,h_${this.pictureSize.height},w_${this.pictureSize.width}`
      }

      img.onerror = () => {
        if (this.defaultUrl) {
          let local=false
          this.styleStr = this.setBg(this.defaultUrl,local)
        }
      }
      img.onload = () => {
        this.isLoad = true
        let local=true
        this.styleStr = this.setBg(this.src,local)
      }
    } else {
      if (this.defaultUrl) {
        let local=false
        this.styleStr = this.setBg(this.defaultUrl,local)
      }
    }
  },
  methods: {
    setBg(img,local){
      //线上图片地址
      if(local){
        if(this.pictureSize.height||this.pictureSize.width){
          let queryStr=this.src.indexOf('?')!=-1?'&':'?'
          let newImg=img+`${queryStr}x-oss-process=image/resize,m_mfit,h_${this.pictureSize.height},w_${this.pictureSize.width}`
          return `background: url('${newImg}') no-repeat center center/cover`

        }else{
          let queryStr=this.src.indexOf('?')!=-1?'&':'?'
          let newImg=img+`${queryStr}x-oss-process=image/resize,m_mfit,h_100,w_100`
          return `background: url('${newImg}') no-repeat center center/cover`
        }
      }else{
        //本地图片
        return `background: url('${img}') no-repeat center center/cover`
      }

    }
  }
}
</script>

<style lang="scss" scoped>
  .background-img{
    position: relative;
    &.video{
      .transparent{
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        background: rgba(51, 51, 51, 0.2) url('../assets/video_img.png') no-repeat center center/30px 30px
      }
    }
  }
</style>
