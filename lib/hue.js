/**
 * Created by nicknance on 4/15/17.
 */

var hue = require("node-hue-api")
var jsonfile = require('jsonfile')

var file = './hue.json'

var displayBridges = function(bridge) {
    console.log("Hue Bridges Found: " + JSON.stringify(bridge))
}

var displayUserResult = function(result) {
    console.log("Created user: " + JSON.stringify(result))
}

var displayResult = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

var displayError = function(err) {
    console.log(err)
}

// --------------------------
// Using a callback
var findBridge = function(cb) {
    hue.nupnpSearch(function (err, result) {
        if (err) {
            displayError(err)
            throw err
        }
        displayBridges(result)
        cb(result)
    })
}

var registerUser = function(bridges, cb) {
    var host = bridges[0].ipaddress
    console.log('registering user at ' + host)

    var api = new hue.HueApi()
    api.createUser(host, 'Omega IoT', function(err, user) {
        if (err) {
            displayError(err)
            throw err
        }
        displayUserResult(user)
        cb(user)
    })
}

var writeRegistration = function(bridges, user, cb) {
    bridges[0].user = user
    var obj = {
        bridges: bridges
    }
    jsonfile.writeFile(file, obj, function(err) {
        console.error(err)
        if (cb) cb(obj)
    })
}

var getBridge = function(bridge, cb) {
    var api = new hue.HueApi(bridge.ipaddress, bridge.user)
    api.getConfig(function(err, config){
        if (err) {
            displayError(err)
            throw(err)
        }
        displayResult(config)
        if (cb) cb(config)
    })
}

var getLights = function(bridge, cb) {
    var api = new hue.HueApi(bridge.ipaddress, bridge.user)
    api.lights(function(err, results){
        if (err) {
            displayError(err)
            throw(err)
        }
        var lights = results.lights
        if (cb) cb(lights)
    })
}

var setLightState = function(bridge, light, on, cb) {
    var api = new hue.HueApi(bridge.ipaddress, bridge.user)
    var lightState = hue.lightState

    var state = lightState.create()
    if (on) {
        state.on().brightness(100)
    } else {
        state.off()
    }

    api.setLightState(light.id, state, function(err, lights){
        if (err) {
            displayError(err)
            throw(err)
        }
        if (cb) cb(lights)
    })
}

var getLight = function(bridges, name, cb) {
    getLights(bridges[0], function(lights){
        var light
        for (var i = 0; i < lights.length; i++) {
            if (lights[i].name === name) {
                light = lights[i]
            }
        }
        cb(light)
    })
}

var initialize = function (cb) {
    jsonfile.readFile(file, function(err, obj) {
        if (err) {
            findBridge(function(bridges) {
                registerUser(bridges, function(user){
                    writeRegistration(bridges, user, function(obj){
                        console.log('registration completed')
                        cb(obj)
                    })
                })
            })
        } else {
            cb(obj)
        }
    })
}

module.exports = {
    initialize: initialize,
    getLights: getLights,
    getLight: getLight,
    setLightState: setLightState
}