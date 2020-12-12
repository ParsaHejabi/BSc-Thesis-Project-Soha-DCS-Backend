const { PubSub, withFilter } = require('apollo-server')
const checkAuth = require('../../../util/check-auth')
const User = require('../../../models/User')
const Message = require('../../../models/chat/Message')
const MessageList = require('../../../models/chat/MessageList')

const messages = {}
const subscribers = {}

const onMessagesUpdates = (receiver, fn) => (subscribers[receiver] = fn)
const chatResolvers = {
  Query: {
    messages: async () => await Message.find(),
  },
  Mutation: {
    postMessage: async (parent, { user, receiver, content }, context) => {
      checkAuth(context)
      console.log(user + ' is sending e message to ' + receiver)
      if (!messages[receiver] || !messages[user] || user === receiver) {
        throw new Error("User isn't available! " + user + ' ' + receiver)
      }
      const message = new Message({
        user,
        receiver,
        content,
      })
      console.log(JSON.stringify(await Message.findOne()))
      await message.save()
      const receiverUser = await User.findOne({ username: receiver })

      receiverUser.chats.push(message)
      const senderUser = await User.findOne({ username: user })
      senderUser.chats.push(message)

      receiverUser.save()
      senderUser.save()
      messages[receiver].push(message)
      messages[user].push(message)
      subscribers[receiver]()
      subscribers[user]()
      return message.id
    },
  },
  Subscription: {
    messages: {
      subscribe: async (parent, args, { pubsub }) => {
        const receiverUser = await User.findOne({
          username: args.receiver,
        }).populate('chats')
        console.log(
          args.receiver + ' Joined ' + JSON.stringify(receiverUser, null, 2)
        )
        messages[args.receiver] = receiverUser.chats.filter(
          (c) => c.user === args.other || c.receiver === args.other
        )
        console.log(' Chat ' + JSON.stringify(messages[args.receiver], null, 2))

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
