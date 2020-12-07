const { gql } = require('apollo-server')

module.exports = gql`
  scalar Date

  enum RequestPlace {
    WEBSITE
    TWITTER
  }

  enum RequestType {
    QUESTION
    REQUEST
    OPINION
    OTHER
  }

  enum RequestProperty {
    INSULT
    SARCASM
    HUMOR
  }

  type User {
    id: ID!
    username: String!
    token: String!
    requests: [ID]!
    points: Int
    createdAt: Date!
    updatedAt: Date!
    messages: [Message]
  }

  type UserRequest {
    id: ID!
    user: ID!
    text: String!
    type: RequestType
    possibleReference: String
    properties: [RequestProperty]
    place: RequestPlace!
    createdAt: Date!
    updatedAt: Date!
  }

  input RegisterInput {
    username: String!
    password: String!
  }

  input LoginInput {
    username: String!
    password: String!
  }

  input UserRequestInput {
    text: String!
    type: RequestType
    possibleReference: String
    properties: [RequestProperty]
    place: RequestPlace!
  }
  type Message {
    id: ID!
    user: String!
    content: String!
  }
  type Query {
    users: [User]!
    topUsers: [User]!
    userRequests: [UserRequest]!
    userRequest(username: String!): [UserRequest]

    messages: [Message!]
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(loginInput: LoginInput): User!
    addUserRequest(userRequestInput: UserRequestInput): UserRequest!

    postMessage(user: String!, content: String!): ID!
  }

  type Subscription {
    newUserRequest: UserRequest!
    newTopUsers: [User]!

    messages: [Message!]
  }
`
