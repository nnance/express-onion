import * as express from 'express'
import * as hue from './lib/hue'

const app = express()
const port = 3000

hue.initialize()
    .then(hueSystem => {
        app.get('/lights', (req, res) => {
            const bridges = hueSystem.bridges
            const deviceName = req.query.name
            const state = req.query.state

            console.log(`/lights ${deviceName} ${state}`)

            hue.getLight(bridges, deviceName)
                .then(light => {
                    if (!light) throw new Error(`Light ${deviceName} not found`)
                    const turnOn = (state && state === 'on') ? hue.ILightState.On : hue.ILightState.Off
                    return hue.setLightState(bridges[0], light, turnOn)
                })
                .then(() => res.send(`${deviceName} is now ${state}`))
                .catch(err => {
                    console.error(err)
                    res.status(500).send({error: err.message})
                })
        })
    })
    .catch(err => process.exit(err))

app.listen(port, () => console.log(`server listening on port ${port}`))

