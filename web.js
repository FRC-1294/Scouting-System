var express = require('express');
var webApp = express();
let portWeb = 3000
let portSocket = 4000

//
//WEB
//
//Static directory
webApp.use(express.static("public"))

//Logging middleware
webApp.use((req, res, next) => {
    console.log("Request: " + req.url)
    next();
})

//Let Svelte handle all requests
webApp.get('*', (req, res) => {
    res.sendFile('public/main.html', {root: __dirname })
})

//
//SOCKET
//
//Setup server
var socketServer = require('http').createServer();
var io = require('socket.io')(socketServer,{
  cors: {
    origin: "*",
    methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders:["ThisIsASuperSecretSecureStringForUseToAuthentimicateTheRandomnessOnMyBackendYouSeriouslyShouldNotUseThisHNxQ3VEvbESFVES32423513452BSIUFVHSFD"],
    credentials: false
  }
});

//Events
io.on('connection', function(client) {
  console.log('Client connected...');
  
  client.on('join', function(data) {
    console.log(data);
      client.emit('messages', 'Hello from server');

    setTimeout(() => {
        client.emit("serverMessage", "AA")
    }, 2000)
  });
});


//Listen apps
webApp.listen(portWeb, () => {console.log(`Server listening on port ${portWeb}`)})
socketServer.listen(portSocket, () => console.log(`Socket io listening on port ${portSocket}`));