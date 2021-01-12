const { UserInputError } = require('apollo-server')

const User = require('../../models/User')
const { UserRequest } = require('../../models/UserRequest')
const { validateRequestInput } = require('../../util/validators')
const checkAuth = require('../../util/check-auth')

const arraysEqual = require('../../util/arrayEquality')

module.exports = {
  Query: {
    userRequests: async () => {
      try {
        let userRequests = await UserRequest.find().sort({ createdAt: -1 })
        return userRequests
      } catch (error) {
        throw new Error(error)
      }
    },
    userRequest: async (parent, { username }, context, info) => {
      try {
        const user = await User.findOne({ username })

        if (user) {
          const userRequest = await UserRequest.find({ user: user._id }).sort({
            createdAt: -1,
          })
          if (userRequest) {
            return userRequest
          } else {
            throw new Error('User Request Not Found')
          }
        } else {
          throw new Error('User Not Found')
        }
      } catch (e) {
        throw new Error(e)
      }
    },
    unapprovedUserRequests: async () => {
      try {
        let userRequests = await UserRequest.find({ approved: false }).sort({
          createdAt: 1,
        })
        return userRequests
      } catch (error) {
        throw new Error(error)
      }
    },
    allUserRequests: async () => {
      try {
        let userRequests = await UserRequest.find().sort({
          createdAt: 1,
        })
        return userRequests
      } catch (error) {
        throw new Error(error)
      }
    },
    userRequestWithId: async (parent, { id }, context, info) => {
      try {
        const userRequest = await UserRequest.findById(id, (err, res) => {
          if (err) {
            throw new Error('User Request Not Found')
          }

          if (res) {
            return res
          }
        })

        return userRequest
      } catch (e) {
        throw new Error(e)
      }
    },
    userRequestsCount: async () => {
      try {
        const userRequestsCount = await UserRequest.countDocuments(
          { type: 'REQUEST', approved: true },
          (err, count) => {
            if (err) {
              throw new Error('Error getting requests count')
            }

            if (count) {
              return count
            }
          }
        )

        return userRequestsCount
      } catch (error) {
        throw new Error(error)
      }
    },
    userQuestionsCount: async () => {
      try {
        const userQuestionsCount = await UserRequest.countDocuments(
          { type: 'QUESTION', approved: true },
          (err, count) => {
            if (err) {
              throw new Error('Error getting questions count')
            }

            if (count) {
              return count
            }
          }
        )

        return userQuestionsCount
      } catch (error) {
        throw new Error(error)
      }
    },
    userOpinionsCount: async () => {
      try {
        const userOpinionsCount = await UserRequest.countDocuments(
          { type: 'OPINION', approved: true },
          (err, count) => {
            if (err) {
              throw new Error('Error getting opinions count')
            }

            if (count) {
              return count
            }
          }
        )

        return userOpinionsCount
      } catch (error) {
        throw new Error(error)
      }
    },
    userOtherRequestsCount: async () => {
      try {
        const userOpinionsCount = await UserRequest.countDocuments(
          { type: 'OTHER', approved: true },
          (err, count) => {
            if (err) {
              throw new Error('Error getting opinions count')
            }

            if (count) {
              return count
            }
          }
        )

        return userOpinionsCount
      } catch (error) {
        throw new Error(error)
      }
    },
    userRequestsUnapprovedCount: async () => {
      try {
        const userRequestsCount = await UserRequest.countDocuments(
          { type: 'REQUEST' },
          (err, count) => {
            if (err) {
              throw new Error('Error getting requests count')
            }

            if (count) {
              return count
            }
          }
        )

        return userRequestsCount
      } catch (error) {
        throw new Error(error)
      }
    },
    userQuestionsUnapprovedCount: async () => {
      try {
        const userQuestionsCount = await UserRequest.countDocuments(
          { type: 'QUESTION' },
          (err, count) => {
            if (err) {
              throw new Error('Error getting questions count')
            }

            if (count) {
              return count
            }
          }
        )

        return userQuestionsCount
      } catch (error) {
        throw new Error(error)
      }
    },
    userOpinionsUnapprovedCount: async () => {
      try {
        const userOpinionsCount = await UserRequest.countDocuments(
          { type: 'OPINION' },
          (err, count) => {
            if (err) {
              throw new Error('Error getting opinions count')
            }

            if (count) {
              return count
            }
          }
        )

        return userOpinionsCount
      } catch (error) {
        throw new Error(error)
      }
    },
    userOtherRequestsUnapprovedCount: async () => {
      try {
        const userOpinionsCount = await UserRequest.countDocuments(
          { type: 'OTHER' },
          (err, count) => {
            if (err) {
              throw new Error('Error getting opinions count')
            }

            if (count) {
              return count
            }
          }
        )

        return userOpinionsCount
      } catch (error) {
        throw new Error(error)
      }
    },
  },
  Mutation: {
    addUserRequest: async (
      parent,
      {
        userRequestInput: { text, type, possibleReference, properties, place },
      },
      context,
      info
    ) => {
      const user = checkAuth(context)

      const { errors, valid } = validateRequestInput(text)

      if (!valid) {
        throw new UserInputError('Validation Error', {
          errors: {
            errors,
          },
        })
      }

      let optionalFieldsFilledCount = 0

      optionalFieldsFilledCount = type
        ? optionalFieldsFilledCount + 1
        : optionalFieldsFilledCount
      optionalFieldsFilledCount =
        possibleReference !== ''
          ? optionalFieldsFilledCount + 1
          : optionalFieldsFilledCount
      optionalFieldsFilledCount =
        Array.isArray(properties) && properties.length
          ? optionalFieldsFilledCount + 1
          : optionalFieldsFilledCount

      let textSizePoint = 0

      if (text.length >= 50) {
        textSizePoint += 5
      } else {
        textSizePoint += Math.floor(text.length / 10)
      }

      const newUserRequest = new UserRequest({
        user: user.id,
        text: text,
        type: type,
        possibleReference: possibleReference,
        properties: properties,
        possiblePoints: optionalFieldsFilledCount * 2 + textSizePoint * 2,
        place: place,
      })

      const res = await newUserRequest.save()

      User.findById(user.id, async (err, user) => {
        if (err) {
          throw new Error(err)
        } else {
          user.requests.push(res)

          // if (place === 'WEBSITE') {
          //   user.points = user.points + 5
          // } else {
          //   user.points = user.points + 2
          // }

          await user.save()

          context.pubsub.publish('NEW_USER_REQUEST', {
            newUserRequest: newUserRequest,
          })
          context.pubsub.publish('NEW_TOP_USERS', {
            newTopUsers: await User.find()
              .sort({ points: -1, updatedAt: 1 })
              .limit(10),
          })
        }
      })
      return newUserRequest
    },
    updateUserRequest: async (
      parent,
      {
        adminUserRequestInput: {
          id,
          text,
          type,
          possibleReference,
          properties,
          points,
          approved,
        },
      },
      context,
      info
    ) => {
      const user = checkAuth(context)

      const { errors, valid } = validateRequestInput(text)

      if (!valid) {
        throw new UserInputError('Validation Error', {
          errors: {
            errors,
          },
        })
      }

      let userRequest = await UserRequest.findById(
        id,
        async (err, userRequest) => {
          if (err) {
            throw new Error(err)
          } else {
            return userRequest
          }
        }
      )

      if (points) {
        userRequest.text = text
        userRequest.type = type
        userRequest.possibleReference = possibleReference
        userRequest.properties = properties
        userRequest.points = points
        userRequest.approved = approved

        userRequest = await userRequest.save()

        if (userRequest && userRequest.approved) {
          User.findById(userRequest.user, async (err, user) => {
            if (err) {
              throw new Error(err)
            } else {
              user.points += points
              await user.save()
            }
          })
        }
      } else {
        let possiblePoints = userRequest.possiblePoints
        if (userRequest.text !== text) {
          possiblePoints -= 1
        }
        if (userRequest.type !== type) {
          possiblePoints -= 1
        }
        if (userRequest.possibleReference !== possibleReference) {
          possiblePoints -= 1
        }
        if (!arraysEqual(userRequest.properties, properties)) {
          possiblePoints -= 1
        }

        userRequest.text = text
        userRequest.type = type
        userRequest.possibleReference = possibleReference
        userRequest.properties = properties
        userRequest.points = possiblePoints
        userRequest.approved = approved

        userRequest = await userRequest.save()

        if (userRequest && userRequest.approved) {
          User.findById(userRequest.user, async (err, user) => {
            if (err) {
              throw new Error(err)
            } else {
              user.points += possiblePoints
              await user.save()
            }
          })
        }
      }

      return userRequest
    },
  },
  Subscription: {
    newUserRequest: {
      subscribe: (parent, args, { pubsub }, info) => {
        return pubsub.asyncIterator('NEW_USER_REQUEST')
      },
    },
  },
}
