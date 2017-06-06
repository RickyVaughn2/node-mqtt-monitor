const mqtt = require('mqtt')
const colors = require('colors');
const client = mqtt.connect('mqtt://localhost')

/**
 */
var state = 'closed'

client.on('connect', () => {
    client.subscribe('#')

    // Inform controllers that we are connected
    client.publish('monitor/mqtt', 'true')
})

client.on('message', (topic, message) => {
    console.log(colors.green(Date()) + '-' 
    + colors.green('(' + Math.round(+new Date() / 1000) + ')') + ' : ' 
    + colors.white('Topic') + ':' + colors.blue(topic) + ' ' 
    + colors.white('Payload') + ':' + colors.yellow(message))
})


/**
 * App exit
 */
function handleAppExit(options, err) {
    if (err) {
        console.log(err.stack)
    }

    if (options.cleanup) {
        client.publish('monitor/mqtt', 'false')
    }

    if (options.exit) {
        process.exit()
    }
}

/**
 * Handle the different ways an application can shutdown
 */
process.on('exit', handleAppExit.bind(null, {
    cleanup: true
}))
process.on('SIGINT', handleAppExit.bind(null, {
    exit: true
}))
process.on('uncaughtException', handleAppExit.bind(null, {
    exit: true
}))