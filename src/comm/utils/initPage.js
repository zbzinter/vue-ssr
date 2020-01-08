import setRem from '@utils/setRem'

import { getProjectConf, isPc } from '@utils/env'

import { getServerConf } from '@config/apiConf'

// import { user } from '@business/user'


let { webInfo } = getServerConf()

const {
  codeType
} = getProjectConf()

// const isDev = location.hostname.search(/dev\./) > -1

// 在pc环境跳转到pc站
if (window.location.href.indexOf('isPc') === -1) {
  if (codeType === 'pc' && !isPc()) {
    window.location.href = webInfo.m
  }
}


// 在mobile环境跳转到mobile站
if (codeType !== 'pc' && isPc()) {
  window.location.href = webInfo.pc
}



if (codeType !== 'pc') {
  setRem()
}