const { gql } = require('apollo-server')

module.exports = gql`
  scalar Date
  scalar Void
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
    chatPoints: Int
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
    receiver: String!
    content: String!
  }
  type Query {
    users: [User]!
    topUsers: [User]!
    userRequests: [UserRequest]!
    userRequest(username: String!): [UserRequest]

    onlineUsersInit: [String]
    messages: [Message!]
    allChatPoints: Int
    topChatUsers: [User]!
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(loginInput: LoginInput): User!
    addUserRequest(userRequestInput: UserRequestInput): UserRequest!

    chatRequestAnswer(user: String!, receiver: String!): Void
    chatRequest(user: String!, receiver: String!): Void
    postMessage(user: String!, receiver: String!, content: String!): ID!
    exitChat: Void
  }

  type Subscription {
    newUserRequest: UserRequest!
    newTopUsers: [User]!
    newMessage(receiver: String!): Message
    messages(receiver: String!, other: String!): [Message!]
    chatRequestSub(receiver: String!): String
    chatRequestAnswerSub(receiver: String!): String
    onlineUsers: [String]
  }
`
// , sender: String!
