import jwt from 'jsonwebtoken'
import shortid from 'shortid'
import moment from 'moment'
import bcrypt from 'bcrypt'
import { db } from '../utils/db'
import configuration from '../configuration'
import { getRequestedFields, deleteForbiddenKeys, asyncUpdate } from './utils'

const ASYNC_CALCULATED_KEYS = ['tags']
const COMPUTED_KEYS = ['avatar', 'age']

class User {
  constructor(user, requestedKeys) {
    this.user = user
    this.userValue = user.value()
    this.rebuild = (keys => () => keys.forEach(key => {
      if (COMPUTED_KEYS.includes(key)) {
        this.userValue[key] = this[key]
      }
    }))(requestedKeys || [])
    this.rebuild()
  }

  async update(values) {
    // Check if some values needs an asynchronous calculation and request for it
    const fullValues = await Object.keys(values).reduce(async (acc, key) => {
      const newValue = ASYNC_CALCULATED_KEYS.includes(key)
        ? await asyncUpdate[key](values[key], this.userValue[key])
        : values[key]
      return {
        ...acc,
        [key]: newValue,
      }
    }, {})

    // Assign values
    await this.user
      .assign(fullValues)
      .write()
    this.userValue = {
      ...this.userValue,
      ...this.user.value(),
    }
    this.rebuild()
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
    const forbidden = ['password', 'email', 'role', 'city:lat', 'city:long', 'interestedBy']
    return deleteForbiddenKeys(this.userValue, forbidden)
  }

  get accountValue() {
    const forbidden = ['password']
    return deleteForbiddenKeys(this.userValue, forbidden)
  }

  get pictures() {
    return this.userValue.pictures || null
  }

  get avatar() {
    return this.userValue.pictures ? this.userValue.pictures[0].cropped : null
  }

  get age() {
    return moment().diff(moment(this.userValue.birthdate), 'years')
  }

  get role() {
    return this.userValue.role
  }

  get id() {
    return this.userValue.id
  }
}

const getOne = async ({ id, email }, info) => {
  let user = null
  if (id) {
    user = await db.get('users').find({ id })
  } else if (email) {
    user = await db.get('users').find({ email })
  }
  if (user) {
    return new User(user, getRequestedFields(info))
  }
  return null
}

const getAll = async (params, info) => {
  const users = await db.get('users').filter(params).value()
  return Promise.all(
    users.map(async userValue => {
      const user = await db.get('users').find(userValue)
      return new User(user, getRequestedFields(info))
    }),
  )
}


const getValues = async (params, info) => {
  const users = await getAll(params)
  return users.map(user => new User(user, getRequestedFields(info)).value)
}

const createOne = async ({
  password,
  username, city, email, birthdate, role,
}, info) => {
  const encryptedPassword = await bcrypt.hash(password, 10)
  const id = shortid.generate()
  const defaultUser = {
    punchline: "I'm new here ! Let's talk together :)",
  }
  const cityObject = await db.get('cities').find(city).value()
  if (!cityObject) throw Error

  await db.get('users').push({
    ...defaultUser,
    id,
    password: encryptedPassword,
    username,
    city: cityObject,
    email,
    birthdate,
    role,
  }).write()
  const user = await getOne({ id }, info)
  return user
}

const updateOne = async (selector, values, info) => {
  const user = await getOne(selector, info)
  await user.update(values)
  return user
}

User.getOne = getOne
User.getAll = getAll
User.getValues = getValues
User.updateOne = updateOne
User.createOne = createOne

export default User
