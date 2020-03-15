export const graphqlToObject = graphql => {
  if (!graphql) return null
  const parse = elem => Object.keys(elem)
    .reduce((acc, key) => ({
      ...acc,
      ...(key.startsWith('__') ? null : {
        [key]: !Array.isArray(elem[key]) && typeof elem[key] === 'object' ? parse(elem[key]) : elem[key],
      }),
    }), {})
  return parse(graphql)
}
