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
    website: {
      type: Boolean,
      required: true,
    },
    requests: {
      type: [UserRequestSchema],
      required: true,
    },
    points: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = model('User', userSchema)
