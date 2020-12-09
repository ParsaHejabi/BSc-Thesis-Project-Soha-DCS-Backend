const { PubSub, withFilter } = require('apollo-server')
const checkAuth = require('../../../util/check-auth')

const messages = {}
const subscribers = {}

const onMessagesUpdates = (receiver, fn) => (subscribers[receiver] = fn)
const chatResolvers = {
  Query: {
    messages: () => messages,
  },
  Mutation: {
    postMessage: async (parent, { user, receiver, content }, context) => {
      checkAuth(context)
      console.log(user + ' is sending e message to ' + receiver)
      if (!messages[receiver] || !messages[user] || user === receiver) {
        throw new Error("User isn't available! " + user + ' ' + receiver)
      }
      const id = 123
      const message = {
        id,
        user,
        receiver,
        content,
      }
      messages[receiver].push(message)
      messages[user].push(message)
      subscribers[receiver]()
      subscribers[user]()
      return id
    },
  },
  Subscription: {
    messages: {
      subscribe: async (parent, args, { pubsub }) => {
        console.log(args.receiver + ' Joined')
        messages[args.receiver] = []
        const channel = args.receiver
        onMessagesUpdates(args.receiver, () =>
          pubsub.publish(channel, { messages: messages[args.receiver] })
        )
        setTimeout(
          () => pubsub.publish(channel, { messages: messages[args.receiver] }),
          0
        )
        return pubsub.asyncIterator(channel)
      },
    },
  },
}

module.exports = chatResolvers
