import * as hue from '../lib/hue'

export function goodnight(hueSystem: hue.IHueSystem) {
    return Promise.all([
        hue.setLightStateByName(hueSystem.bridges, 'Nick Bedroom', hue.ILightState.Off),
        hue.setLightStateByName(hueSystem.bridges, 'Rhonda Bedroom', hue.ILightState.Off)
    ])
}

export function wakeup(hueSystem: hue.IHueSystem) {
    return Promise.all([
        hue.setLightStateByName(hueSystem.bridges, 'Nick Bedroom', hue.ILightState.On),
        hue.setLightStateByName(hueSystem.bridges, 'Rhonda Bedroom', hue.ILightState.On)
    ])
}