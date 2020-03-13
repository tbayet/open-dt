import Vue from 'vue'
import Vuex from 'vuex'

import account from './account'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    ready: false,
  },
  mutations: {
    READY: state => {
      state.ready = true
    },
  },
  actions: {
    async init({ commit, dispatch }) {
      await dispatch('account/init')
      commit('READY')
    },
  },
  modules: {
    account,
  },
})

export default store
