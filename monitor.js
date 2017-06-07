const mqtt = require('mqtt')
const colors = require('colors');

var mqttIP=process.argv[2];

if(mqttIP==null){
    console.log(colors.red('Please provide a broker IP to connect to.  (node monitor.js <broker ip>'))
    process.exit(1);
}

console.log(colors.gray('Connecting to: '+mqttIP))
client = mqtt.connect('mqtt://'+mqttIP)


/**
 */
var state = 'closed'

client.on('connect', () => {
    client.subscribe('#')

    // Inform controllers that we are connected
    client.publish('monitor/mqtt', 'true')
})

client.on('message', (topic, message) => {
    console.log(colors.white(mqttIP)+' '+colors.green(Date()) + '-' 
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