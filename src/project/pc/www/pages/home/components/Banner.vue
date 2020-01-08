<template>
  <div
    class="banner"
  >
    <div
      class="wrapper"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLever"
    >
      <!-- Using the slider component -->
      <slider
        ref="slider"
        class="slider-container"
        :options="options"
        @slide="slide"
        @tap="onTap"
        @init="onInit"
      >
        <!-- slideritem wrapped package with the components you need -->
        <slideritem
          v-for="(item,index) in banner"
          :key="index"
        >
          <div
            v-if="item.imageAddress"
            :style="{backgroundImage:'url(' + item.imageAddress + ')'}"
            class="slider-img"
            :index="index"
            @click="goDetail(item)"
          >
            <div
              v-if="item.title"
              class="info"
            >
              <p class="title">
                {{ item.title }}
              </p>
              <img
                v-if="item.title"
                class="arrow"
                src="../../../assets/home/banner_jump.svg"
              >
            </div>
          </div>
        </slideritem>
        <!-- Customizable loading -->
      </slider>
      <div class="swiper-button">
        <div
          class="swiper-button-next"
          @click="slideNext"
        />
        <div
          class="swiper-button-prev"
          @click="slidePre"
        />
      </div>
    </div>
  </div>
</template>
<script>

export default {
  components: {
    slider:()=>import('vue-concise-slider'),
    slideritem:()=>import('vue-concise-slider'),
  },
  props: {
    banner: {
      default: () => [],
      type: Array
    }
  },
  data () {
    return {

      options: {
        currentPage: 0,
        itemAnimation: true,
        preventDocumentMove:true,
        thresholdTime:5000,
        slidesToScroll:1,
        autoplay:5000,
        autoplayStart:5000,
        speed: 500,
        loop:true ,
        freeze: true,
        pagination: true,

      }
    }
  },

  mounted(){
    const {slider, slideritem}=require('vue-concise-slider')
    this.$options.components.slider=slider
    this.$options.components.slideritem=slideritem
  },
  methods:{
    onMouseEnter(){
      this.$refs.slider.$emit('autoplayStop')
    },
    onMouseLever(){
      this.$refs.slider.$emit('autoplayStart',5000)
    },
    onInit(){
      this.$refs.slider.$emit('autoplayStart',5000)
    },
    slide(){

    },
    onTap(){

    },
    slideNext () {
      this.$refs.slider.$emit('slideNext')
    },
    slidePre () {
      this.$refs.slider.$emit('slidePre')
    },
    goDetail (item) {
      let routeData
      switch (item.linkType) {
      case 0:
      case 1:
        routeData = this.$router.resolve({
          path: '/live/detail',
          query: {
            id: item.linkId
          }
        })
        break
      case 2:
      case 3:
        routeData = this.$router.resolve({
          name: 'newsDetail',
          params: {
            'channelId': item.channelId,
            'articleId': item.ceefaxId,
          }
        })
        break
      case 4:
        routeData = this.$router.resolve({
          path: '/live/detail',
          query: {
            id: 0,
            roomId:  item.linkId
          }
        })
        break
      case 20:
        if(item.appUrl){
          window.open(item.appUrl, '_blank')
        }else{
          return false
        }
        break
      default: ''
      }
      if (routeData&&routeData.href) {
        window.open(routeData.href, '_blank')
      }
    },
  }
}
</script>
<style lang="scss" scoped>
  .banner {
    position: relative;
    width: 100%;
    height: 530px;
    background-color: #fff;
    box-sizing: border-box;
    overflow: hidden;
    .wrapper{
      width: 100%;
      margin: 0 auto;
      position: relative;
      cursor: pointer;
      .slider-container{
        width: 100%;
        white-space: inherit!important;
        .slider-img{
          width:100%;
          height: 530px;
          background-size: cover;
          background-position: center;
        }
        /deep/ .slider-pagination{
          position: relative;
          text-align: right;
          width: 1200px;
          margin: 0 auto;
          bottom:30px;
          .slider-pagination-bullet{
            display: inline-block;
            width: 30px;
            height: 2px;
            box-sizing: border-box;
            opacity: 0.4;
            background: #FFF;
            border-radius:0;
            margin: 10px 10px 10px 0;
          }
          .slider-pagination-bullet:after{
            content: '';
            padding: 10px;
          }
          .slider-pagination-bullet-active{
            opacity: 1;
            background: #3683ff!important;
          }

        }


        .info{
          position: relative;
          width: 1200px;
          height: 140px;
          margin: 20px auto;
          .title{
            position: relative;
            display: -webkit-box;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            word-break: break-all;
            line-height: 70px;
            width: 450px;
            height: 140px;
            z-index: 999;
            font-size: 50px;
            color: #FFF;
            text-shadow: 0 2px 4px rgba(0,0,0,0.50);
            top: 185px;
          }
          .arrow{
            display: block;
            position: relative;
            width: 34px;
            height: 34px;
            top:205px;
          }
        }
      }
    }
    .swiper-button{
      position: relative;
      .swiper-button-next{
        position: absolute;
        margin-top: -330px;
        right: 70px;
        border: 20px solid transparent;
        display: inline-block;
        width: 72px;
        height: 90px;
        line-height: 90px;
        opacity:0;
        text-align: center;
        z-index: 9999;
        background: url('../../../assets/home/home_bth_jumpright_n@2x.png')  center center / cover no-repeat !important;
      }
      .swiper-button-prev{
        position: absolute;
        margin-top: -330px;
        left: 70px;
        border: 20px solid transparent;
        display: inline-block;
        width: 72px;
        height: 90px;
        line-height: 90px;
        opacity: 0;
        text-align: center;
        z-index: 9999;
        background: url('../../../assets/home/home_bth_jumpleft_n@2x.png') center center / cover no-repeat  !important;
      }
    }

    .wrapper:hover{
      .swiper-button-next{
        transform: translateX(10px);
        opacity: 1;
        transition: all .3s ease .1s;
        background: url('../../../assets/home/home_bth_jumpright_s@2x.png')  center center / cover no-repeat !important;
      }
      .swiper-button-prev{
        transform: translateX(-10px);
        opacity: 1;
        transition: all .3s ease .1s;
        background: url('../../../assets/home/home_bth_jumpleft_s@2x.png') center center / cover no-repeat  !important;
      }
    }
  }


</style>

