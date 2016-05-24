var mongoose = require('mongoose')

var User = mongoose.Schema({
  token: String,
  username: String,
  password: { type: String, select: false },
  name: String,
  thumbnail: String
})

module.exports = User
