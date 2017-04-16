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

    console.dir(req.query)

    hue.getLight(bridges, req.query.name, function(light) {
        var turnOn
        if (req.query.state === "on") {
            turnOn = true
        } else {
            turnOn = false
        }
        hue.setLightState(bridges[0], light, turnOn, function() {
            res.send("lights on")
        })
    })
})

app.listen(port, function() {
    console.log('server listening on port ' + port)
})

