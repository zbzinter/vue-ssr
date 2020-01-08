<template>
  <div class="program-topics">
    <div class="program-topics-container">

      <!--平铺背景图片-->
      <div class="background-list">
        <div class="list-item item-one" />
        <div class="list-item item-two" />
        <div class="list-item item-three" />
        <div class="list-item item-four" />
        <div class="list-item item-five" />
        <div class="list-item item-six" />
        <div class="list-item item-seven" />
        <div class="list-item item-eight" />
      </div>

      <!--显示具体内容-->
      <div class="program-topics-content">
        <!--球会放映厅-->
        <Content />

      </div>
    </div>
  </div>
</template>
<script>


import Content from './Content'

export default {
  components: {
    Content
  },
  props: {

  },
  data() {
    return {

    }
  },
  mounted(){
    document.title = '球会体育|节目专栏'
  },
  beforeDestroy(){
    document.title = '球会体育'
  },
  created() {

  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>
  .program-topics {
    position: relative;
    height: 5688px;
    overflow-x: hidden;
    &-container{
      position: relative;
      .background-list{
        width: 100%;
        min-height: 100%;
        z-index: 0;
        position: absolute;
        left: 0;
        .list-item{
          width: 100%;
          height: 760px;
          box-sizing: border-box;
          overflow: hidden;
        }
        .item-one{
          background: url('../../assets/program/program-01.jpg') top center no-repeat;
        }
        .item-two{
          background: url('../../assets/program/program-02.jpg') top center no-repeat;
        }
        .item-three{
          background: url('../../assets/program/program-03.jpg') top center no-repeat;
        }
        .item-four{

          background: url('../../assets/program/program-04.jpg') top center no-repeat;
        }
        .item-five{
          height: 577px;
          background: url('../../assets/program/program-05.jpg') top center no-repeat;
        }
        .item-six{
          height: 996px;
          background: url('../../assets/program/program-06.jpg') top center no-repeat;
        }
        .item-seven{
          height: 707px;
          background: url('../../assets/program/program-07.jpg') top center no-repeat;
        }
        .item-eight{
          height: 368px;
          background: url('../../assets/program/program-08.jpg') top center no-repeat;
        }
      }
      .program-topics-content{
        position: relative;
        width: 1200px;
        margin:0 auto;
        .content-list{
          position: absolute;
        }
      }

    }
  }

</style>


