import Vue from 'vue'
import Vuex from 'vuex'

import account from './account'
import profile from './profile'

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
    profile,
  },
})

export default store
