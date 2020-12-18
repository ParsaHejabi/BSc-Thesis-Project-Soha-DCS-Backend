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
  }

  type UserRequest {
    id: ID!
    user: ID!
    text: String!
    type: RequestType
    possibleReference: String
    properties: [RequestProperty]
    place: RequestPlace!
    possiblePoints: Int
    points: Int
    approved: Boolean
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

  input adminUserRequestInput {
    id: ID!
    text: String!
    type: RequestType
    possibleReference: String
    properties: [RequestProperty]
    points: Int
    approved: Boolean
  }

  type Query {
    users: [User]!
    topUsers: [User]!
    userRequests: [UserRequest]!
    userRequest(username: String!): [UserRequest]!
    userRequestWithId(id: ID!): UserRequest
    unapprovedUserRequests: [UserRequest]!
    user(id: ID!): User
    userByUsername(username: String!): User
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(loginInput: LoginInput): User!
    addUserRequest(userRequestInput: UserRequestInput): UserRequest!
    updateUserRequest(
      adminUserRequestInput: adminUserRequestInput
    ): UserRequest!
  }

  type Subscription {
    newUserRequest: UserRequest!
    newTopUsers: [User]!
  }
`
