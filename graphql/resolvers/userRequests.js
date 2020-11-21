const { UserRequest } = require('../../models/UserRequest')

module.exports = {
  Query: {
    userRequests: async () => {
      try {
        const userRequests = await UserRequest.find()
        return userRequests
      } catch (error) {
        throw new Error(error)
      }
    },
  },
}
