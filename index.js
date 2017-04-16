var hue = require('./lib/hue')
var program = require('commander')

program
    .version('0.0.1')
    .option('-s, --state [value]', 'Change state to [on]', 'on')
    .option('-d, --device [name]', 'Select the specified device [bedroom]', 'bedroom')
    .parse(process.argv);

hue.initialize(function(hueSystem){
    var bridges = hueSystem.bridges
    var turnOn = program.state && program.state === "on"

    hue.getLight(bridges, program.device, function(light) {
        hue.setLightState(bridges[0], light, turnOn, function() {
            console.log(program.device + " is now " + (turnOn) ? "on" : "off")
        })
    })
})

console.log('your command:');
if (program.state) console.log('  - %s state ', program.state);
console.log('  - %s device', program.device);
