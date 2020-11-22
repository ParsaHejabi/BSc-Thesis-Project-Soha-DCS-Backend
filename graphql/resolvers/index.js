const users = require('./users')
const topUsers = require('./topUsers')
const userRequestResolvers = require('./userRequests')
const { Date } = require('./date')

module.exports = {
  Query: {
    ...userRequestResolvers.Query,
    ...users.Query,
    ...topUsers.Query,
  },
  Mutation: {
    ...userRequestResolvers.Mutation,
  },
  Subscription: {
    ...userRequestResolvers.Subscription,
    ...topUsers.Subscription,
  },
  Date: Date,
}
