<template>
  <div class="sec-operate">
    <div class="tab">
      <div @click="returnParent">
        <i class="iconfont iconfj_dj" /> 
        <i class="iconfont iconfk_dj" /> 
        <p>绑定银行卡</p>
      </div>
    </div>
    <Form
      class="form"
      label-position="right"
      :label-width="110"
    >
      <FormItem
        label="银行账号："
      >
        <Input
          v-model="formItem.cardNum"
          type="text"
          class="long-width"
          placeholder="请输入您的银行账号"
          :maxlength="19"
          @on-keyup="formItem.cardNum = formItem.cardNum.replace(/[^0-9]/g, '')"
        />
      </FormItem>
      <FormItem
        label="开户银行："
      >
        <Select
          v-model="formItem.accountBank"
          placeholder="请选择开户银行"
          class="long-width"
          @on-change="selectAccountBank"
        >
          <Option
            v-for="item in renderData.bank"
            :key="item.code"
            :value="`${item.code}-${item.name}`"
          >
            {{ item.name }}
          </Option>
        </Select>
      </FormItem>
      
      <FormItem
        label="银行名称："
      >
        <Select
          v-model="formItem.province"
          placeholder="请选择省份"
          class="short-width"
          @on-change="selectProvince"
        >
          <Option
            v-for="item in renderData.province"
            :key="item.code"
            :value="`${item.code}-${item.name}`"
          >
            {{ item.name }}
          </Option>
        </Select>
        <Select
          v-model="formItem.city"
          class="short-width"
          placeholder="请选择地区"
          @on-change="selectCity"
        >
          <Option
            v-for="item in renderData.city"
            :key="item.code"
            :value="`${item.code}-${item.name}`"
          >
            {{ item.name }}
          </Option>
        </Select>
        <Select
          v-model="formItem.branch"
          class="short-width"
          placeholder="请选择支行"
        >
          <Option
            v-for="item in renderData.branch"
            :key="item.code"
            :value="`${item.sub_branch_id}-${item.sub_branch_name}`"
          >
            {{ item.sub_branch_name }}
          </Option>
        </Select>
      </FormItem>
      <Identity />
      <Code ref="code" />
      <FormItem
        label=""
      >
        <Button
          class="bt-width"
          type="warning"
          @click="submit()"
        >
          立即提交
        </Button>
      </FormItem>
    </Form>
    <div
      v-if="errorTip"
      class="error-tip"
    >
      {{ errorTip }}
    </div>
    <div
      v-if="successTip"
      class="success-tip"
    >
      {{ successTip }}
    </div>
  </div>
</template>
<script>
import { Button, Input,Form, FormItem, Select, Option} from 'iview'
import { mapActions } from 'vuex'
import Code from '@src/components/personal/code'
import Identity from './components/identity'
import { _getBankInfoByCardNo } from '../data/card-no'
import { BANK } from '../data/bank'
import { PROVINCES, CITY } from '../data/provinces-city'

export default {
  components: {
    Button,
    Input,
    Form, 
    FormItem,
    Select,
    Option,
    Identity,
    Code
  },
  data() {
    return {
      formItem: {
        accountBank: '',
        cardNum: '',
        code: '',
        province: '',
        city: '',
        branch: '',
      },
      renderData: {
        bank: BANK,
        province: PROVINCES,
        city: [],
        branch: [],
      },
      city: '',
      errorTip: '',
      successTip: '',
      timer: null
    }
  },
  watch: {
    'formItem.cardNum': {
      handler: function (val) {
        if (val.length > 14) {
          const cardNum = _getBankInfoByCardNo(val)
          if (cardNum) {
            this.formItem.accountBank = cardNum.bankCode + '-' + cardNum.bankName
          }
        }        
      },
      deep: true
    }
  },
  created() {
    this.init()
  },
  methods: {
    ...mapActions(['CheckCode', 'GetBankInfo', 'CheckBank']),

    init() {
      if (this.$parent.changeFlag) {
        this.GetBankInfo({id: this.getUserInfo().uid, vm: this,})
          .then((data) => {
            this.formItem = {
              accountBank:  data.bank_id + '-' + data.bank_name,
              cardNum: data.bank_account,
              code: '',
              province: data.province_id + '-' + data.bank_address.split('-')[0],
              city: data.city_id + '-' + data.bank_address.split('-')[1],
              branch: data.sub_branch_id + '-' + data.bank_subbranch,
            }
            const city = this.formItem.city
            this.city = city
            this.selectProvince(this.formItem.province)
            this.selectCity(this.city)
            this.city = city
          })
          .catch(() => {
            this.errorTip = '接口失败'
          })
      }
    },

    selectAccountBank() {
      this.formItem.branch = ''
      this.formItem.province = ''
      this.formItem.city = ''
      this.renderData.city = []
      this.renderData.branch = []
    },

    selectProvince(val) {
      if (val) {
        this.renderData.city = []
        this.renderData.city = CITY[val.split('-')[0]]
      }
    },

    async selectCity() {
      if (!this.formItem.province && !this.formItem.city) {
        return
      }
      const provinceId = this.formItem.province.split('-')[0]
      let cityId = this.formItem.city.split('-')[0] || this.city.split('-')[0]
      const postData = `bank_id=${this.formItem.accountBank.split('-')[0]}&province_id=${provinceId}&city_id=${cityId}`
      try {
        const {data} = await  this.$get(`v2/members/banks?${postData}`, {
          apiType: 'goShop',
        })
        this.renderData.branch = data || []

      } catch(e) {
        this.renderData.branch = []
      }
    },

    validate() {
    
      this.formItem.code = this.$refs.code.getInputCode()
      const tipArr = [
        {
          name: 'cardNum',
          key: 1,
        },
        {
          name: 'province',
          key: 2,
        },
        {
          name: 'city',
          key: 2,
        },
        {
          name: 'code',
          key: 3,
        },
      ]
      for(let i = 0; i < tipArr.length; i += 1) {
        const name =  tipArr[i].name
        const key =  tipArr[i].key
        const val = this.formItem[name]
        if (!val) {
          this.errorTip = '必填项不能为空'
          break
        }
        if (key === 1) {
          if (val.length < 14) {
            this.errorTip = '银行卡信息有误'
            break
          }
          // const pattern = /^([1-9]{1})(\d{14}|\d{19})$/
          // if (!pattern.test(val)) {
          //   this.errorTip = '银行账号格式不正确'
          //   break
          // }
        }
      }
      return this.errorTip
    },

    submit() {
     
      this.validate()
      if (this.errorTip) {
        return 
      }

      this.CheckBank({param: {
        bank_username: this.commUserInfo.trueName,
        bank_account: this.formItem.cardNum,
        bank_username_card: this.commUserInfo.certId,
        user_id: this.commUserInfo.uid,
      }, vm: this})
        .then((data) => {
          if (data) {
            this.CheckCode({param: {
              phone: this.commUserInfo.mobile,
              code: this.formItem.code,
              type: 4
            }, vm: this})
              .then((isCorrect) => {
                if (isCorrect) {
                  this.bindCard()
                } else {
                  this.errorTip = '验证码错误'
                }
              })
          } else {
            this.errorTip = '暂不支持该银行卡校验'
          }
        }).catch(() => {
          this.errorTip = '暂不支持该银行卡校验'
        })
      
    },

    bindCard() {
    
      const url = this.$parent.changeFlag ? 'update' : 'add'
      this.$post(`v2/members/banks/${url}/${this.commUserInfo.uid}`, {
        apiType: 'goShop',
        body: {
          user_id: this.commUserInfo.uid,
          bank_id: Number(this.formItem.accountBank.split('-')[0]),
          bank_name: this.formItem.accountBank.split('-')[1],
          bank_account: this.formItem.cardNum,
          bank_subbranch: this.formItem.branch.split('-')[1] || '',
          sub_branch_id: Number(this.formItem.branch.split('-')[0]),
          bank_address: this.formItem.province.split('-')[1] + '-' + this.formItem.city.split('-')[1],
          bank_username: this.commUserInfo.trueName,
          bank_username_card: this.commUserInfo.certId,
          province_id: Number(this.formItem.province.split('-')[0]),
          city_id: Number(this.formItem.city.split('-')[0]),
        }
      }).then((res) => {
        if (this.$judgeCode(res.code)) {
          this.successTip = '银行卡绑定成功'
          setTimeout(() => {
            window.location.reload()
          }, 3000)
        } else {
          this.errorTip = '暂不支持该银行卡校验'
        }
      }).catch(() => {
        this.errorTip = '绑定银行卡失败，请稍后重试'
      })
    },

    returnParent() {
      this.$parent.flag = true
    },
  }
}
</script>
<style lang="scss" scoped>
@import '../style/index.scss';
@import './../../../../public/personal/form.scss';
@import './../../../../public/personal/sec-operate.scss';


.tab {
  p {
    padding-left: 6px;
  }
}

/deep/.ivu-select-visible .ivu-select-selection {
  &:focus {
    border-color: #3683FF;
    box-shadow: none;
  }
  box-shadow: none;
}


.ivu-select-item {
  font-family: PingFangSC-Regular;
  color: #666666;
  &:hover {
    background: #3683FF;
    color: #fff;
  }
}
.ivu-select-item-focus {
  background: #fff;
}

.error-tip {
  top: 50%;
  left: 50%;
  margin-top: -16px;
  margin-left: -40px;
}

</style>


