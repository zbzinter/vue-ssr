<template>
  <div class="share-shoes">
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
  name: 'ShareShoes',
  components: {
    TurningPages
  },
  data(){
    return{
      title:'不知何时球鞋已成潮人标配，蒙蒙的安利小课堂，带你走进不一样的运动世界'     ,
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


}
</script>

<style lang="scss" scoped>

    .share-shoes{
        position: absolute;
        top: 2708px;
       /deep/ .sport-content{
          .title{
            margin-left: 60px;
        }
      }
    }
</style>