import Tags from '../entities/TagEntity'

const Query = {
  tags: (root, args = {}) => Tags.getValues(args),
}

export default {
  Query,
}
