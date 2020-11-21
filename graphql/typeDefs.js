const { gql } = require('apollo-server')

module.exports = gql`
  type User {
    id: ID!
    username: String!
    points: Int
  }

  type UserRequest {
    id: ID!
    user: User!
    text: String!
    type: String
    possibleReference: String
  }

  type Query {
    userRequests: [UserRequest]
  }
`
