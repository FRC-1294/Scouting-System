var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server,{
  cors: {
    origin: "*",
    methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders:["ThisIsASuperSecretSecureStringForUseToAuthentimicateTheRandomnessOnMyBackendYouSeriouslyShouldNotUseThisHNxQ3VEvbESFVES32423513452BSIUFVHSFD"],
    credentials: false
  }
});
var cors = require('cors')
app.use(cors())

io.on('connection', function(client) {
  console.log('Client connected...');
  
  client.on('join', function(data) {
    console.log(data);
      client.emit('messages', 'Hello from server');
  });
});


server.listen(4000, () => console.log("Listening!"));