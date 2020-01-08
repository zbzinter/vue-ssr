<template>
  <div class="follow">
    <UserInfo />
    <div class="c-user-info-title">
      我关注的主播
    </div>
    <div
      v-if="roomList && roomList.length"
      class="content"
    >
      <dl
        v-for="(item, index) in roomList"
        :key="index"
        class="list"
      >
        <dt>
          <DefaultImg
            class="img"
            :src="item.anchor.user_img"
          />
          <div class="name ellipsis">
            {{ item.anchor.nickname }}
          </div>
          <div
            class="btn"
            @click="unFollow(item)"
          >
            取消关注
          </div>
        </dt>
        <dd>
          <div
            class="live"
            @click="toLive(item)"
          >
            <div
              class="inner"
              :class="{living: item.status === 1}"
            >
              <img
                class="img"
                :src="(item.room_img || item.screenshot_url || defaultImg.liveList)"
                alt=""
              >
              <span class="tag live-text">{{ item.status === 1 ? '正在直播' : '未开播' }}</span>
              <span class="tag people"><i class="iconfont icondr_dc" /> {{ item.heat }}</span>
            </div>
            <div class="title">
              {{ item.title }}
            </div>
          </div>
        </dd>
      </dl>
    </div>
    
    <!-- 无内容 -->
    <NoData
      v-else
      class="no-data"
      text="您还没有关注主播！"
    />
  </div>
</template>
<script>
import UserInfo from '@src/components/personal/user-info'
import DefaultImg from '@src/components/DefaultImg'
import NoData from '@src/components/NoData'
export default {
  components: {
    UserInfo,
    DefaultImg,
    NoData
  },
  data() {
    return {
      roomList: []
    }
  },
  mounted() {
    this.getFollowUserList()
  },
  methods: {
    getFollowUserList() {
      this.$get('v0.1/rooms/attentions/' + this.getUserInfo().uid, {
        apiType: 'anchor',
      }).then((res) => {
        const {code, data} = res
        if(code === 200) {
          this.roomList = data || []
        } else {
          this.roomList = []
        }
      })
    },
    // 取消关注
    unFollow(item) {
      const params = {
        attention_uid: (item.anchor || {}).uid,
        uid: this.getUserInfo().uid
      }
      this.$del('v0.1/attentions', {
        apiType: 'anchor',
        body: {
          ...params
        }
      }).then((res) => {
        const {code, msg} = res
        if(code === 200) {
          this.$success('取关成功')
          this.getFollowUserList()
        } else {
          this.$error(msg)
        }
      })
    },
    // 去直播页
    toLive(item) {
      this.$router.push({
        path: '/live/detail',
        query: {
          id: item.match_id,
          roomId: item.room_id
        }
      })
    }
  }
}
</script>
<style lang="postcss" scoped>
.no-data {
  padding-top: 100px;
}
.content {
  padding: 50px;
  padding-top: 0;
  .list {
    padding-top: 25px;
    dt {
      height: 40px;
      line-height: 40px;
      overflow: hidden;
      .img {
        width: 40px;
        height: 40px;
        float: left;
        border-radius: 40px;
      }
      .name {
        float: left;
        margin-left: 12px;
        font-size: 16px;
        columns: #333;
        width: 140px;
      }
      .btn {
        float: left;
        width: 60px;
        line-height: 1;
        cursor: pointer;
        font-size: 12px;
        padding: 4px 0;
        text-align: center;
        color: #3884FF;
        margin: 10px 0 0 0px;
        border: 1px solid #3884FF;
        border-radius: 4px;
        &:hover {
          color: #fff;
          background: #3884FF;
        }
      }
    }
    dd {
      overflow: hidden;
      margin-top: 12px;
      .live {
        width: 255px;
        float: left;
        cursor: pointer;
        margin-right: 40px;
        .inner {
          height: 140px;
          position: relative;
          &.living {
            .tag {
              background: #3884FF;
            }
          }
          .img {
            display: block;
            width: 250px;
            height: 140px;
          }
          .tag {
            position: absolute;
            left: 0;
            padding: 2px 4px;
            color: #fff;
            font-size: 10px;
            line-height: 1;
            background: #999;
          }
          .live-text {
            top: 0;
          }
          .people {
            bottom: 0;
            .iconfont {
              font-size: 10px;
            }
          }
        }
        .title {
          font-size: 12px;
          color: #666666;
          line-height: 22px;
          margin-top: 8px;
        }
      }
    }
  }
}
</style>


