<template>
  <div class="comment">
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
  name: 'Comment',
  components: {
    TurningPages
  },
  data(){
    return{
      title:'从少年到壮年；从青涩到成熟；经历了青春的梦想与迷惘，我们始终如一，热情不改，评头论足， 记录着那些年我们一起追过的球星。 ',
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

  .comment{
    position: absolute;
    top: 2075px;
   /deep/ .sport-content{
      .title{
        width: 860px;
        margin-left: 176px;
      }
    }
  }
</style>