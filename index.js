var express = require('express')
var app = express()
var hue = require('./lib/hue')

var port = 3000

hue.findBridge()

app.get('/', function(req, res) {
    res.send('Hello World')
})

app.listen(port, function() {
    console.log('server listening on port ' + port)
})

