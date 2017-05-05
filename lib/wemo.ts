const Wemo = require('wemo-client')
const wemo = new Wemo()

var fan

export function discover(): Promise<any> {
    return new Promise((resolve, reject) => {
        wemo.discover(function(deviceInfo) {
            console.log('Wemo Device Found: %j', deviceInfo);

            if (deviceInfo.friendlyName === 'Fan') {

                // Get the client for the found device
                fan = wemo.client(deviceInfo);

                // You definitely want to listen to error events (e.g. device went offline),
                // Node will throw them as an exception if they are left unhandled  
                fan.on('error', function(err) {
                    console.log('Error: %s', err.code)
                })

                // Handle BinaryState events
                fan.on('binaryState', function(value) {
                    console.log('Binary State changed to: %s', value)
                })

                resolve(fan)
            }

        })
    })
}

export function setSwitchState(name: string, state: number) {
    fan.setBinaryState(state)
}