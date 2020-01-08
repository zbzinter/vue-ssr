import Vue from 'vue'
import Vuex from 'vuex'
import actions from '@vues/store/actions'
import getters from '@vues/store/getters'
import mutations from '@vues/store/mutations'
import state from '@vues/store/state'
import { clone } from '@jsmini/clone'

Vue.use(Vuex)

export default (modulesParams = {}) => {
  const modules = clone(modulesParams)
  return new Vuex.Store({
    state: clone(state),
    mutations: clone(mutations),
    actions: clone(actions),
    getters: clone(getters),
    modules
  })
}
