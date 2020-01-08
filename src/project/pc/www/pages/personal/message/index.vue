<template>
  <div class="message">
    <UserInfo />
    <div class="c-user-info-title">
      系统消息
    </div>
    <div class="content">
      <ul
        v-if="msgList.length"
        class="list"
      >
        <li
          v-for="(item, index) in msgList"
          :key="index"
        >
          <!-- <DefaultImg
            class="img"
            :src="item.url"
          /> -->
          <div class="con">
            <h2><b>系统</b><span>{{ item.createTs }}</span></h2>
            <p>{{ item.content }} </p>
          </div>
        </li>
      </ul>
      <!-- 无内容 -->
      <NoData
        v-else
        class="no-data"
        text="暂无消息"
      />
    </div>
  </div>
</template>
<script>
import UserInfo from '@src/components/personal/user-info'
import NoData from '@src/components/NoData'
export default {
  components: {
    UserInfo,
    NoData,
  },
  data() {
    return {
      msgList: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.$get('/jmfen-sport-provider-sms/notify/v1/sys/list', {
        apiType: 'gw',
        body: {
          current: 1,
          size: 100
        }
      }).then(res => {
        const { code, data={} } = res
        if (code === 100200) {
          this.msgList = data.records || []
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
.message {
  background: #fff;
  .header {
    height: 60px;
    line-height: 60px;
    padding: 0 30px;
    font-size: 14px;
    font-weight: bold;
    border-bottom: 1px solid #ddd;
  }
  .content {
    padding: 0 50px;
    .list {
      li {
        padding: 18px 0;
        overflow: hidden;
        border-bottom: 1px solid #f0f0f0;
        &:last-child {
          border-bottom: none;
        }
        .img {
          width: 40px;
          height: 40px;
          border-radius: 40px;
          float: left;
        }
        .con {
          /* margin-left: 52px; */
          h2 {
            font-size: 14px;
            color: #333;
            span {
              color: #666;
              margin-left: 12px;
              font-size: 12px;
              font-weight: normal;
            }
          }
          p {
            font-size: 14px;
            color: #666;
          }
        }
      }
    }
  }
}
</style>


