import * as hue from '../lib/hue'

export function getLights() {
    return hue.discover().then(hueSystem => {
        return hue.getLights(hueSystem.bridges[0])
    })
}

export function enableLights(deviceName: string, state: string): Promise<boolean> {
    return hue.discover().then(hueSystem => {
        const bridges = hueSystem.bridges

        return hue.getLight(bridges, deviceName)
            .then(light => {
                if (!light) throw new Error(`Light ${deviceName} not found`)
                const turnOn = (state && state === 'on') ? hue.ILightState.On : hue.ILightState.Off
                return hue.setLightState(bridges[0], light, turnOn)
            })
    })
}