<template>
  <div class="content">
    <div class="appoint">
      <p class="title clearfix">
        <Button
          class="iblock fr ivu-btn-primary"
          type="primary"
          @click="add"
        >
          添加
        </Button>
      </p>
      <Table
        :columns="managerHeader"
        :data="data"
      >
        <template
          slot="time"
          slot-scope="{ row }"
        >
          {{ dayjs(row.created_time).format("YYYY-MM-DD HH:mm") }}
        </template>

        <template
          slot="operate"
          slot-scope="{ row }"
        >
          <span
            class="danger"
            @click="remove(row.uid)"
          >撤销</span>
        </template>
      </Table>
      <Page
        v-if="pages.total > 20"
        class="page pt"
        :total="pages.total"
        :page-size="pages.size"
        show-total
        show-elevator
        @on-change="changePage"
      />
    </div>

    <Modal
      v-model="addFlag"
      title="添加房管"
      class-name="vertical-center-modal"
      width="400"
    >
      <div class="form">
        <label class="desc">会员用户帐号：</label>
        <Input
          v-model="nickname"
          class="input-width"
        />
      </div>
      <div class="form">
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

      <div slot="footer" />
    </Modal>

    <Modal
      v-model="delFlag"
      class-name="vertical-center-modal"
      width="360"
    >
      <div style="text-align:center">
        <p>是否撤销？</p>
      </div>
      <div slot="footer">
        <i-button
          type="error"
          size="large"
          long
          @click="del"
        >
          撤销
        </i-button>
      </div>
    </Modal>
  </div>
</template>

<script >
import { Table, Button, Modal, Input, Page } from 'iview'
import mixin from '../mixins'

export default {
  components: {
    Table,
    Button,
    Modal,
    Input,
    Page,
    'i-button': Button
  },
  mixins: [mixin],
  data() {
    return {
      data: [],
      addFlag: false,
      delFlag: false,
      nickname: '',
      uid: '',
      pages: {
        page: 1,
        size: 20,
        total: 0
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.getTableData()
    },

    getTableData() {
      this.$get('v2.1/roommanager/get', {
        apiType: 'anchor',
        body: {
          anchor_uid: this.getUserInfo().uid,
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
          this.data = []
        }
      })
    },

    changePage(val) {
      this.pages.page = val
      this.getTableData()
    },

    confirm() {
      if (!this.nickname) {
        this.$error('请输入会员用户帐号')
        return
      }
      this.$post('v2.1/roommanager/add', {
        apiType: 'anchor',
        body: {
          anchor_uid: this.getUserInfo().uid,
          nickname: this.nickname
        }
      }).then(res => {
        const { code, msg } = res
        if (this.$judgeCode(code)) {
          this.$success('添加成功')
          this.addFlag = false
          this.getTableData()
        } else {
          this.$error(msg)
        }
      })
    },

    add() {
      this.addFlag = true
      this.nickname = ''
    },

    cancel() {
      this.addFlag = false
      this.nickname = ''
    },

    remove(uid) {
      this.delFlag = true
      this.uid = uid
    },

    handlerDelete() {
      this.$post('v2.1/roommanager/delete', {
        apiType: 'anchor',
        body: {
          anchor_uid: this.getUserInfo().uid,
          uid: this.uid
        }
      })
        .then(res => {
          const { code, msg } = res
          if (this.$judgeCode(code)) {
            this.$success('撤销成功')
            this.getTableData()
            this.delFlag = false
          } else {
            this.$error(msg)
          }
        })
        .catch()
    },

    del() {
      this.handlerDelete()
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  padding: 0 40px 50px;
  .appoint {
    margin-bottom: 70px;
  }
}

.list {
  margin-top: 20px;
}

/deep/ .clearfix:after {
  clear: right;
}

/deep/ .ivu-select-selected-value {
  line-height: 27px !important;
}

.title {
  font-weight: 500;
  padding-top: 31px;
  padding-bottom: 24px;
  font-size: 14px;
  color: #333333;
  span {
    font-size: 13px;
    color: #999;
  }
}

.order-header {
  .select-small {
    width: 74px;
  }
  /deep/ .ivu-select-selection {
    height: 26px;
  }
  /deep/ .ivu-select-selected-value {
    font-size: 12px;
    color: #666666;
  }
  /deep/ .ivu-select-input {
    height: 27px;
    line-height: 27px;
  }

  &__title {
    font-size: 14px;
    color: #333333;
    padding-top: 5px;
  }
  .option-label {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #333333;
    letter-spacing: 0;
  }
}

.ivu-btn-primary {
  width: 90px;
}
.form {
  display: block;
  margin-bottom: 15px;
  .desc {
    color: #333;
    font-size: 14px;
    display: inline-block;
    width: 99px;
  }
  /deep/ .ivu-input {
    width: 200px;
  }
  .input-width {
    width: 200px;
  }
}
/deep/ .ivu-modal-footer {
  border-top: none;
}
.danger {
  font-size: 12px;
  color: #f82301;
  letter-spacing: 0;
  text-align: center;
  cursor: pointer;
}
</style>