<template lang="pug">
    img(:src="imgSrc || defaultUrl || originImg" @error.once="setDefaultImg()")
</template>

<script>
export default {
  props: {
    'src': null,
    'defaultUrl': null,
    'defaultType': { // defaultType=1 足球、 defaultType=2 篮球 (同sportId); defaultType=100 球员;
      type: null,
      default: null
    }
  },
  data () {
    return {
      imgSrc: '',
      imgDefaultType: '',
      originImg: require('@src/assets/default_user.png')
    }
  },
  watch: {
    src (val) {
      this.imgSrc = val
    },
    imgDefaultType (val) {
      switch(val && parseInt(val)) {
      case 1 : this.originImg = this.defaultImg.football;break
      case 2 : this.originImg = this.defaultImg.basketball;break
      case 3 : this.originImg = this.defaultImg.baseball;break// 棒球
      case 5 : this.originImg = this.defaultImg.tennis;break// 网球
      // case 100 : this.originImg = this.defaultImg.basketball;break
      }
    } 
  },
  mounted () {
    this.imgSrc = this.src
    this.imgDefaultType = this.defaultType
  },
  methods: {
    setDefaultImg () {
      this.imgSrc = this.defaultUrl || this.originImg
    }
  }
}
</script>