var express = require('express');
var app = express();
let path = require('path')
let fs = require('fs')
let port = 3000 || process.env.PORT

//Static directory
app.use(express.static("public"))

//Logging middleware
app.use((req, res, next) => {
    console.log(req.url)
    next();
})

//Let Svelte handle all requests
app.get('*', (req, res) => {
    res.sendFile('public/main.html', {root: __dirname })
})

//Listen app
app.listen(port, () => {console.log(`Server listening on port ${port}`)})