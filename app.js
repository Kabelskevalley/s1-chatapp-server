var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var bodyParser = require('body-parser')
var mongoose = require('mongoose')

// config
app.set('views', 'views')
app.set('view engine', 'pug')

// middlewares
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({   // to support URL-encoded bodies
  extended: true
}))

// database
mongoose.connect('mongodb://localhost/stroke')
app.locals.db = mongoose

// routes
app.use('/', require('./routes/app'))
app.use('/api', require('./routes/api'))

// bootstrap
require('./lib/chat')(io)

http.listen(3000, function () {
  console.log('stroke serving on *:3000')
})
