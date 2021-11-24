import express from 'express'
let path = require('path')
var webApp = express()
let portWeb = 3000
let portSocket = 4000

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

	setTimeout(() => {
		client.emit('match', {
			matchNumber: 2,
			r1: 1,
			r2: 2,
			r3: 3,
			b1: 4,
			b2: 24,
			b3: 1294,
		})
		setTimeout(() => {
			client.emit('match', {
				matchNumber: 5,
				r1: 2,
				r2: 3,
				r3: 4,
				b1: 1,
				b2: 1294,
				b3: 7,
			})
			setTimeout(() => {
				client.emit('scout', {
					isScout: true,
					robotScouting: 1294,
					isRed: true,
				})
			}, 2000)
		}, 2000)
	}, 1000)
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
