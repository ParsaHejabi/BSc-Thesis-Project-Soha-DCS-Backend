const { PubSub, withFilter } = require('apollo-server')
const checkAuth = require('../../../util/check-auth')
const User = require('../../../models/User')
const Message = require('../../../models/chat/Message')
const MessageList = require('../../../models/chat/MessageList')
const { on } = require('../../../models/User')

const messages = {}
const subscribers = {}
const requestSubs = {}
const onlines = []
const onMessagesUpdates = (receiver, fn) => (subscribers[receiver] = fn)
const onRequestUpdates = (receiver, fn) => (requestSubs[receiver] = fn)
const isChatValid = (text) => {
  return true
}
const chatResolvers = {
  Query: {
    topChatUsers: async () => {
      return await User.find().sort({ chatPoints: -1, updatedAt: 1 })
    },
    messages: async () => await Message.find(),
    onlineUsersInit: () => onlines,
    allChatPoints: async () => {
      const users = await User.find()
      let points = 0
      users.forEach((u) => {
        points += u.chatPoints
      })
      return points
    },
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
      if (isChatValid(content)) senderUser.chatPoints++
      receiverUser.save()
      senderUser.save()
      messages[receiver].push(message)
      messages[user].push(message)
      subscribers[receiver]()
      subscribers[user]()
      return message.id
    },
    chatRequest: async (parent, { user, receiver }, context) => {
      checkAuth(context)
      console.log(user + ' is sending e request to ' + receiver)
      if (!onlines.includes(receiver) || user === receiver) {
        throw new Error(
          "User isn't available! for request " + user + ' ' + receiver
        )
      }

      const receiverUser = await User.findOne({ username: receiver })
      const senderUser = await User.findOne({ username: user })

      requestSubs[receiver](user)
    },
  },
  Subscription: {
    onlineUsers: {
      subscribe: (parent, args, { pubsub }) => {
        return pubsub.asyncIterator('Online_Users_Channel')
      },
    },
    messages: {
      subscribe: async (parent, args, { pubsub }) => {
        const receiverUser = await User.findOne({
          username: args.receiver,
        }).populate('chats')
        messages[args.receiver] = receiverUser.chats.filter(
          (c) => c.user === args.other || c.receiver === args.other
        )

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
    chatRequestSub: {
      subscribe: async (parent, args, { pubsub }) => {
        const receiverUser = await User.findOne({
          username: args.receiver,
        })

        const channel = args.receiver + '@request'
        console.log('SUBBING ON + ' + channel)
        onRequestUpdates(args.receiver, (fromUser) =>
          pubsub.publish(channel, { chatRequestSub: fromUser })
        )
        setTimeout(() => pubsub.publish(channel, { chatRequestSub: '' }), 0)
        return pubsub.asyncIterator(channel)
      },
    },
  },
}

module.exports = { chatResolvers, onlines }
