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
    var deviceName = req.query.name
    var state = req.query.state

    console.log('/lights %s %s', deviceName, state)

    hue.getLight(bridges, deviceName, function(light) {
        var turnOn = state && state === "on"
        hue.setLightState(bridges[0], light, turnOn, function() {
            res.send(deviceName + " is now " + (turnOn) ? "on" : "off")
        })
    })
})

app.listen(port, function() {
    console.log('server listening on port ' + port)
})

