import GraphQLJSON from 'graphql-type-json'
import UsersResolvers from './resolvers/UsersResolver'
import CitiesResolver from './resolvers/CitiesResolver'
import TagsResolver from './resolvers/TagsResolver'

const ResolversImports = [
  UsersResolvers,
  CitiesResolver,
  TagsResolver,
]

const Resolvers = ResolversImports.reduce((res, resolver) => ({
  ...res,
  ...Object.keys(resolver).reduce((acc, key) => ({
    ...acc,
    [key]: {
      ...resolver[key],
      ...res[key],
    },
  }), {}),
}), {
  JSON: GraphQLJSON,
})

export default Resolvers
