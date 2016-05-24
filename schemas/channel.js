var mongoose = require('mongoose')

var Channel = mongoose.Schema({
  id: String,
  name: String,
  thumbnail: String
})

module.exports = Channel
