
import { getDevEnv } from '@utils/env'
import Service from '@src/services/service-base'

class CommonService extends Service {
  upload(param) {
    return this.http.post(`https://multimedia.${getDevEnv()}.qiuhui.com/upload`, param)
  }
}

export default new CommonService()
