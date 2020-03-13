import jwt from 'jsonwebtoken'
import shortid from 'shortid'
import bcrypt from 'bcrypt'
import { db } from '../utils/db'
import configuration from '../configuration'

class User {
  constructor(user) {
    this.user = user
    this.userValue = user.value()
  }

  async update(values) {
    this.user
      .assign(values)
      .write()
    this.userValue = this.user.value()
  }

  async verifyPassword(password) {
    try {
      await bcrypt.compare(password, this.userValue.password)
      return true
    } catch (err) {
      return false
    }
  }

  generateToken() {
    const {
      id, role, username, avatar,
    } = this.accountValue

    const token = jwt.sign({
      id, role, username, avatar,
    }, configuration.JWT_SECRET)

    return token
  }

  get value() {
    const value = { ...this.userValue }
    delete value.id
    delete value.password
    delete value.email
    delete value.role
    delete value.city.lat
    delete value.city.long
    delete value.interestedBy
    return value
  }

  get accountValue() {
    const accountValue = { ...this.userValue }
    delete accountValue.password
    accountValue.avatar = this.avatar
    return accountValue
  }

  get avatar() {
    return this.userValue.pictures ? this.userValue.pictures[0].cropped : null
  }

  get role() {
    return this.userValue.role
  }

  get email() {
    return this.userValue.email
  }

  get username() {
    return this.userValue.username
  }

  get birthdate() {
    return this.userValue.username
  }

  get id() {
    return this.userValue.id
  }
}

const getOne = async ({ id, email }) => {
  let user = null
  if (id) {
    user = await db.get('users').find({ id })
  } else if (email) {
    user = await db.get('users').find({ email })
  }
  if (user) {
    return new User(user)
  }
  return null
}

const get = async (params) => {
  const users = await db.get('users').filter(params).value()
  return Promise.all(
    users.map(async userValue => {
      const user = await db.get('users').find(userValue)
      return new User(user)
    }),
  )
}

const getValues = async (params) => {
  const users = await get(params)
  return users.map(user => new User(user).value)
}

const createOne = async ({
  password,
  username, city, email, birthdate, role,
}) => {
  const encryptedPassword = await bcrypt.hash(password, 10)
  const id = shortid.generate()
  await db.get('users').push({
    id,
    password: encryptedPassword,
    username,
    city,
    email,
    birthdate,
    role,
  }).write()
  const user = await getOne({ id })
  return user
}

const updateOne = async (selector, values) => {
  const user = await getOne(selector)
  await user.update(values)
  return user
}

User.getOne = getOne
User.get = get
User.getValues = getValues
User.updateOne = updateOne
User.createOne = createOne

export default User
