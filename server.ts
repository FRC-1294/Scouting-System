import express, { response } from 'express'
var http = require('http')
import mongoose from 'mongoose'
let path = require('path')
import crypto from 'crypto'
var webApp = express()
let portWeb = 80
let portSocket = 4000

//
//Utility
//
function randomNumber(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

function getId(): string {
	return crypto.randomBytes(20).toString('hex')
}

//
//State
//
export type SCOUT = {
	name: string
	id: string
	socketId: string
	status: 'connected' | 'disconnected' | 'scouting' | 'submit'
	isScouting: Boolean
	robotScouting: Number
}
let scouts: SCOUT[] = []
setInterval(() => {
	ioAdmin.emit('scouts', scouts)
}, 200)
function findScout(id: string): SCOUT {
	let toReturn = undefined
	scouts.forEach((thisScout) => {
		if (thisScout.id == id || thisScout.socketId == id) {
			toReturn = thisScout
		}
	})
	return toReturn
}

//
//DATABASE
//
const matchSchema = new mongoose.Schema({
	matchNumber: Number,
	redBots: [Number],
	blueBots: [Number],
})
const MATCH = mongoose.model('match', matchSchema)

//The idea here is that the scouts would send data to the server, and the server would create a document for each match/team combo.
//To get data on a team, I'll setup an aggregation to merge all these match/team documents into a single team document.
const robotDataSchema = new mongoose.Schema({
	teamNumber: Number,
	matchNumber: Number,
	
	auto: Number, //Scale of 0 to 2, 0: None, 1: Move, 2: Score
	boxesMovedAuto: Number,
	boxesMovedTeleop: Number,
	efficient: Boolean, //Whether the robot navigated "Efficiently"
})
const ROBOTDATA = mongoose.model('robotdata', robotDataSchema)

//
//Server
//
var server = http.createServer(webApp)
// Pass a http.Server instance to the listen method



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
webApp.get('/', (req, res) => {
	res.sendFile('public/main.html', { root: __dirname })
})
webApp.get('/scout', (req, res) => {
	res.sendFile('public/main.html', { root: __dirname })
})
webApp.get('/control', (req, res) => {
	res.sendFile('public/main.html', { root: __dirname })
})
webApp.use('/static', express.static('node_modules'))

//
//SOCKET
//
//Setup server
import { Server } from 'socket.io'
var ioScout = new Server(server, {
	cors: {
		origin: '*',
		methods: ['PUT', 'GET', 'POST', 'DELETE', 'OPTIONS'],
	},
})

var ioAdmin = ioScout.of('/admin')

//Events
ioScout.on('connection', (client) => {
	console.log(`Client connected: ${client.id}`)

	//AUTH
	client.on('login', (clientAuth, ack) => {
		//console.log(clientAuth)
		let response = { loggedIn: false, id: '' }
		//ID
		if (clientAuth.id ?? false) {
			let thisScout = findScout(clientAuth.id)
			if (thisScout ?? false) {
				thisScout.status = 'connected'
				thisScout.socketId = client.id
				response.loggedIn = true
				response.id = thisScout.id
			}
		}

		//Password
		if (clientAuth.password ?? false) {
			if (clientAuth.password == '12941294') {
				let foundAScout = false
				scouts.forEach((thisScout) => {
					if (thisScout.name == clientAuth.name) {
						foundAScout = true
						thisScout.status = 'connected'
						thisScout.socketId = client.id
						thisScout.isScouting = false
						response.loggedIn = true
						response.id = thisScout.id
					}
				})

				if (!foundAScout) {
					let newId = getId()
					scouts.push({
						name: clientAuth.name,
						id: newId,
						socketId: client.id,
						status: 'connected',
						isScouting: false,
						robotScouting: null,
					})
					response.loggedIn = true
					response.id = newId
				}
			}
		}
		ack(response)
		//console.log(scouts)
	})

	//Use this function to test for auth
	/*
		if(!findScout(client.id)) {
			console.log("Someone's trying to do stuff without being logged in.")
			//There's no way the client would do this stuff without getting the ack from the server, so we assume something malicious is happening and disconnect them
			client.disconnect()
		}
	*/
	//Client events
	client.on('data', (data, callback) => {
		console.log('Client sent data')
		let thisScout = findScout(client.id)
		if (!thisScout) {
			console.log(
				"Someone's trying to submit data without being logged in."
			)
			client.disconnect()
		}
		thisScout.status = 'submit'
		console.log(data)

		/*
const robotDataSchema = new mongoose.Schema({
	teamNumber: Number,
	matchNumber: Number,
	
	auto: Number, //Scale of 0 to 2, 0: None, 1: Move, 2: Score
	boxesMovedAuto: Number,
	boxesMovedTeleop: Number,
	efficient: Boolean, //Whether the robot navigated "Efficiently"
})
		*/
		//TODOCOMP fix data.data.
		let thisData: mongoose.Document = new ROBOTDATA({
			teamNumber: data.teamNumber,
			matchNumber: data.matchNumber,
			auto: data.data.auto,
			boxesMovedAuto: data.data.boxesMovedAuto,
			boxesMovedTeleop: data.data.boxesMovedTeleop,
			efficient: data.data.efficient
		})

		thisData.save()
		callback({
			status: 'Success',
		})
	})

	client.on('disconnect', () => {
		console.log(client.id + ' Disconnected')
		let thisScout = findScout(client.id)
		if (thisScout) {
			thisScout.status = 'disconnected'
		}
		//console.log('DISCONNECTED')
		//console.log(scouts)
	})
})

let theAdmin: { socket: string; token: string } = {
	socket: '',
	token: '',
}
ioAdmin.on('connection', (client) => {
	console.log(`Admin connected: ${client.id}`)

	//TODOCOMP this is hacky, fix
	client.on('login', (token, ack) => {
		if (token == '12941294' || token == theAdmin.token) {
			//console.log('Admin logged in')
			let response = {
				loggedIn: true,
				token: getId(),
			}
			theAdmin = {
				socket: client.id,
				token: response.token,
			}
			ack(response)
		} else {
			ack({ loggedIn: false })
		}

		//console.log(theAdmin)
	})

	//Admin events
	client.on('setupMatch', (newMatchNumber, newRobotNumber) => {
		//Boot off the admin if they're not authenticated
		if (client.id != theAdmin.socket) client.disconnect()
		console.log(`Setting up match ${newMatchNumber}`)
		let newMatchData = {
			matchNumber: newMatchNumber,
		}

		ioScout.emit('match', newMatchData)
		//TODOCOMP Make this use actual robots, not just our robot
		scouts.forEach((thisScout) => {
			if (
				thisScout.status == 'connected' ||
				thisScout.status == 'submit'
			) {
				thisScout.status = 'scouting'
				ioScout.to(thisScout.socketId).emit('scout', {
					isScout: true,
					robotScouting: newRobotNumber,
					isRed: randomNumber(0, 1) == 1,
				})
			}
		})
	})

	client.on('endMatch', () => {
		//Boot off the admin if they're not authenticated
		if (client.id != theAdmin.socket) client.disconnect()
		console.log('Ending Match')
		ioScout.emit('end')
	})

	client.on('boot', (id) => {
		//Boot off the admin if they're not authenticated
		if (client.id != theAdmin.socket) client.disconnect()
		let thisScout = findScout(id)
		ioScout
			.to(thisScout.socketId)
			.emit(
				'alert',
				"You've been disconnected. Please refresh the page and try again."
			)
		let index = scouts.indexOf(thisScout)
		if (index > -1) {
			scouts.splice(index, 1)
		}
	})

	client.on('aggregate', async (sendResult) => {
		let pipeline = [
			{
			  '$group': {
				'_id': '$teamNumber', 
				'MaxAuto': {
				  '$max': '$auto'
				}, 
				'AvgAuto': {
				  '$avg': '$auto'
				}, 
				'MinAuto': {
				  '$min': '$auto'
				}, 
				'AvgBoxesMovedAuto': {
				  '$avg': '$boxesMovedAuto'
				}, 
				'AvgBoxesMovedTeleop': {
				  '$avg': '$boxesMovedTeleop'
				}, 
				'MaxBoxesMovedAuto': {
				  '$max': '$boxesMovedAuto'
				}, 
				'MaxBoxesMovedTeleop': {
				  '$max': '$boxesMovedTeleop'
				}
			  }
			}, {
			  '$sort': {
				'AvgBoxesMovedTeleop': -1, 
				'AvgBoxesMovedAuto': -1, 
				'MaxAuto': -1, 
				'AvgAuto': -1
			  }
			}
		]
		console.log("Aggregation requested")
		let result = await ROBOTDATA.aggregate(pipeline).exec()
		console.log(result)
		sendResult(result)
	})
})

//Listen apps
server.listen(portWeb, async () => {
	console.log("Welcome to the scouting system!")
	await mongoose.connect('mongodb://localhost:27017/robotics')
	console.log(`Web listening on port ${portWeb}`)
	console.log(`Database connected`)
})

//Close apps
function bye() {
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
