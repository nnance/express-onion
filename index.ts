import * as express from 'express'
import * as hue from './lib/hue'
import * as bedroom from './automation/bedroom'
import * as control from './automation/control'

const app = express()
const port = 3000

hue.discover()
    .then(hueSystem => {
        app.get('/bedtime', (req, res) => 
            bedroom.goodnight(hueSystem).then(x => res.send(x)))

        app.get('/wakeup', (req, res) => 
            bedroom.wakeup(hueSystem).then(x => res.send(x)))

        app.get('/lights', (req, resp) => 
            hue.getLights(hueSystem.bridges[0]).then(x => resp.send(x)))

        app.get('/lights/:name', (req, res) => {
            control.enableLights(hueSystem, req.params.name, req.query.state)
                .then(() => res.send(`${req.params.name} is now ${req.query.state}`))
                .catch(err => res.status(500).send({error: err.message}))
        })

    })
    .catch(err => process.exit(err))

app.listen(port, () => console.log(`server listening on port ${port}`))

