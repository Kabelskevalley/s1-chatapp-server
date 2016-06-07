var auth = require('../lib/auth')
var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var Channel = mongoose.model('channels', require('../schemas/channel'))

router.get('/channels', function (req, res) {
  auth.authorize(req.query.token, function (success, user) {
    if (success) {
      Channel.find({}, function (err, channels) {
        if (err) console.log(err)
        res.send(channels)
      })
    } else {
      res.status(401).send({error: 'invalid token'})
    }
  })
})

router.post('/channels', function (req, res) {
  auth.authorize(req.query.token, function (success, user) {
    if (success) {
      Channel.create({id: req.body.id, name: req.body.name, thumbnail: req.body.thumbnail},
        function (err, channel) {
          if (err) console.log(err)
          res.send(channel)
        })
    } else {
      res.status(401).send({error: 'invalid token'})
    }
  })
})

router.delete('/channels/:id', function (req, res) {
  auth.authorize(req.query.token, function (success, user) {
    if (success) {
      Channel.find({id: req.params.id}).remove(
        function (err) {
          if (err) console.log(err)
          res.send({error: null})
        })
    } else {
      res.status(401).send({error: 'invalid token'})
    }
  })
})

router.post('/login', function (req, res) {
  auth.login(req.body.username, req.body.password,
    function (success, user) {
      if (success) {
        res.send({
          token: user.token,
          name: user.name,
          thumbnail: user.thumbnail
        })
      } else {
        res.status(401).send({error: 'invalid credentials'})
      }
    })
})

router.post('/register', function (req, res) {
  auth.register(req.body.username, req.body.password, req.body.name, req.body.thumbnail,
    function (success, user) {
      if (success) {
        res.send({
          token: user.token,
          name: user.name,
          thumbnail: user.thumbnail
        })
      } else {
        res.status(500).send({error: 'error creating user'})
      }
    })
})

router.post('/profile', function (req, res) {
  auth.authorize(req.body.token, function (success, user) {
    if (success) {
      auth.update(user, req.body, function (success, user) {
        if (success) {
          res.send({
            name: user.name,
            thumbnail: user.thumbnail
          })
        } else {
          res.status(401).send({error: 'error while updating'})
        }
      })
    } else {
      res.status(401).send({error: 'invalid token'})
    }
  })
})

router.post('/auth', function (req, res) {
  auth.authorize(req.body.token, function (success, user) {
    if (success) {
      res.send({
        name: user.name,
        thumbnail: user.thumbnail
      })
    } else {
      res.status(401).send({error: 'invalid token'})
    }
  })
})

module.exports = router
