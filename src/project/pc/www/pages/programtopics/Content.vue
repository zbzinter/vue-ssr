<template>
  <div class="content">
    <Subject />
    <!--NBA星战-->
    <NBA />
    <!--评头论足-->
    <Comment />
    <!--球鞋分享-->
    <ShareShoes />
    <!--SUNVLOG-->
    <SunVlog />
    <!--海报看中超-->
    <ChinaSuperLeague />

    <!--会聊个球-->
    <TalkBall />
    <!--球会大赢家-->
    <Club />
  </div>
</template>

<script>

import Subject from './components/Subject'
import NBA from './components/NBA'
import Comment from './components/Comment'
import ShareShoes from './components/ShareShoes'
import SunVlog from './components/SunVlog'
import ChinaSuperLeague from './components/ChinaSuperLeague'
import TalkBall from './components/TalkBall'
import Club from './components/Club'
export default {
  name: 'Content',
  components: {
    Subject,
    NBA,
    Comment,
    ShareShoes,
    SunVlog,
    ChinaSuperLeague,
    TalkBall,
    Club,
  },
  data(){
    return{

    }
  }
}
</script>

<style scoped>

</style>