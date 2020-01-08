<!-- 足球三合一 -->
<template>
  <div class="three">
    <Table
      class="data-table"
      :columns="columns"
      :data="oddsData"
      @on-select="checkedHandler"
      @on-select-cancel="checkedCancelHandler"
    />
    <FilterColumn
      :odds-data.sync="oddsData"
      :selected.sync="selected"
      :match-data="matchData"
      :type-id="0"
    />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions, mapGetters } = createNamespacedHelpers('odds')
import {Table} from 'iview'
import FilterColumn from '../Common/FilterColumn'
import oddsjs from '../../mixins/MixinsOdds'
import MixinsOddsPush from '../../mixins/MixinsOddsPush'
export default {
  components: {
    Table,
    FilterColumn
  },
  mixins: [oddsjs, MixinsOddsPush],
  props: [
    'matchData'
  ],
  data () {
    return {
      ischeck: false,
      isEarlyPan: false,
      titles: ['', '客队', '盘口', '主队', '客队', '盘口', '主队', ''],
      selected: [],
      oddsData: []
    }
  },
  computed: {
    ...mapState(['tempOddsData']),
    ...mapGetters(['filterOddsArr']),
    getVuexFilterOdds(){
      return this.filterOddsArr({$set: this.$set,typeId:3, matchData: this.matchData})
    },
    columns(){
      return [
        {
          title: '选择',
          type: 'selection',
          width: 50,
          align: 'center',
          className: 'b-r',
          renderHeader: (h, params)=>{
            return h('span', {
            }, '全选')
          }
        },
        {
          title: '公司',
          key: 'bookName',
          width: 134,
          className: 'b-r',
          align: 'left',
          ellipsis: true
        },
        {
          title: '类型',
          key: 'bookName',
          width: 100,
          className: 'b-r two-row',
          align: 'center',
          render: (h, {row, column, index})=>{
            return h('div', {
            },[
              h('div', {
                class: 'early single'
              },'初盘'),
              h('div',{
                class: 'single'
              }, '即盘'),
            ])
          }
        },
        {
          title: '欧指',
          key: 'valueForType1',
          className: 'b-r two-row',
          width: 305,
          align: 'center',
          render: (h, {row, column, index})=>{
            return h('div', {
              class: 'ouzhi'
            }, [
              h('div', {
                class: 'early single'
              },[
                h('span',{
                }, (this.getOddsType(row, 2, 'first').value0ForType1) || '-'),
                h('span',{
                }, (this.getOddsType(row, 2, 'first').value0ForTypeX) || '-'),
                h('span',{
                }, (this.getOddsType(row, 2, 'first').value0ForType2) || '-')
              ]),
              h('div', {
                class: 'single'
              },[
                h('span',{
                  class: this.setColor(this.getOddsType(row, 2).value0ForType1, this.getOddsType(row, 2).valueForType1)
                }, (this.getOddsType(row, 2).valueForType1) || '-'),
                h('span',{
                  class: `${this.setColor(this.getOddsType(row, 2).value0ForTypeX, this.getOddsType(row, 2).valueForTypeX)} mid`
                },(this.getOddsType(row, 2).valueForTypeX) || '-'),
                h('span',{
                  class: this.setColor(this.getOddsType(row, 2).value0ForType2, this.getOddsType(row, 2).valueForType2)
                },(this.getOddsType(row, 2).valueForType2) || '-')
              ])
            ])
          },
          renderHeader: (h, params)=>{
            return h('div', {
              class: 'ouzhi single'
            },[
              h('div','欧盘指数'),
              h('span','主胜'),
              h('span', '平局'),
              h('span', '客胜')
            ])
          }
        },
        {
          title: '亚盘',
          key: 'valueForType1',
          className: 'b-r two-row',
          width: 305,
          align: 'center',
          render: (h, {row, column, index})=>{
            return h('div', {
              class: 'ouzhi'
            }, [
              h('div', {
                class: 'early single'
              },[
                h('span',{
                }, (this.getOddsType(row, 1, 'first').value0ForType1) || '-'),
                h('span',{
                }, (this.getOddsType(row, 1, 'first').ovalue0) || '-'),
                h('span',{
                }, (this.getOddsType(row, 1, 'first').value0ForType2) || '-')
              ]),
              h('div', {
                class: 'single'
              },[
                h('span',{
                  class: this.setColor(this.getOddsType(row, 1).value0ForType1, this.getOddsType(row, 1).valueForType1)
                }, (this.getOddsType(row, 1).valueForType1) || '-'),
                h('span',{
                  class: `${this.setColor(this.getOddsType(row, 1).ovalue0Num, this.getOddsType(row, 1).ovalueNum)} mid`
                }, (this.getOddsType(row, 1).ovalue) || '-'),
                h('span',{
                  class: this.setColor(this.getOddsType(row, 1).value0ForType2, this.getOddsType(row, 1).valueForType2)
                }, (this.getOddsType(row, 1).valueForType2) || '-')
              ])
            ])
          },
          renderHeader: (h, params)=>{
            return h('div', {
              class: 'ouzhi single'
            },[
              h('div','亚盘'),
              h('span','主胜'),
              h('span', '盘口'),
              h('span', '客胜')
            ])
          }
        },
        {
          title: '大小指数',
          key: 'valueForType1',
          className: 'two-row',
          width: 305,
          align: 'center',
          render: (h, {row, column, index})=>{
            return h('div', {
              class: 'ouzhi'
            }, [
              h('div', {
                class: 'early single'
              },[
                h('span',{
                }, (this.getOddsType(row, 3, 'first').value0ForType1) || '-'),
                h('span',{
                }, (this.getOddsType(row, 3, 'first').ovalue0) || '-'),
                h('span',{
                }, (this.getOddsType(row, 3, 'first').value0ForType2) || '-')
              ]),
              h('div', {
                class: 'single'
              },[
                h('span',{
                  class: this.setColor(this.getOddsType(row, 3).value0ForType1, this.getOddsType(row, 3).valueForType1)
                }, (this.getOddsType(row, 3).valueForType1) || '-'),
                h('span',{
                  class: `${this.setColor(this.getOddsType(row, 3).ovalue0Num, this.getOddsType(row, 3).ovalueNum)} mid`
                }, (this.getOddsType(row, 3).ovalue) || '-'),
                h('span',{
                  class: this.setColor(this.getOddsType(row, 3).value0ForType2, this.getOddsType(row, 3).valueForType2)
                }, (this.getOddsType(row, 3).valueForType2) || '-')
              ])
            ])
          },
          renderHeader: (h, params)=>{
            return h('div', {
              class: 'ouzhi single'
            },[
              h('div','大小'),
              h('span','大球'),
              h('span', '盘口'),
              h('span', '小球')
            ])
          }
        }
      ]
    },
    getOddsType () {
      return (odds, tabIndex, type)=> { // tabIndex = 1亚2欧3大; tabIndex='first'初盘
        if(!Array.isArray(odds.coOddsWithMatchList)) return {}
        let typeId
        switch (tabIndex) {
        case 1: typeId=121;break
        case 2: typeId=128;break
        case 3: typeId=122;break
        }
        if (type === 'first') return odds.coOddsWithMatchList.find(item => item.typeId === tabIndex) || {}
        let findItem = odds.coOddsWithMatchList.find(item => item.typeId === tabIndex)
        let rollFindItem = odds.coOddsWithMatchList.find(item => item.typeId === typeId)
        !findItem && rollFindItem && (findItem = {})
        findItem && rollFindItem && (findItem = {
          ...findItem,
          valueForType1: rollFindItem.valueForType1,
          valueForType2: rollFindItem.valueForType2,
          valueForTypeX: rollFindItem.valueForTypeX,
          ovalue: rollFindItem.ovalue
        })
        return findItem || {}
      }
    }
  },
  created () {
    this.getOddsApi({matchId: this.matchData.matchId, $get: this.$get}).then((res)=>{
      this.oddsData = this.tempOddsData
    })
  },
  methods: {
    ...mapActions(['getOddsApi']),
    setColor (front = 0, back = 0) { // 即盘的颜色设置
      front = parseFloat(front)
      back = parseFloat(back)
      if (back > front) {
        return 'iconca_ei' // 红升
      } else if (back < front) {
        return 'iconca_el' // 绿降
      }
    },
    checkedHandler(selectedItems){
      this.selected = selectedItems
    },
    checkedCancelHandler(selectedItems){
      this.selected = selectedItems
    }
  }
}
</script>

<style scoped lang="scss">
@import '../Common/oddsPush.scss';
.three{
  position: relative;
  margin: 0 auto;
  width: 1200px;
  padding-bottom: 28px;
  background-color: #fff;
  .bg{
    height: 30px;
    border-bottom: 1px solid #EAEAEA;
  }
}
$gray: #dedede;
$bg-gray: #f7f7f8;
/deep/ {
  .green{
        color: #4DA183      
    }
    .red{
        color: #E15756
    }
  .ivu-table-wrapper{
    border: 0
  }
  .b-r{
    border-right:1px solid $gray;
  }
  .ivu-table:after{
    width: 0
  }
  thead .ivu-table-cell-with-selection{
    display: none
  }
  thead, tbody{
    tr{
      td:nth-of-type(1),th:nth-of-type(1){
        border-right: 0;
        div{
          padding-right: 0;
        }
      }
      td:nth-of-type(2),th:nth-of-type(2){
        border-left: 0;
      }
    }
  }
  .ic_checked_cf{
    display:inline-block;
    width: 14px;
    height: 14px;
    background: url(../../../../assets/score/football/bt_cg.png) center center no-repeat;
    background-size: 100% auto;
    background-repeat: no-repeat;
  }
  .iconbs_cf{
    font-family: 'iconfont';
    font-size: 14px;
  }
  .ivu-checkbox{
    &.ivu-checkbox-checked{
      .ivu-checkbox-inner{
        background-color: transparent;
        @extend .ic_checked_cf;
        &:after{
          display: none;
        }
        &:before{
          display: none;
        }
      }
    }
    .ivu-checkbox-focus{
      box-shadow: none
    }
    .ivu-checkbox-inner{
      transition: none;
      background-color: transparent;
      border: 0;
      @extend .iconbs_cf;
      &:before{
        content: "\e632"
      }
    }
  }
  .data-table{
    .single-span{
      display: inline-block;
      width: 33.3%;
      text-align: center;    
    }
    thead{
      line-height: 40px;
      .two-row{
        .ivu-table-cell{
          padding: 0;
          height: 100%;
          width: 100%;
        }
        .single{
          width: 100%;
          height: 100%;
          span{
            @extend .single-span
          }
        }
      }
    }
    tbody{
      tr:nth-of-type(2n-1){
        td{
          background: #FAFAFA 
        }
      }
      .two-row{
        .ivu-table-cell{
          padding: 0;
          height: 100%;
        }
        .single{
          display: block;
          line-height: 35px;
          height: 35px;
          span{
            @extend .single-span
          }
        }
        .early:nth-of-type(1){
          border-bottom: 1px solid #EAEAEA;
        }
      }
    }
  }
}

</style>
