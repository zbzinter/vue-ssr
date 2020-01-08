<template>
  <div
    class="index-content"
    :style="{width: isShowGun?'560px':'390px'}"
  >
    <p class="content-title">
      {{ hostTeamName }}
      <span v-if="status == 1 || status == 4">vs</span>
      <span v-else>{{ hostTeamScore }} - {{ guestTeamScore }}</span>
      {{ guestTeamName }}
    </p>
    <table>
      <thead>
        <tr>
          <th>赔率</th>
          <th colspan="3">
            初盘指数
          </th>
          <th colspan="3">
            即时指数
          </th>
          <th
            v-if="isShowGun"
            colspan="3"
          >
            滚球指数
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="info && (info['2'] || info['128'])">
          <td>欧</td>
          <td>{{ info['2'] ? info['2'].value0ForType1 : '-' }}</td>
          <td>{{ info['2'] ? info['2'].value0ForTypeX : '-' }}</td>
          <td>{{ info['2'] ? info['2'].value0ForType2 : '-' }}</td>
          <td :class="mqttChangeClassIcon(info['2'] && info['2'].icon1)">
            {{ info['2'] ? info['2'].valueForType1 : '-' }}
          </td>
          <td :class="[mqttChangeClassIcon(info['2'] && info['2'].icon), 'center']">
            <!-- <span class="text-green">{{info['1'].valueForTypeX || '-'}}</span> -->
            <div>
              <span>{{ info['2'] ? info['2'].valueForTypeX : '-' }}</span>
            </div>
          </td>
          <td :class="mqttChangeClassIcon(info['2'] && info['2'].icon2)">
            <!-- <span class="text-red">{{info['1'].valueForType2 || '-'}}</span> -->
            <span>{{ info['2'] ? info['2'].valueForType2 : '-' }}</span>
          </td>

          <td
            v-if="isShowGun"
            :class="mqttChangeClassIcon(info['128'] && info['128'].icon1)"
          >
            {{ info['128'] ? info['128'].valueForType1 : '-' }}
          </td>
          <td
            v-if="isShowGun"
            :class="[mqttChangeClassIcon(info['128'] && info['128'].icon), 'center']"
          >
            <div>
              {{ info['128'] ? info['128'].valueForTypeX : '-' }}
            </div>
          </td>
          <td
            v-if="isShowGun"
            :class="mqttChangeClassIcon(info['128'] && info['128'].icon2)"
          >
            {{ info['128'] ? info['128'].valueForType2 : '-' }}
          </td>
        </tr>
        <tr v-if="info && (info['1'] || info['121'])">
          <td>亚</td>
          <td>{{ info['1'] ? info['1'].value0ForType1 : '-' }}</td>
          <td>{{ info['1'] ? info['1'].ovalue0 : '-' }}</td>
          <td>{{ info['1'] ? info['1'].value0ForType2 : '-' }}</td>
          <td :class="mqttChangeClassIcon(info['1'] && info['1'].icon1)">
            <!-- <span class="text-green">{{info['2'].valueForType1 || '-'}}</span> -->
            <span>{{ info['1'] ? info['1'].valueForType1 : '-' }}</span>
          </td>
          <td :class="[mqttChangeClassIcon(info['1'] && info['1'].icon), 'center']">
            <div>
              {{ info['1'] ? info['1'].ovalue : '-' }}
            </div>
          </td>
          <td :class="mqttChangeClassIcon(info['1'] && info['1'].icon2)">
            <!-- <span class="text-red">{{info['2'].valueForType2 || '-'}}</span> -->
            <span>{{ info['1'] ? info['1'].valueForType2 : '-' }}</span>
          </td>

          <td
            v-if="isShowGun"
            :class="mqttChangeClassIcon(info['121'] && info['121'].icon1)"
          >
            {{ info['121'] ? info['121'].valueForType1 : '-' }}
          </td>
          <td
            v-if="isShowGun"
            :class="[mqttChangeClassIcon(info['121'] && info['121'].icon), 'center']"
          >
            <div>
              {{ info['121'] ? info['121'].ovalue : '-' }}
            </div>
          </td>
          <td
            v-if="isShowGun"
            :class="mqttChangeClassIcon(info['121'] && info['121'].icon2)"
          >
            {{ info['121'] ? info['121'].valueForType2 : '-' }}
          </td>
        </tr>
        <tr v-if="info && (info['3'] || info['122'])">
          <td>大</td>
          <td>{{ info['3'] ? info['3'].value0ForType1 : '-' }}</td>
          <td>{{ info['3'] ? info['3'].ovalue0 : '-' }}</td>
          <td>{{ info['3'] ? info['3'].value0ForType2 : '-' }}</td>
          <td :class="mqttChangeClassIcon(info['3'] && info['3'].icon1)">
            {{ info['3'] ? info['3'].valueForType1 : '-' }}
          </td>
          <td :class="[mqttChangeClassIcon(info['3'] && info['3'].icon), 'center']">
            <div>
              {{ info['3'] ? info['3'].ovalue : '-' }}
            </div>
          </td>
          <td :class="mqttChangeClassIcon(info['3'] && info['3'].icon2)">
            {{ info['3'] ? info['3'].valueForType2 : '-' }}
          </td>

          <td
            v-if="isShowGun"
            :class="[mqttChangeClassIcon(info['122'] && info['122'].icon1)]"
          >
            {{ info['122'] ? info['122'].valueForType1 : '-' }}
          </td>
          <td
            v-if="isShowGun"
            :class="[mqttChangeClassIcon(info['122'] && info['122'].icon), 'center']"
          >
            <div>
              {{ info['122'] ? info['122'].ovalue : '-' }}
            </div>
          </td>
          <td
            v-if="isShowGun"
            :class="[mqttChangeClassIcon(info['122'] && info['122'].icon2)]"
          >
            {{ info['122'] ? info['122'].valueForType2 : '-' }}
          </td>          
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  props: {
    status: {
      type: [Number, String],
      default: ''
    },
    hostTeamName: {
      type: String,
      default: ''
    },
    guestTeamName: {
      type: String,
      default: ''
    },
    hostTeamScore: {
      type: [String, Number],
      default: 3
    },
    guestTeamScore: {
      type: [String, Number],
      default: 2
    },
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    isShowGun(){
      let isTure = false
      let valArr = []
      for (const [index, item] of Object.entries(this.info)) {
        if((index === '121' || index === '122') && _.isObject(item)){
          let {valueForType1, ovalue, valueForType2} = item
          valArr = valArr.concat(valArr, [valueForType1, ovalue, valueForType2])
        }
        if(index === '128' && _.isObject(item)){
          let {valueForType1, valueForTypeX, valueForType2} = item
          valArr = valArr.concat(valArr, [valueForType1, valueForTypeX, valueForType2])
          
        }
      }
      isTure = valArr.filter(d=>d).length
      return isTure
    }
  },
  methods: {
    mqttChangeClassIcon (className) {
      return className === 'iconca_ei' ? 'up' : className === 'iconca_el' ? 'down' : '' 
    }
  }
}
</script>
<style lang="postcss" scoped>
.index-content {
  /* width: 408px; */
  width: 408px;
  background: rgba(0, 0, 0, 0.85);
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.09);
  border-radius: 4px;
  font-size: 12px;
  color: #ffffff;
  text-align: center;
  .content-title {
    font-size: 14px;
    color: #ffffff;
    line-height: 22px;
    padding: 4px 0;
    span {
      font-size: 16px;
      margin: 0 10px;
    }
  }
  table {
    width: 100%;
    line-height: 20px;
    td,
    th {
      border: solid 1px #666666;
    }
    thead {
      th {
        border-top: none;
        color: #d4d4d4;
        background: #000000;
        padding: 6px 0;
      }
    }
    tbody {
      tr {
        td:first-child {
          border: none;
        }
        span {
          display: inline-block;

          border-radius: 4px;
          padding: 0 6px;
          &.text-green {
            background: #168058;
          }
          &.text-red {
            background: #e15756;
          }
        }
        td{
            padding: 4px 0;
            &.up{
              color: #E15756;
            }
            &.down{
              color: #629500;
            }
            &.up.center, &.down.center{
              div{
                  display: inline-block;
                  color: #fff;
                  border-radius: 4px;
                  padding: 0 6px;
              }
              &.up div{
                background: #E15756;
              }
              &.down div{
                background: #629500;
              }
            }
        }
      }
    }
  }
}
</style>
