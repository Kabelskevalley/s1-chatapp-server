var auth = require('../lib/auth')
var express = require('express')
var router = express.Router()

router.get('/', function (req, res) {
  res.render('index')
})

router.get('/register', function (req, res) {
  res.render('register')
})

router.post('/register', function (req, res) {
  auth.register(req.body.username, req.body.password, req.body.name, req.body.thumbnail, function (success, user) {
    res.redirect('/register')
  })
})

router.get('/channels', function (req, res) {
  var mongoose = require('mongoose')
  var Channel = mongoose.model('channels', require('../schemas/channel'))

  Channel.find({}, function (err, channels) {
    console.log(err)
    res.render('channels', {channels: channels})
  })
})

router.post('/channels', function (req, res) {
  var mongoose = require('mongoose')
  var Channel = mongoose.model('channels', require('../schemas/channel'))

  Channel.create({id: req.body.id, name: req.body.name},
    function (err, channel) {
      console.log(err)
      res.redirect('/channels')
    })
})

// TODO should be a 'delete' method, use method spoofing
router.post('/channels/:id', function (req, res) {
  var mongoose = require('mongoose')
  var Channel = mongoose.model('channels', require('../schemas/channel'))

  Channel.find({id: req.params.id}).remove(
    function (err) {
      if (err) console.log(err)
      res.redirect('/channels')
    })
})

// router.get('/chat', function(req, res){
//   res.render('chat')
// })
//
// router.get('/login', function(req, res){
//   res.render('login')
// })

module.exports = router
