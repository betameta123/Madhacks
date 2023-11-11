const express = require('express')
const app = express()
const port = 8383

//app.use(express.static('public'))

app.get('/', (req, res) => {
    res.status(200).json({'x': '5'})
})

app.listen(port, () => console.log('listening on port ' + port.toString()))