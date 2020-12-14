const { ApolloServer, PubSub } = require('apollo-server')
const mongoose = require('mongoose')
require('dotenv').config()
const checkAuth = require('./util/check-auth')
const { onlines } = require('./graphql/resolvers/chat/chats')
const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers/index')

const pubsub = new PubSub()

const server = new ApolloServer({
  typeDefs,
  resolvers,
  subscriptions: {
    onConnect: async (connectionParams, webSocket, context) => {
      try {
        const user = checkAuth(connectionParams.authToken)

        for (var i = 0; i < onlines.length; i++) {
          if (onlines[i] === user.username) {
            onlines.splice(i, 1)
          }
        }
        onlines.push(user.username)
        webSocket['chatUsername'] = user.username

        pubsub.publish('Online_Users_Channel', { onlineUsers: onlines })
      } catch (e) {
        console.log('onConnect Error')
      }
    },
    onDisconnect: async (webSocket, context) => {
      const username = webSocket['chatUsername']

      for (var i = 0; i < onlines.length; i++) {
        if (onlines[i] === username) {
          onlines.splice(i, 1)
        }
      }
      pubsub.publish('Online_Users_Channel', { onlineUsers: onlines })
    },
  },
  context: ({ req }) => ({ req, pubsub }),
})

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('Connected to MongoDB')
    return server.listen()
  })
  .then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`)
  })
