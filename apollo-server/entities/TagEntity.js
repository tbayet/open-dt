import { db } from '../utils/db'

class Tag {
  constructor(tag) {
    this.tag = tag
    this.tagValue = tag.value()
  }

  async update(values) {
    this.tag
      .assign(values)
      .write()
    this.tagValue = this.tag.value
  }

  get value() {
    return this.tagValue
  }
}

const getOne = async ({ label }) => {
  let tag = null
  if (label) {
    tag = await db.get('tags').find({ label })
  }
  if (tag) {
    return new Tag(tag)
  }
  return null
}

const getAll = async (params = {}) => {
  const tags = await db.get('tags').filter(params).value()
  return Promise.all(
    tags.map(async tagValue => {
      const tag = await db.get('tags').find(tagValue)
      return new Tag(tag)
    }),
  )
}

const getValues = async (params) => {
  const tags = await getAll(params)
  return tags.map(tag => tag.value)
}

const createOne = async ({
  label, color, icon,
}) => {
  await db.get('tags').push({
    label, color, icon,
  }).write()
  const tag = await getOne({ label })
  return tag
}

const updateOne = async ({ label }, values) => {
  if (label) {
    const tag = await getOne({ label })
    if (tag) {
      await tag.update(values)
    }
    return tag
  }
  return null
}

Tag.getOne = getOne
Tag.getAll = getAll
Tag.getValues = getValues
Tag.updateOne = updateOne
Tag.createOne = createOne

export default Tag
