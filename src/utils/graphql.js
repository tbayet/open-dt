// Clean the graphql response object, removing unwanted keys
export const graphqlToObject = graphql => {
  if (!graphql) return null
  const parse = elem => (
    (!elem || typeof elem !== 'object') // type('object') means Array[] or Object{}
      ? elem
      : Object.keys(elem)
        .reduce((acc, key) => ({
          ...acc,
          ...(key.startsWith('__') ? null : { // ...(null) <=> removing the key
            [key]: Array.isArray(elem[key]) // deep parsing recursively
              ? elem[key].map(arrayElem => parse(arrayElem))
              : parse(elem[key]),
          }),
        }), {})
  )
  return parse(graphql)
}
