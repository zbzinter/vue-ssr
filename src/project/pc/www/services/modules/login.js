import axios from '@src/services'
import { getDevEnv } from '@utils/env'
import qs from 'querystring'

class LoginService {
  constructor(http) {
    this.http = http
    this.url = `https://gw.${getDevEnv()}.qiuhui.com`
  }

  login(param) {
    return this.http.get(`${this.url}/jmfen-sport-passport/app/login?${qs.stringify(param)}`)
  }

}

export default new LoginService(axios)
