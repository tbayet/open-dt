import {
  AuthenticationError,
  UserInputError,
} from 'apollo-server-express'
import moment from 'moment'
import User from '../entities/UserEntity'
import { processPictureUpload } from '../utils/upload'

const validateInputs = (alreadyExists, birthdate, username, email, password, passwordConfirm) => {
  let errorMessage = null
  if (alreadyExists) {
    errorMessage = 'A user with this email already exists'
  } else if (moment().diff(moment(birthdate), 'years') < 18) {
    errorMessage = 'You must have 18+ years old'
  } else if (username.length < 3) {
    errorMessage = 'Username is invalid'
  } else if (!(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})').test(password))) {
    errorMessage = 'Password is invalid'
  } else if (password !== passwordConfirm) {
    errorMessage = 'Passwords dismatches'
  } else if (!(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))) {
    errorMessage = 'Email is invalid'
  }
  if (errorMessage) {
    throw new UserInputError(errorMessage)
  }
}

const Query = {
  user: async (_, { id }, { userAccount }, info) => {
    if (!userAccount) throw AuthenticationError
    const user = await User.getOne({ id }, info)
    if (!user) throw AuthenticationError
    return user.value
  },

  account: async (_, args, { userAccount }, info) => {
    if (Object.keys(args).every(key => key in userAccount)) {
      return userAccount
    }
    const user = await User.getOne({ id: userAccount.id }, info)
    return user.accountValue
  },
}

const Mutation = {
  async updateUser(_, params, { userAccount }, info) {
    const newUser = { ...params.user }
    let user = null
    if (userAccount.role === 'ADMIN') {
      user = await User.getOne({ id: newUser.id }, info)
    } else {
      user = await User.getOne({ id: userAccount.id }, info)
    }
    await user.update(newUser)
    return user.value
  },

  async addPicture(_, params, { userAccount }, info) {
    const { userID, newPicture } = params
    let user = null
    if (userAccount.role === 'ADMIN') {
      user = await User.getOne({ id: userID }, info)
    } else {
      user = await User.getOne({ id: userAccount.id }, info)
    }
    const raw = await processPictureUpload(newPicture.raw)
    const cropped = await processPictureUpload(newPicture.cropped)
    await user.update({
      pictures: [
        {
          raw,
          cropped,
        },
        ...user.pictures,
      ],
    })
    return user.pictures
  },

  async signUpFillProfile(_, {
    picture, gender, orientation, interestedBy,
  }, { userAccount }) {
    if (!userAccount) throw Error()
    try {
      const raw = await processPictureUpload(picture.raw)
      const cropped = await processPictureUpload(picture.cropped)
      const user = await User.getOne(userAccount)
      await user.update({
        role: 'USER',
        pictures: [
          {
            raw,
            cropped,
          },
        ],
        gender,
        orientation,
        interestedBy,
      })
      return user.generateToken()
    } catch (err) {
      throw new AuthenticationError('Wrong identifiers')
    }
  },

  async signUp(_, {
    birthdate, city, username, email, password, passwordConfirm,
  }) {
    try {
      const alreadyExists = await User.getOne({ email }).value
      validateInputs(alreadyExists, birthdate, username, email, password, passwordConfirm)
      const user = await User.createOne({
        password,
        birthdate,
        city,
        username,
        email,
        role: 'STEP2', // skipping STEP1: email confirmation with token
      })
      const token = user.generateToken()
      return token
    } catch (error) {
      throw new AuthenticationError('Wrong identifiers')
    }
  },

  async signIn(root, { email, password }) {
    try {
      const user = await User.getOne({ email })
      if (user && await user.verifyPassword(password)) {
        const token = user.generateToken()
        return token
      }
      throw Error
    } catch (error) {
      throw new AuthenticationError('Wrong identifiers')
    }
  },
}

export default {
  Query,
  Mutation,
}
