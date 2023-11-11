
ROCHELLE_PORT = '/dev/cu.SLAB_USBtoUART'
RACHELLE_PORT = '/dev/cu.usbserial-0001'
PORT = RACHELLE_PORT

const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')
const port = new SerialPort({ path: PORT, baudRate: 9600 })
console.log(port);

const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }))
parser.on('data', console.log)


