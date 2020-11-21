const userRequestResolvers = require('./userRequests')

module.exports = {
  Query: {
    ...userRequestResolvers.Query,
  },
}
