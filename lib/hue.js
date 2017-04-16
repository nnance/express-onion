/**
 * Created by nicknance on 4/15/17.
 */

var hue = require("node-hue-api")

var displayBridges = function(bridge) {
    console.log("Hue Bridges Found: " + JSON.stringify(bridge))
}

var lighting = {
    // --------------------------
    // Using a callback
    findBridge: function() {
        hue.nupnpSearch(function (err, result) {
            if (err) throw err
            displayBridges(result)
        })
    }
}

module.exports = lighting