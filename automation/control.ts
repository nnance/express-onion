import * as hue from '../lib/hue'

export function enableLights(hueSystem: hue.IHueSystem, deviceName: string, state: string): Promise<boolean> {
    const bridges = hueSystem.bridges

    return hue.getLight(bridges, deviceName)
        .then(light => {
            if (!light) throw new Error(`Light ${deviceName} not found`)
            const turnOn = (state && state === 'on') ? hue.ILightState.On : hue.ILightState.Off
            return hue.setLightState(bridges[0], light, turnOn)
        })
}