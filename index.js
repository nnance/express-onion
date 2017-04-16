var express = require('express')
var app = express()
var hue = require('./lib/hue')

var port = 3000
var hueSystem

hue.initialize(function(obj){
    hueSystem = obj
})

app.get('/lights', function(req, res) {
    var bridges = hueSystem.bridges

    hue.getLight(bridges, req.query.name, function(light) {
        var turnOn = req.query.state && req.query.state === "on"
        hue.setLightState(bridges[0], light, turnOn, function() {
            res.send(req.query.name + " is now " + (turnOn) ? "on" : "off")
        })
    })
})

app.listen(port, function() {
    console.log('server listening on port ' + port)
})

