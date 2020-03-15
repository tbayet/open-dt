import { Apollo } from '../vue-apollo'
import { graphqlToObject } from '../utils/graphql'
import {
  SectionGender, SectionPictures, SectionName, SectionPunchline,
} from '../graphql/Profile.gql'

const sections = {
  sectionGender: SectionGender,
  sectionPictures: SectionPictures,
  sectionName: SectionName,
  sectionPunchline: SectionPunchline,
}

const API_PATH = 'http://localhost:4000'

const getDefaultState = (user = {}) => ({
  id: user.id || null,
  username: user.username || null,
  birthdate: user.birthdate || null,
  avatar: user.avatar ? `${API_PATH}/${user.avatar}` : null,
  pictures: user.pictures ? user.pictures.map(p => ({
    raw: `${API_PATH}/${p.raw}`,
    cropped: `${API_PATH}/${p.cropped}`,
  })) : [],
  age: user.age || null,
  city: user.city || null,
  gender: user.gender || null,
  orientation: user.orientation || null,
  punchline: user.punchline || null,
})

const profileStore = {
  namespaced: true,

  state: {
    user: getDefaultState(),
    loading: {},
  },

  mutations: {
    LOADING: (state, section) => {
      state.loading[section] = true
    },
    SETVALUE: (state, { section, values }) => {
      state.user = {
        ...state.user,
        ...graphqlToObject(values),
      }
      delete state.loading[section]
    },
    ASSIGN: (state, user) => {
      Object.assign(state.user, getDefaultState(graphqlToObject(user)))
    },
  },

  actions: {
    assign({ commit }, user) {
      commit('ASSIGN', user)
    },

    async updateSection({ state, commit }, { section, values }) {
      commit('LOADING', section)
      const { data } = await Apollo.client.mutate({
        mutation: sections[section],
        variables: {
          user: { ...values, id: state.user.id },
        },
      })
      commit('SETVALUE', { section, values: data.updateUser })
    },
  },
}

export default profileStore
