import * as hue from '../lib/hue'
import * as wemo from '../lib/wemo'

export function goodnight() {
    return hue.discover()
        .then((hueSystem) => {
            wemo.setSwitchState('Fan', 1)
            return Promise.all([
                hue.setLightStateByName(hueSystem.bridges, 'Nick Bedroom', hue.ILightState.Off),
                hue.setLightStateByName(hueSystem.bridges, 'Rhonda Bedroom', hue.ILightState.Off)
            ])
        })
}

export function wakeup() {
    return hue.discover()
        .then((hueSystem) => {
            wemo.setSwitchState('Fan', 0)
            return Promise.all([
                hue.setLightStateByName(hueSystem.bridges, 'Nick Bedroom', hue.ILightState.On),
                hue.setLightStateByName(hueSystem.bridges, 'Rhonda Bedroom', hue.ILightState.On),
            ])
        })
}