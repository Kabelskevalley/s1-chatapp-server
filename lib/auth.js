var _ = require('lodash')
var bcrypt = require('bcrypt')
var mongoose = require('mongoose')
var User = mongoose.model('users', require('../schemas/user'))

const saltRounds = 10

module.exports = {
  register: function (username, password, name, thumbnail, callback) {
    var self = this
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) {
        console.log(err)
        callback(false, null)
        return
      }

      User.create({
        username: username,
        password: hash,
        name: name,
        thumbnail: thumbnail
      }, function (err, user) {
        if (!user) {
          callback(false, null)
          return
        }

        self.__authorize(user, function (err, user) {
          if (err) {
            console.log(err)
            callback(false, null)
            return
          }

          callback(true, user)
        })
      })
    })
  },

  login: function (username, password, callback) {
    var self = this
    User.findOne({ username: username })
      .select('+password')
      .exec(function (err, user) {
        if (!user) {
          callback(false, null)
          return
        }

        bcrypt.compare(password, user.password, function (err, res) {
          if (res) { // user auth success
            self.__authorize(user, function (err, user) {
              if (err) {
                callback(false, null)
                return
              }

              callback(true, user)
            })
          } else { // password missmatch
            callback(false, null)
          }
        })
      })
  },

  authorize: function (token, callback) {
    if (!token) { // null tokens not accepted
      callback(false, null)
    }

    User.findOne({ token: token }, function (err, user) {
      if (!user) {
        callback(false, null)
        return
      }
      callback(true, _.omit(user, ['token', 'password']))
    })
  },

  __authorize: function (user, callback) {
    user.token = this.__makeToken()
    user.save(function (err) {
      callback(err, user)
    })
  },

  __makeToken: function () {
    var text = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < 16; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return text
  }
}
