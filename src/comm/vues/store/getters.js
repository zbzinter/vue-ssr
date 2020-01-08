export default {
  loadingStatus(state) {
    // loading状态
    if (state.loadingNum > 0) {
      return 1
    } else {
      return 0
    }
  },
  noHeader(state){
    return state.noHeader
  }
}
