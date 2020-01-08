<template>
  <div class="team-info">
    <div class="banner-head">
      <div class="bg" />
      <div class="content-box">
        <img
          :src="teamInfo.logoUrl"
          class="logo"
        > 
        <span class="team-name">{{ teamInfo.teamName || '多么么不过' }}</span>
        <ul class="nav clearfix">
          <li>
            <span class="name">  A组排名 </span> 
            <span class="number">{{ teamInfo.allianceRank || '-' }}</span>
          </li>
          <li>
            <span class="name">战绩</span>
            <span class="number">{{ teamInfo.allianceRank || '-' }}</span>
          </li>
          <li>
            <span class="name">得分排名</span>
            <span class="number">{{ teamInfo.scoreRank }}</span>
          </li>
          <li>
            <span class="name">限制得分排名</span>
            <span class="number">{{ teamInfo.limitScoreRank }}</span>
          </li>
          <li>
            <span class="name">篮板排名</span>
            <span class="number">{{ teamInfo.reboundRank }}</span>
          </li>
          <li>
            <span class="name">助攻排名</span>
            <span class="number">{{ teamInfo.assistRank }}</span>
          </li>
          <li>
            <span class="name">投篮命中率排名</span> 
            <span class="number">{{ teamInfo.shotGoalRank }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return  {
      teamId: '',
      seasonId: '', 
      teamInfo: {
        allianceRank: '',
        winNum:''	,	
        lostNum:'',	
        scoreRank:'',	
        limitScoreRank:''	,	
        reboundRank:''	,
        assistRank:''	,	
        shotGoalRank:'',	
        teamName:''	,	
        logoUrl:''
      }
    }
  },
  created() {
    this.teamId = this.$route.query.id
    this.seasonId = localStorage.getItem('seasonId') || ''
    this.getTeamInfo()
  },
  methods: {
    getTeamInfo() {
      this.$get('v9/basketball/team/simpleRankInfo', 
        { teamId: this.teamId, seasonId: this.seasonId })
        .then(res => {
          const {code, data: {team}, msg} = res
          if (this.$jugdeCode(code)) {
            //   this.teamInfo = {...team}
          } else {
            this.$error(msg)
          }
        })
    }
  }
}
</script>


<style lang="scss" scoped>
.team-info {
  background: #fff;
  margin-top: 40px;
  
  .banner-head:after,
  .banner-head:before {
    content:'';
    display:table
  }
  .banner-head {
    clear: both;
    display: inline-block;
    vertical-align: top;
    width: 100%;
    background: linear-gradient(45deg, #db253a 0%, #7E1222 100%) no-repeat;
    height: 240px;
    position: relative;
  }

  .content-box {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .logo {
    position: absolute;
    top: 45px;
    left: 40px;
    width: 86px;
    height: 86px;
    background: no-repeat center;
  }

  .team-name {
    position: absolute;
    top: 69px;
    left: 140px;
    font-size: 26px;
    color: #fff;
    line-height: 37px;
  }

  .nav {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    display: block;
    width: 100%;
    background: rgba(0,0,0,0.20);
    box-shadow: 0 1px 20px 0 rgba(0,0,0,0.08);
    li {
      float: left;
      width: 14.28571%;
      height: 66px;
      color: #fff;
      text-align: center;
      transition: 0.3s all ease;
      transform-style: preserve-3d;
      // background-color: rgba(0,0,0,0.2);
      cursor: pointer;
    }
  }

  .name, .number {
    width: 100%;
    clear: both;
    vertical-align: top;
    display: inline-block;
  }
  .name {
    font-size: 12px;
    margin-top: 14px;
    line-height: 17px;
  }
  .number {
    font-size: 16px;
    padding-top: 5px;
  }



}
// .desc {
//   background: #f2f2f2;
//   margin-bottom: 10px;
//   div {
//     display: inline-block;
//     text-align: center;
//     width: 150px;
//     padding: 10px 0
//   }
// }
</style>
