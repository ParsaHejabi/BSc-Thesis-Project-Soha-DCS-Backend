const { Schema, model } = require('mongoose')
const { UserRequestSchema } = require('./UserRequest')

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    requests: {
      type: [{ type: Schema.Types.ObjectId, ref: 'UserRequest' }],
      required: true,
      default: [],
    },
    points: {
      type: Number,
      required: true,
      default: 0,
    },
    chats: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

module.exports = model('User', userSchema)
