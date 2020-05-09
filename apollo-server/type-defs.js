import fs from 'fs'
import path from 'path'

export default [
  './schema.graphql',
  './schema/UserSchema.graphql',
  './schema/CitySchema.graphql',
  './schema/TagSchema.graphql',
  './schema/InterestedBySchema.graphql',
  './schema/PictureSchema.graphql',
].map(schemaURL => fs.readFileSync(path.resolve(__dirname, schemaURL), { encoding: 'utf8' }))
