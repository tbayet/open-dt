import { Apollo } from '../vue-apollo'
import { graphqlToObject } from '../utils/graphql'
import {
  SectionGender, SectionPictures, SectionName, SectionPunchline, SectionTags, addPicture,
} from '../graphql/Profile.gql'

const sections = {
  sectionGender: SectionGender,
  sectionPictures: SectionPictures,
  sectionName: SectionName,
  sectionPunchline: SectionPunchline,
  sectionTags: SectionTags,
}

const getDefaultState = (user = {}) => ({
  id: user.id || null,
  username: user.username || null,
  birthdate: user.birthdate || null,
  avatar: user.avatar || {},
  pictures: user.pictures || [],
  tags: user.tags || [],
  age: user.age || null,
  city: user.city || {},
  gender: user.gender || [],
  orientation: user.orientation || [],
  punchline: user.punchline || null,
})

const profileStore = {
  namespaced: true,

  state: {
    user: getDefaultState(),
    loading: Object.keys(sections).reduce((acc, section) => ({ ...acc, [section]: false }), {}),
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
      state.loading[section] = false
    },
    ASSIGN: (state, user) => {
      Object.assign(state.user, getDefaultState(graphqlToObject(user)))
    },
  },

  actions: {
    assign({ commit }, user) {
      commit('ASSIGN', user)
    },

    async addPicture({ state, commit }, newPicture) {
      const { data } = await Apollo.client.mutate({
        mutation: addPicture,
        variables: {
          userID: state.user.id,
          newPicture,
        },
      })
      commit('SETVALUE', { values: { pictures: data.addPicture } })
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
