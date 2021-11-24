import express from 'express'
let path = require('path')
var webApp = express()
let portWeb = 3000
let portSocket = 4000

//
//Utility
//
function randomNumber(min: number, max: number) {  
	return Math.floor(
		Math.random() * (max - min + 1) + min
	)
}

//
//WEB
//
//Static directory
webApp.use(express.static('public'))

//Logging middleware
webApp.use((req, res, next) => {
	console.log('Request: ' + req.url)
	next()
})

//Let Svelte handle all requests
webApp.get('*', (req, res) => {
	res.sendFile('public/main.html', { root: __dirname })
})

//
//SOCKET
//
//Setup server
var socketServer = require('http').createServer()
import { Server } from 'socket.io'
var io = new Server(socketServer, {
	cors: {
		origin: '*',
		methods: ['PUT', 'GET', 'POST', 'DELETE', 'OPTIONS'],
	},
})

//Events
io.on('connection', (client) => {
	console.log(`Client connected: ${client.id}`)
	console.log(`Client auth: ${client.handshake.auth.token}`)
	if (client.handshake.auth.token != 'leToken') {
		console.log('PERMISSION DENIED')
		client.emit('alert', 'PERMISSION DENIED.')
		client.disconnect()
	}

	//Client events
	client.on('data', (data, callback) => {
		console.log('Client sent data')
		//TODO: Submit data to database
		callback({
			status: 'Success',
		})
	})
})

io.of('/admin').on('connection', (client) => {
	console.log(`Admin connected: ${client.id}`)
	console.log(`Admin auth: ${client.handshake.auth.token}`)
	if (client.handshake.auth.token != 'leToken') {
		console.log('PERMISSION DENIED')
		client.emit('alert', 'PERMISSION DENIED.')
		client.disconnect()
	}

	//Admin events
	client.on("setupMatch", newMatchNumber => {
		console.log(`Setting up match ${newMatchNumber}`)
		let newMatchData = {
			matchNumber: newMatchNumber,
			r1: randomNumber(1, 9999),
			r2: randomNumber(1, 9999),
			r3: randomNumber(1, 9999),
			b1: randomNumber(1, 9999),
			b2: randomNumber(1, 9999),
			b3: randomNumber(1, 9999),
		}
		io.emit("match", newMatchData)

		//Debug
		setTimeout(() => {
			io.emit("scout", {
				isScout: true,
				robotScouting: randomNumber(1, 9999),
				isRed: Math.random() > .5
			})
		}, 500)
		//End debug
	})
})

//Listen apps
webApp.listen(portWeb, () => {
	console.log(`Website listening on port ${portWeb}`)
})
socketServer.listen(portSocket, () =>
	console.log(`Socket io listening on port ${portSocket}`)
)

//Close apps
function bye() {
	socketServer.emit('close')
	webApp.emit('stop')
	console.log('Stopped. Bye!')
	process.exit(0)
}
process.on('SIGINT', () => {
	bye()
})
process.on('SIGTERM', () => {
	bye()
})
