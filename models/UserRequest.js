const { Schema, model } = require('mongoose')

const userRequestchema = new Schema(
  {
    // user: {
    //   type: 'ObjectId',
    //   required: true,
    //   ref: 'User',
    // },
    text: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['درخواست', 'سوال', 'توهین'],
    },
    possibleReference: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = {
  UserRequest: model('UserRequest', userRequestchema),
  userRequestSchema: userRequestchema,
}
