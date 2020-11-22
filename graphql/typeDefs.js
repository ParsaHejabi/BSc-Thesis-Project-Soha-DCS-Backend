const { gql } = require('apollo-server')

module.exports = gql`
  scalar Date

  enum RequestPlace {
    WEBSITE
    TWITTER
  }

  enum RequestType {
    QUESTION
    INSULT
    REQUEST
  }

  type User {
    id: ID!
    username: String!
    requests: [ID]!
    points: Int
    createdAt: Date!
    updatedAt: Date!
  }

  type UserRequest {
    id: ID!
    user: User!
    text: String!
    type: RequestType
    possibleReference: String
    place: RequestPlace!
    createdAt: Date!
    updatedAt: Date!
  }

  input UserRequestInput {
    username: String!
    text: String!
    type: RequestType
    possibleReference: String
    place: RequestPlace!
  }

  type Query {
    users: [User]!
    topUsers: [User]!
    userRequests: [UserRequest]!
  }

  type Mutation {
    addUserRequest(userRequestInput: UserRequestInput): UserRequest!
  }

  type Subscription {
    newUserRequest: UserRequest!
    newTopUsers: [User]!
  }
`
