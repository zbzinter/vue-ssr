<template>
  <div class="live-history">
    <UserInfo />
    <div class="content">
      <ul class="mt clearfix">
        <li
          v-for="(item, index) in list"
          :key="index"
          class="fl mr"
        >
          <img
            class="img"
            :src="(item.screenshot_url || defaultImg.liveList)"
            alt=""
          >
          <p class="clearfix">
            <span class="ellipsis fl">{{ item.room_title || '-' }}</span>
            <i class="iconfont iconbv_de fr">
              <a
                :href="item.play_url"
                download="video"
              />
            </i>
          </p>
        </li>
      </ul>
    </div>
    <Page
      v-if="pages.total > 20"
      class="page pt mb"
      :total="pages.total"
      :page-size="pages.size"
      show-total
      show-elevator
      @on-change="changePage"
    />
  </div>
</template>

<script>
import UserInfo from '@src/components/personal/user-info'
import {Page} from 'iview'

export default {
  components: {
    Page,
    UserInfo
  },
  data() {
    return {
      list: [],
      pages: {
        total: 0,
        size: 18,
        page: 1
      },
    }
  },
  created() {
    this.getLiveHistoryList()
  },  
  methods: {
    getLiveHistoryList() {
      this.$get(`v2.1/anchors/${this.getUserInfo().uid}/room/historys`, {
        apiType: 'anchor',
        body: {
          ...this.pages,
        }
      })
        .then(res => {
          const { code, data } = res
          if (this.$judgeCode(code)) {
            this.list = data.rows
            this.pages.total = data.total
          } else {
            this.list = []
          }
        })
        .catch(() => {
        })
    },
    
    changePage(val) {
      this.pages.page = val
      this.getLiveHistoryList()
    },

  }
}
</script>

<style lang="scss" scoped>
.content {
  border-top: 1px solid #eee;
}
.live-history {
  ul {
    margin-left: 45px;
  }
  li  {
    width: 250px;
    height: 175px;
  }
  .img {
    display: inline-block;
    width: 250px;
    height: 140px;
    cursor: pointer;
  }
  .mr {
    margin-right: 60px;
  }
}
.ellipsis {
  display: inline-block;
  width: 180px;
}
.iconfont {
  cursor: pointer;
}

</style>
