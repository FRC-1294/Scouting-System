import express from 'express'
import mongoose from 'mongoose'
let path = require('path')
import crypto from 'crypto'
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

function getId(): string {
	return crypto.randomBytes(20).toString('hex')
}

//
//State
//
export type SCOUT = {
	name: String;
	id: String;
	status: "connected" | "disconnected" | "scouting" | "submit";
	isScouting: Boolean;
	robotScouting: Number;
}
let scouts: SCOUT[] = []
setInterval(() => {
	ioAdmin.emit("scouts", scouts)
}, 200)

//
//DATABASE
//
const SCOUTINGSCHEMA = {
	auto: Number, //Scale of 0 to 2, 0: None, 1: Move, 2: Score
	boxesMovedAuto: Number, 
	boxesMovedTeleop: Number,
	efficient: Boolean //Whether the robot navigated "Efficiently"
}

const matchSchema = new mongoose.Schema({
	matchNumber: Number,
	redBots: [Number],
	blueBots: [Number]
})
const MATCH = mongoose.model('match', matchSchema)

//The idea here is that the scouts would send data to the server, and the server would create a document for each match/team combo.
//To get data on a team, I'll setup an aggregation to merge all these match/team documents into a single team document.
const robotDataSchema = new mongoose.Schema({
	teamNumber: Number,
	matchNumber: Number,
	scoutingData: SCOUTINGSCHEMA
})
const ROBOTDATA = mongoose.model('robotdata', robotDataSchema)



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
var ioScout = new Server(socketServer, {
	cors: {
		origin: '*',
		methods: ['PUT', 'GET', 'POST', 'DELETE', 'OPTIONS'],
	},
})

var ioAdmin = ioScout.of("/admin")

//Events
ioScout.on('connection', (client) => {
	console.log(`Client connected: ${client.id}`)
	let clientAuth = client.handshake.auth
	console.log(`Client auth: ${clientAuth}`)
	
	//AUTH
	let auth = false;
	//ID
	if(clientAuth.id ?? false) {
		
	}

	//Password
	if(clientAuth.password ?? false) {
		if(clientAuth.password == "12941294") {
			auth = true;

		}
	}


	if(!auth) {
		console.log('PERMISSION DENIED')
		client.emit('alert', 'PERMISSION DENIED.')
		client.disconnect()
	}
	//Beyond this point, assume client is authenticated

	scouts.push({
		name: clientAuth.name,
		id: getId(),
		status: "connected",
		isScouting: false,
		robotScouting: null
	})

	//Client events
	client.on('data', (data, callback) => {
		console.log('Client sent data')
		//TODO: Submit data to database
		callback({
			status: 'Success',
		})
	})
})

ioAdmin.on('connection', (client) => {
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
		ioScout.emit("match", newMatchData)

		//Debug
		setTimeout(() => {
			ioScout.emit("scout", {
				isScout: Math.random() > .5,
				robotScouting: randomNumber(1, 9999),
				isRed: Math.random() > .5
			})
		}, 500)
		//End debug
	})

	client.on("endMatch", () => {
		ioScout.emit("end")
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
