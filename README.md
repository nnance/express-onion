# express-onion

A lightweight express server to be used on an Omega 2 Linux server to allow controlling IoT devices on a network.  This is beyond controlling a single device and really is about having routines setup that would enable / disable many devices with a single command.  Basically bash files for IoT.

## Supported devices

The initial implementation of the service only works with the following system / devices

* Phillip Hue lights

## Available commands

Though the initial commands are setup to turn on a single device the purpose of this project is to build routines that would turn on or off multiple devices for a single command.

Turn a specific light on
```ssh
curl 'http://omega-d353.local:3000/lights?name=Floor%20lamp&state=on'
```

Turn a specific light off
```ssh
curl 'http://omega-d353.local:3000/lights?name=Floor%20lamp&state=off'
```