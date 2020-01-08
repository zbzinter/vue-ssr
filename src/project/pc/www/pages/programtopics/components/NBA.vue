<template>
  <div class="nba">
    <div class="sport-list">
      <TurningPages
        :data-list="dataList"
        :title-name="title"
      />
    </div>
  </div>
</template>

<script>
import TurningPages from '../common/TurningPages'
export default {
  name: 'NBA',
  components: {
    TurningPages
  },
  data(){
    return{
      title:'他们陪我们成长，篮球也在改变着我们；他们用忠诚铸就信仰，我们用信仰追随忠诚； 他们用青涩丈量成长，我们用成长笑看青涩；这是篮球与我们之间最美的相约，也是 他与我们最美的邂逅。'     ,
      dataList:[
        {src:'http://cms.qiuhui.com:8080/ucms/u/cms/www/201907/19090525ebp9.mp4',title:'视频标题'},
        {src:'http://cms.qiuhui.com:8080/ucms/u/cms/www/201907/19090525ebp9.mp4',title:'视频标题'},
        {src:'http://cms.qiuhui.com:8080/ucms/u/cms/www/201907/19090525ebp9.mp4',title:'视频标题'},
        {src:'http://cms.qiuhui.com:8080/ucms/u/cms/www/201907/19090525ebp9.mp4',title:'视频标题'},
        {src:'http://cms.qiuhui.com:8080/ucms/u/cms/www/201907/19090525ebp9.mp4',title:'视频标题'},
        {src:'http://cms.qiuhui.com:8080/ucms/u/cms/www/201907/19090525ebp9.mp4',title:'视频标题'},
        {src:'http://cms.qiuhui.com:8080/ucms/u/cms/www/201907/19090525ebp9.mp4',title:'视频标题'},
        {src:'http://cms.qiuhui.com:8080/ucms/u/cms/www/201907/19090525ebp9.mp4',title:'视频标题'},
        {src:'http://cms.qiuhui.com:8080/ucms/u/cms/www/201907/19090525ebp9.mp4',title:'视频标题'},
        {src:'http://cms.qiuhui.com:8080/ucms/u/cms/www/201907/19090525ebp9.mp4',title:'视频标题'},
        {src:'http://cms.qiuhui.com:8080/ucms/u/cms/www/201907/19090525ebp9.mp4',title:'视频标题'},
        {src:'http://cms.qiuhui.com:8080/ucms/u/cms/www/201907/19090525ebp9.mp4',title:'视频标题'},
      ],

    }
  },
  created(){

  },
  methods:{


  }

}
</script>

<style lang="scss" scoped>
  .nba{
    position: absolute;
    top: 1380px;
    .sport-list{
     /deep/ .sport-content{
        .title{
          width: 760px;
          margin-left: 226px;
        }
      }
    }
  }


</style>