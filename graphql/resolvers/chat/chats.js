const { PubSub, withFilter } = require('apollo-server')
const checkAuth = require('../../../util/check-auth')
const messages = []

const subscribers = []
const onMessagesUpdates = (fn) => subscribers.push(fn)
const chatResolvers = {
  Query: {
    messages: () => messages,
  },
  Mutation: {
    postMessage: async (parent, { user, content }, context) => {
      console.log('AAAAAAAAAAAAAAAAAa')
      console.log(checkAuth(context))
      console.log('BBBBB')
      const id = messages.length
      messages.push({
        id,
        user,
        content,
      })
      subscribers.forEach((fn) => fn())
      return id
    },
  },
  Subscription: {
    messages: {
      subscribe: async (parent, args, { pubsub }) => {
        const channel = Math.random().toString(36).slice(2, 15)
        onMessagesUpdates(() => pubsub.publish(channel, { messages }))
        setTimeout(() => pubsub.publish(channel, { messages }), 0)
        return pubsub.asyncIterator(channel)
      },
    },
  },
}

module.exports = chatResolvers
