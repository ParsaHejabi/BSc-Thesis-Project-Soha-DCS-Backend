const { UserInputError } = require('apollo-server')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const User = require('../../models/User')
const {
  validateRegisterInput,
  validateLoginInput,
} = require('../../util/validators')

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    process.env.SECRET_KEY,
    { expiresIn: '1h' }
  )
}

module.exports = {
  Query: {
    users: async () => {
      try {
        return await User.find().sort({ points: -1, updatedAt: 1 })
      } catch (error) {
        throw new Error(error)
      }
    },
  },
  Mutation: {
    register: async (
      parent,
      { registerInput: { username, password } },
      context,
      info
    ) => {
      const { errors, valid } = validateRegisterInput(username, password)

      if (!valid) {
        throw new UserInputError('Validation Error', {
          errors,
        })
      }

      const user = await User.findOne({ username })

      if (user) {
        throw new UserInputError('Validation Error', {
          errors: {
            username: 'این نام کاربری قبلا استفاده شده.',
          },
        })
      }

      password = await bcrypt.hash(password, 14)

      const newUser = new User({
        username,
        password,
      })

      const res = await newUser.save()

      const token = generateToken(res)

      return {
        ...res._doc,
        id: res._id,
        token,
      }
    },
    login: async (
      parent,
      { loginInput: { username, password } },
      context,
      info
    ) => {
      const { errors, valid } = validateLoginInput(username, password)

      if (!valid) {
        throw new UserInputError('Validation Error', {
          errors,
        })
      }

      const user = await User.findOne({ username })

      if (!user) {
        errors.general = 'نام کاربری یا گذرواژه اشتباه است.'
        throw new UserInputError('Wrong Credentials', {
          errors,
        })
      }

      const match = await bcrypt.compare(password, user.password)

      if (!match) {
        errors.general = 'نام کاربری یا گذرواژه اشتباه است.'
        throw new UserInputError('Wrong Credentials', {
          errors,
        })
      }

      const token = generateToken(user)

      return {
        ...user._doc,
        id: user._id,
        token,
      }
    },
  },
}
