import * as express from 'express'
import * as hue from './lib/hue'

const app = express()

const port = 3000
let hueSystem

hue.initialize()
    .then((obj) => hueSystem = obj)

app.get('/lights', function(req, res) {
    const bridges = hueSystem.bridges
    const deviceName = req.query.name
    const state = req.query.state

    console.log(`/lights ${deviceName} ${state}`)

    hue.getLight(bridges, deviceName)
        .then((light) => {
            const turnOn = (state && state === 'on') ? hue.ILightState.On : hue.ILightState.Off
            hue.setLightState(bridges[0], light, turnOn)
                .then(() => res.send(`${deviceName} is now ${(turnOn) ? 'on' : 'off'}`))
        })
})

app.listen(port, function() {
    console.log(`server listening on port ${port}`)
})

