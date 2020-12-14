const { ApolloServer, PubSub } = require('apollo-server')
const mongoose = require('mongoose')
require('dotenv').config()

const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers/index')

const PORT = process.env.PORT || 5000

const pubsub = new PubSub()

const server = new ApolloServer({
  typeDefs,
  resolvers,
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
    return server.listen({
      port: PORT,
    })
  })
  .then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`)
  })
  .catch((err) => {
    console.log(err)
  })
