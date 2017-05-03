/**
 * Created by nicknance on 4/15/17.
 */

import * as hue from "node-hue-api"
import jsonfile = require('jsonfile')

const file = './hue.json'

export interface IRegisteredBridge extends hue.IUpnpSearchResultItem {
    user: string
}

export enum ILightState {
    On,
    Off
}

const displayBridges = (bridges: hue.IUpnpSearchResultItem[]) =>
    console.log("Hue Bridges Found: " + JSON.stringify(bridges))

const displayUserResult = (result: string[]) =>
    console.log("Created user: " + JSON.stringify(result))

const displayResult = (result) =>
    console.log(JSON.stringify(result, null, 2))

const displayError = (err: string) => console.log(err)

const findBridge = () => {
    return hue.nupnpSearch()
        .then(displayBridges)
        .catch(displayError)
}

const transformBridge = (bridge: hue.IUpnpSearchResultItem, user: string): IRegisteredBridge => {
    const registeredBridge = bridge as IRegisteredBridge
    registeredBridge.user = user
    return registeredBridge
}

const registerUser = (bridges: hue.IUpnpSearchResultItem[]): Promise<IRegisteredBridge[]> => {
    console.log(`registering user on ${bridges.length} bridges`)

    const api = new hue.HueApi()
    const regRequests = bridges.map(bridge => {return api.createUser(bridge.ipaddress, "Omega IoT")})
    return Promise.all(regRequests)
        .then(users => {
            displayUserResult(users)
            return users.map((user, idx) => {return transformBridge(bridges[idx], user)})
        })
        .catch(displayError)
}

const writeRegistration = (bridges: IRegisteredBridge[]) => {
    return new Promise((resolve, reject) => {
        jsonfile.writeFile(file, {bridges}, (err) => {
            if (err) {
                console.error(err)
                reject(err)
            }
            resolve()
        })        
    })
}

const getBridge = (bridge: IRegisteredBridge) => {
    const api = new hue.HueApi(bridge.ipaddress, bridge.user)
    return api.getConfig()
        .then(displayResult)
        .catch(displayError)
}

export function getLights(bridge: IRegisteredBridge): Promise<hue.ILight[]> {
    const api = new hue.HueApi(bridge.ipaddress, bridge.user)
    return api.lights()
        .then((results) => {return results.lights})
        .catch(displayError)
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

export function getLight(bridges: IRegisteredBridge[], name: String): Promise<hue.ILight> {
    return getLights(bridges[0])
        .then((lights) => {return lights.find((light) => light.name === name)})
}

export function initialize() {
    return new Promise((resolve, reject) => {
        jsonfile.readFile(file, function(err, obj) {
            if (err) {
                hue.nupnpSearch()
                    .then((bridges) => {
                        displayBridges(bridges)
                        registerUser(bridges)
                            .then((registeredBridges) => {
                                writeRegistration(registeredBridges)
                                    .then((obj) => {
                                        console.log('registration completed')
                                        resolve(obj)
                                    })
                                    .catch((err) => reject(err))
                            })
                            .catch((err) => reject(err))
                    })
                    .catch((err) => reject(err))
            } else {
                resolve(obj)
            }
        })
    })
}
