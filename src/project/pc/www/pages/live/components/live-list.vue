<template>
  <div class="live-list">
    <div
      v-if="isRoom"
      class="live-btn-group"
    >
      <div
        v-for="item in btnGroup"
        :key="item.key"
        class="btn"
        :class="{cur: item.key === curBtn}"
        @click="btnClick(item.key)"
      >
        <i
          class="iconfont"
          :class="item.icon"
        />
        <span>{{ item.name }}</span>
      </div>
    </div>
    <div
      class="list"
      :class="{'is-room':isRoom}"
    >
      <ul>
        <li
          v-for="(item, index) in roomList"
          :key="index"
          :class="{cur: item.room_id === curLive}"
          @click="liveListClick(item)"
        >
          <div
            class="img-box" 
            :style="{background: `url(${(item.room_img || item.screenshot_url || defaultImg.liveList)}) no-repeat center center / cover`}" 
          />
          <p>{{ item.title }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import liveMixins from '../../../mixins/live'
export default {
  mixins: [liveMixins],
  props: ['liveType', 'hasVideo', 'hasAni','isRoom'],
  data() {
    return {
      btnGroup: [
        {
          key: 1,
          name: '动画直播',
          icon: 'iconbn_cl'
        },
        {
          key: 2,
          name: '视频直播',
          icon: 'iconaf_di'
        },
      ],
      // 当前选中的btn
      curBtn: 2,
      // 当前选中的主播
      curLive: null,
      // 房间列表
      roomList: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.curBtn = this.liveType
      this.curLive = Number(this.$route.query.roomId || 0)
      // 请求主播房间列表
      if(this.$route.query.id) {
        this.getRoomList()
      }
    },
    btnClick(key) {
      if(key === 1 && !this.hasAni || !this.judgeMatchId(this.$route.query)) {
        this.$tip('暂无动画直播')
        return
      }
      if(key === 2 && !this.hasVideo || !this.judgeMatchId(this.$route.query)) {
        this.$tip('暂无视频直播')
        return
      }
      this.curBtn = key
      this.curLive = null
      const _url = `?id=${(this.$route.query.id)}&videoTab=${key}`
      this.refreshPage(_url)
    },
    liveListClick(item) {
      const _url = `?id=${(item.match_id || 0)}&roomId=${item.anchor.room_id}`
      this.refreshPage(_url)
    },
    refreshPage(url) {
      const _url = location.origin + location.pathname + url
      window.location.href = _url
    },
    getRoomList() {
      this.$get('/v0.4/rooms/proposal', {
        apiType: 'anchor',
        body: {
          room_id: this.$route.query.roomId || '',
          match_id: this.$route.query.id || 0,
          page: 1,
          size: 20
        },
      }).then(res => {
        const { code, data } = res
        if (code === 200) {
          this.roomList = (data || {}).rows || []
        }
      })
    }
  }
}
</script>
<style lang="postcss" scoped>
.live-list {
  height:100%;
  .live-btn-group {
    height: 60px;
    padding: 16px 12px 0 12px;
    color:#3683FF;
    .btn {
      color: #3683FF;
      float: left;
      height: 26px;
      line-height: 26px;
      padding: 0 10px;
      cursor: pointer;
      border-radius: 4px;
      border: 1px solid #3683FF;
      transition: all 0.3s;
      margin-left:44px;
      &[disabled] {
        display: none;
      }
      &:last-child {
        float: right;
        margin-right:33px;
      }
      &:hover,
      &.cur {
        background: #3683FF;
        color: #FFFFFF;
      }
      &.fr .iconfont {
        font-size: 14px;
      }
      .iconfont {
        font-size: 12px;
        float: left;
      }
      span {
        font-size: 12px;
        float: left;
        margin-left: 8px;
      }
    }
  }
  .list {
    height: 100%;
    padding-top:20px;
    &.is-room{
      height: calc(100% -60px);
      padding-top:0
      /* padding-top:0 */
    }
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 2px;
      background: #d8d8d8;
    }
    &::-webkit-scrollbar-thumb {
      background: #3683ff;
      border-radius: 3px;
    }
    ul {
      padding: 0 16px 0 19px;
      li {
        /* padding-bottom: 12px; */
        position: relative;
        cursor: pointer;
        &.cur {
          &:after {
            content: "";
            width: 0;
            height: 0;
            display: block;
            border: 4px solid transparent;
            border-right-color: #3683FF;
            position: absolute;
            left: -8px;
            top: 50px;
            margin-top: -4px;
          }
          .img-box {
            border-radius: 4px;
            border: 2px solid #3683FF;
          }
        }
        .img-box {
          width: 100%;
          height: 145px;
          display: block;
        }
        p {
          font-size: 14px;
          color: #333333;
          line-height: 20px;
          padding:6px 0 5px 0;

        }
      }
    }
  }
}
</style>