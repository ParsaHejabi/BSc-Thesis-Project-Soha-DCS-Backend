const userRequestResolvers = require('./userRequests')
const { Date } = require('./date')

module.exports = {
  Query: {
    ...userRequestResolvers.Query,
  },
  Mutation: {
    ...userRequestResolvers.Mutation,
  },
  Date: Date,
}
