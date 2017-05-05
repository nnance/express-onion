/**
 * Created by nicknance on 4/15/17.
 */

import * as hue from "node-hue-api"
import jsonfile = require('jsonfile')

const file = './hue.json'

export interface IRegisteredBridge extends hue.IUpnpSearchResultItem {
    user: string
}

export interface IHueSystem {
    bridges: IRegisteredBridge[]
}

export enum ILightState { On, Off }

const displayBridges = (bridges: hue.IUpnpSearchResultItem[]) =>
    console.log("Hue Bridges Found: " + JSON.stringify(bridges))

const displayUserResult = (result: string[]) =>
    console.log("Created user: " + JSON.stringify(result))

const printResult = (result) =>
    console.log(JSON.stringify(result, null, 2))

const printError = (err: string) => console.log(err)

const findBridges = (): Promise<hue.IUpnpSearchResultItem[]> => {
    return hue.nupnpSearch()
        .then(results => {
            displayBridges(results)
            return results
        })
        .catch(printError)
}


const transformBridge = (bridge: hue.IUpnpSearchResultItem, user: string): IRegisteredBridge => {
    const registeredBridge = bridge as IRegisteredBridge
    registeredBridge.user = user
    return registeredBridge
}

const registerUser = (bridges: hue.IUpnpSearchResultItem[]): Promise<IRegisteredBridge[]> => {
    console.log(`registering user on ${bridges.length} bridges`)

    const api = new hue.HueApi()
    const regRequests = bridges.map(bridge => api.createUser(bridge.ipaddress, "Omega IoT"))
    return Promise.all(regRequests)
        .then(users => {
            displayUserResult(users)
            return users.map((user, idx) => transformBridge(bridges[idx], user))
        })
}

const writeHueSystem = (hueSystem: IHueSystem): Promise<IHueSystem> => {
    return new Promise((resolve, reject) => {
        jsonfile.writeFile(file, hueSystem, (err) => {
            if (err) {
                console.error(err)
                reject(err)
            }
            resolve(hueSystem)
        })
    })
}

const getBridge = (bridge: IRegisteredBridge): Promise<hue.IBridgeConfig> => {
    const api = new hue.HueApi(bridge.ipaddress, bridge.user)
    return api.getConfig()
        .then(config => {
            printResult(config)
            return config
        })
        .catch(printError)
}

const readConfig = (file: string): Promise<IHueSystem> => {
    return new Promise((resolve, reject) => {
        jsonfile.readFile(file, (err, hueSystem: IHueSystem) => {
            if (err) reject(err)
            else resolve(hueSystem)
        })
    })
}

export function getLights(bridge: IRegisteredBridge): Promise<hue.ILight[]> {
    const api = new hue.HueApi(bridge.ipaddress, bridge.user)
    return api.lights()
        .then(results => results.lights)
        .catch(printError)
}

export function setLightState(bridge: IRegisteredBridge, light: hue.ILight, state: ILightState): Promise<boolean> {
    const api = new hue.HueApi(bridge.ipaddress, bridge.user)
    const lightState = hue.lightState

    const newState = lightState.create()
    if (state === ILightState.On) {
        newState.on().brightness(100)
    } else {
        newState.off()
    }

    return api.setLightState(light.id, newState)
}

export function setLightStateByName(bridges: IRegisteredBridge[], name: string, state: ILightState): Promise<boolean> {
    return getLight(bridges, name)
        .then(light => setLightState(bridges[0], light, state))
}

export function getLight(bridges: IRegisteredBridge[], name: String): Promise<hue.ILight> {
    return getLights(bridges[0])
        .then(lights => lights.find(light => light.name === name))
}

export function discover(): Promise<IHueSystem> {
    return readConfig(file)
        .catch(() => {
            findBridges()
                .then(registerUser)
                .then(bridges => { return { bridges } as IHueSystem })
                .then(writeHueSystem)
                .then(() => console.log('registration completed'))
                .catch(err => {
                    printError(err)
                    throw err
                })
        })
}
