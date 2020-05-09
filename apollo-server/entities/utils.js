import graphqlFields from 'graphql-fields'
import Tag from './TagEntity'

// Get keys that the user requested, so we can avoid useless computations
export const getRequestedFields = info => (info ? Object.keys(graphqlFields(info)) : null)

// Remove keys that we want to hide in response to client (example: password)
export const deleteForbiddenKeys = (value, forbidden) => {
  const newValue = JSON.parse(JSON.stringify(value))
  forbidden.forEach(key => {
    if (key.includes(':')) {
      const keys = key.split(':')
      keys.reduce((acc, k, i) => {
        const res = acc[k]
        if (i === keys.length - 1) {
          delete acc[k]
        }
        return res
      }, newValue)
    }
  })
  return newValue
}

// Handlers list in case updates need async calculations
export const asyncUpdate = {
  tags: async (newValue, oldValue) => {
    if (!oldValue || oldValue.map(tag => tag.label) !== newValue) {
      try {
        const newTags = await Promise.all(newValue.map(async label => {
          const tag = await Tag.getOne({ label })
          return tag.value
        }))
        return newTags
      } catch (error) {
        console.error(error)
        return null
      }
    }
    return oldValue
  },
}
