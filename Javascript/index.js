const http = require("http");
const host = 'localhost';
const port = 3000
var cors_proxy = require('cors-anywhere');
cors_proxy.createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2']
}).listen(port, host, function() {
    
    console.log('Running CORS Anywhere on ' + host + ':' + port);
})
/*
app.get('/', (req, res) => {
    //const path = require('path');
    //const filePath = path.resolve(__dirname, 'index.html');
    res.send('Hello World1');
})

app.listen(3000,()=>{
    console.log('server is running!');
})
*/






