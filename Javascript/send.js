const http = require("http");
const host = 'localhost';
const port = 8080

const ROCHELLE_PORT = '/dev/cu.SLAB_USBtoUART'
const RACHELLE_PORT = '/dev/cu.usbserial-0001'
const PORT = ROCHELLE_PORT

const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')
const arduinoPort = new SerialPort({ path: PORT, baudRate: 9600 })
console.log(port);

var ret = {x: 0, y: 0};

const parser = arduinoPort.pipe(new ReadlineParser({ delimiter: '\r\n' }))
parser.on('data', dataToJson)

function dataToJson(data) {
    var inputArray = data.split(",");
    ret.x = inputArray[0]
    ret.y = inputArray[1]
    //ret.z = inputArray[2]
}

const requestListener = function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(ret));
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});