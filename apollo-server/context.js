import jwt from 'jsonwebtoken'
import { processUpload } from './utils/upload'
import config from './configuration'


// Context passed to all resolvers (third argument)
// req => Query
// connection => Subscription

export default async ({ req, connection }) => {
  // Emulating loading to test front-end loading states
  await new Promise(resolve => setTimeout(resolve, 1000)) // @todo: remove in production

  // Verify requesting user authorizations
  if (connection && connection.context) return connection.context
  let token = null
  if (req) {
    token = req.get('Authorization')
  }
  if (connection) {
    token = connection.authorization
  }
  const userAccount = token ? await jwt.verify(token.split(' ')[1], config.JWT_SECRET) : null

  return {
    config,
    userAccount,
    processUpload,
  }
}
