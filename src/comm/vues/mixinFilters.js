import Vue from 'vue'
import dateFormat from '@utils/dateFormate'

export default (filters = {}) => {
  /**
   * dateFilter事件格式化
   * @param  {[Number,String]} [value=Date.now()] [需转化的时间戳或一个能格式化的时间字符串，默认为当前时间]
   * @param  {[String]} [format='yyyy-M-d'] [需转化的时间格式]
   * yyyy年，月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q)，两个字符表示按2位字符输入
   */
  Vue.filter('dateFilter', (value, format) => {
    return dateFormat(value, format)
  })

  // 整合传入的filters
  Object.keys(filters).forEach(item => {
    Vue.filter(item, filters[item])
  })

}
