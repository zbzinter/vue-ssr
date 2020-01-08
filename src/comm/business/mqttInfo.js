

import Fingerprint from 'fingerprintjs'
import Http from '@utils/Http'
import {mqttTokenLocalId} from '@config/storageIds'


const http = new Http()


// 設置token
function setMqttToken(info){
  localStorage.setItem(mqttTokenLocalId, JSON.stringify(info))
}

function getMqttToken() {
  return JSON.parse(localStorage.getItem(mqttTokenLocalId))
}

export default ()=>{
  return new Promise((resolve, reject) => {
    let mqttToken = getMqttToken()
    
    if (mqttToken) {
      resolve(mqttToken)
    } else {
      const clientId = new Fingerprint().get()
      http.$get('v3/mqtt_info', {
        apiType: 'api',
        body: {
          platform: 'web',
          device_id: clientId
        }
      }).then(res => {
        if (res.data) {
          let { data } = res
          setMqttToken(data)
          resolve(data)
        } else {
          reject(res)
        }
      }).catch(err => {
        reject(err)
      })
    }
  })
}