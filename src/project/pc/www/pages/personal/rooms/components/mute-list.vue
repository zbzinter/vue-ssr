<template>
  <div class="content">
    <div class="order-record__header">
      <div class="header-search clearfix">
        <Input
          v-model="nickname"
          class="fl long-width"
        />
        <Button
          class="iblock ml fl"
          type="primary"
          @click="getMuteList"
        >
          查询
        </Button>
        <Button
          class="iblock ml fr"
          type="primary"
          @click="addMuteUser"
        >
          添加
        </Button>
      </div>
    </div>
    <div class="order-record__inner">
      <Table
        :data="data"
        :columns="listHeader"
        style="width: 100%"
      >
        <template
          slot="time"
          slot-scope="{row}"
        >
          <span>{{ row.keep_time / 60 }}分钟</span>
        </template>

        <template
          slot="createdTime"
          slot-scope="{row}"
        >
          {{ dayjs(row.created_time).format("YYYY-MM-DD HH:mm") }}
        </template>
        <template
          slot="operate"
          slot-scope="{row}"
        >
          <span
            class="ban-list"
            @click="banList(row)"
          >解禁</span>
        </template>
      </Table>
    </div>
    <Modal
      v-model="addFlag"
      title="禁止发言"
      class-name="vertical-center-modal"
      width="400"
    >
      <div class="form">
        <div class="form-item">
          <label class="desc">用户帐号：</label>
          <Input
            v-model="muteNickname"
            class="input-width long-width"
          />
        </div>
        <div class="form-item">
          <label class="desc">时长：</label>
          <Select
            v-model="time"
            class="long-width"
          >
            <Option
              v-for="item in times"
              :key="item.value"
              :value="item.value"
            >
              {{ item.time }}
            </Option>
          </Select>
        </div>
        <div class="form-item">
          <label class="desc" />
          <Button
            class="iblock ivu-btn-primary mr"
            type="primary"
            @click="confirm"
          >
            添加
          </Button>
          <Button
            class="iblock ml"
            @click="cancel"
          >
            取消
          </Button>
        </div>
      </div>
      <div slot="footer" />
    </Modal>
  </div>
</template>

<script>
import { Table, Button, Input, Modal, Select, Option } from 'iview'
import mixin from '../mixins'

export default {
  components: {
    Table,
    Button,
    Input,
    Modal,
    Select,
    Option
  },
  mixins: [mixin],
  data() {
    return {
      nickname: '',
      muteNickname: '',
      data: [],
      addFlag: false,
      pages: {
        size: 20,
        page: 1
      },
      time: ''
    }
  },
  mounted() {
    this.getMuteList()
  },
  methods: {
    getMuteList() {
      this.record = []
      this.$get('v2.1/roommanager/anchorkeepslient', {
        apiType: 'anchor',
        body: {
          anchor_uid: this.getUserInfo().uid,
          nickname: this.nickname,
          ...this.pages
        }
      }).then(res => {
        const {
          code,
          data: { rows }
        } = res
        if (this.$judgeCode(code) && rows && rows.length) {
          this.data = rows || []
        } else {
          if (19005 === code) {
            this.getMuteList()
            return
          }
          this.data = []
        }
      })
    },

    addMuteUser() {
      this.addFlag = true
      this.muteNickname = ''
      this.time = ''
    },

    confirm() {
      if (!this.muteNickname) {
        return this.$error('请填写用户账号')
      }

      if (!this.time) {
        return this.$error('请选择禁言时间')
      }

      this.$post('v2.1/roommanager/anchorkeepslient', {
        apiType: 'anchor',
        body: {
          anchor_uid: this.getUserInfo().uid,
          uid_nickname: this.muteNickname,
          type: 1,
          keep_time: this.time
        }
      })
        .then(res => {
          const { code, msg } = res
          if (this.$judgeCode(code)) {
            this.$success('禁言成功')
            this.addFlag = false
            this.getMuteList()
          } else {
            this.$error(msg)
          }
        })
        .catch(() => {
          this.$error('服务器出错')
        })
    },

    cancel() {
      this.addFlag = false;
      (this.muteNickname = ''), (this.time = '')
    },

    banList({ room_id, uid, roommanager_uid, keep_time }) {
      this.$post('v2.1/roommanager/keepslient', {
        apiType: 'anchor',
        body: {
          uid,
          roommanager_uid,
          type: 3,
          keep_time,
          room_id
        }
      })
        .then(res => {
          const { code, msg } = res
          if (this.$judgeCode(code)) {
            this.$success('解禁成功')
            this.getMuteList()
          } else {
            this.$error(msg)
          }
        })
        .catch(() => {
          this.$error('服务器出错')
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  padding: 0 40px 50px;
}

/deep/ .ivu-input {
  border: 1px solid #dcdee2;
}

.header-search {
  height: 32px;
  margin: 30px 0;
}

.long-width {
  width: 180px;
}

.vertical-center-modal {
  .form-item {
    margin-bottom: 10px;
  }
  .desc {
    width: 100px;
    text-align: right;
    display: inline-block;
  }
  .long-width {
    width: 200px;
  }
}

.ban-list {
  color: #3683ff;
  cursor: pointer;
}
</style>
