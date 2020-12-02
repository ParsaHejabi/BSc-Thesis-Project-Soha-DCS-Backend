const { AuthenticationError } = require('apollo-server')

const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = (context) => {
  const authHeader = context.req.headers.authorization

  if (authHeader) {
    const token = authHeader.split('Bearer ')[1]
    if (token) {
      try {
        const user = jwt.verify(token, process.env.SECRET_KEY)
        return user
      } catch (err) {
        throw new AuthenticationError('Invalid Or Expired Token')
      }
    }
    throw new Error('Authentication Token Must Be: Bearer [token]')
  }

  throw new Error('Authorization Header Must Be Provided')
}
