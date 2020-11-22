const User = require('../../models/User')

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
}
