const { UserInputError } = require('apollo-server')

const User = require('../../models/User')
const { UserRequest } = require('../../models/UserRequest')
const { validateRequestInput } = require('../../util/validators')

module.exports = {
  Query: {
    userRequests: async () => {
      try {
        let userRequests = await UserRequest.find().sort({ createdAt: -1 })
        let newUserRequests = userRequests.map(async (value) => {
          value.user = await User.findById(value.user)
          return value
        })

        return newUserRequests
      } catch (error) {
        throw new Error(error)
      }
    },
  },
  Mutation: {
    addUserRequest: async (
      parent,
      { userRequestInput: { username, text, type, possibleReference, place } },
      context,
      info
    ) => {
      const { errors, valid } = validateRequestInput(username, text)

      if (!valid) {
        throw new UserInputError('Validation Error', {
          errors: {
            errors,
          },
        })
      }

      const user = await User.findOne({ username: username })

      if (user) {
        const newUserRequest = new UserRequest({
          user: user._id,
          text: text,
          type: type,
          possibleReference: possibleReference,
          place: place,
        })

        const res = await newUserRequest.save()

        user.requests.push(res)

        if (place === 'WEBSITE') {
          user.points = user.points + 5
        } else {
          user.points = user.points + 2
        }
        await user.save()

        newUserRequest.user = await User.findById(newUserRequest.user)
        context.pubsub.publish('NEW_REQUEST', {
          newUserRequest: newUserRequest,
        })
        context.pubsub.publish('NEW_TOP_USERS', {
          newTopUsers: await User.find()
            .sort({ points: -1, updatedAt: 1 })
            .limit(10),
        })
        return newUserRequest
      } else {
        const newUser = new User({ username })
        await newUser.save()

        let newUserRequest = new UserRequest({
          user: newUser._id,
          text: text,
          type: type,
          possibleReference: possibleReference,
          place: place,
        })

        const res = await newUserRequest.save()

        newUser.requests.push(res)
        if (place == 'WEBSITE') {
          newUser.points = newUser.points + 5
        } else {
          newUser.points = newUser.points + 2
        }
        await newUser.save()

        newUserRequest.user = await User.findById(newUserRequest.user)
        context.pubsub.publish('NEW_REQUEST', {
          newUserRequest: newUserRequest,
        })
        context.pubsub.publish('NEW_TOP_USERS', {
          newTopUsers: await User.find()
            .sort({ points: -1, updatedAt: 1 })
            .limit(10),
        })
        return newUserRequest
      }
    },
  },
  Subscription: {
    newUserRequest: {
      subscribe: (parent, args, { pubsub }, info) => {
        return pubsub.asyncIterator('NEW_REQUEST')
      },
    },
  },
}
