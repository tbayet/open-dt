
import { AccountQuery } from '../graphql/User.gql'
import {
  Apollo, onLogin, onLogout, AUTH_TOKEN,
} from '../vue-apollo'

const API_PATH = 'http://localhost:4000'

const queryAccount = async () => {
  let account = {}
  const { data } = await Apollo.client.query({
    query: AccountQuery,
  })
  account = data.account
  return account
}

const getDefaultState = (account = {}) => ({
  id: account.id || null,
  role: account.role || null,
  username: account.username || null,
  avatar: account.avatar ? `${API_PATH}/${account.avatar}` : null,
})

const userStore = {
  namespaced: true,

  state: {
    isAuthenticated: false,
    ...getDefaultState(),
  },

  mutations: {
    ASSIGN: (state, account) => {
      Object.assign(state, getDefaultState(account))
    },
    SIGNED_IN: state => {
      state.isAuthenticated = true
    },
    SIGNED_OUT: state => {
      state.isAuthenticated = false
    },
  },

  actions: {
    async init({ commit }) {
      const isAuthenticated = !!(localStorage && localStorage.getItem(AUTH_TOKEN))
      if (isAuthenticated) {
        commit('SIGNED_IN')
      }
      commit('ASSIGN', isAuthenticated ? await queryAccount() : {})
    },

    async signIn({ commit }, { token }) {
      await onLogin(Apollo.client, token)
      const { data } = await Apollo.client.query({
        query: AccountQuery,
      })
      commit('SIGNED_IN')
      commit('ASSIGN', data.account)
    },
    async signOut({ commit }) {
      await onLogout(Apollo.client)
      commit('SIGNED_OUT')
      commit('ASSIGN', {})
    },
  },
}

export default userStore
