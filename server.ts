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
	name: string;
	id: string;
	socketId: string;
	status: "connected" | "disconnected" | "scouting" | "submit";
	isScouting: Boolean;
	robotScouting: Number;
}
let scouts: SCOUT[] = []
setInterval(() => {
	ioAdmin.emit("scouts", scouts)
}, 200)
function findScout(id: string): SCOUT {
	let toReturn = undefined
	scouts.forEach(thisScout => {
		if(thisScout.id == id || thisScout.socketId == id) {
			toReturn = thisScout			
		}
	})
	return toReturn
}

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
	
	//AUTH
	client.on("login", (clientAuth, ack) => {
		console.log(clientAuth)
		let response = {loggedIn: false,id: ""}
		//ID
		if(clientAuth.id ?? false) {
			let thisScout = findScout(clientAuth.id)
			if(thisScout ?? false) {
				thisScout.status = "connected"
				thisScout.socketId = client.id
				response.loggedIn = true
				response.id = thisScout.id
			} 
		}
	
		//Password
		if(clientAuth.password ?? false) {
			if(clientAuth.password == "12941294") {
				let foundAScout = false
				scouts.forEach(thisScout => {
					if(thisScout.name == clientAuth.name) {
						foundAScout = true
						thisScout.status = "connected"
						thisScout.socketId = client.id
						thisScout.isScouting = false
						response.loggedIn = true
						response.id = thisScout.id
					}
				})

				if(!foundAScout) {
					let newId = getId()
					scouts.push({
						name: clientAuth.name,
						id: newId,
						socketId: client.id,
						status: "connected",
						isScouting: false,
						robotScouting: null
					})
					response.loggedIn = true
					response.id = newId					
				}
			}
		}
		ack(response)
		console.log(scouts)
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
		if(!thisScout) {
			console.log("Someone's trying to submit data without being logged in.")
			client.disconnect()
		}
		thisScout.status = "submit"
		console.log(data)
		//TODO: Submit data to database
		callback({
			status: 'Success',
		})
	})

	client.on('disconnect', () => {
		console.log(client.id + " Disconnected")
		let thisScout = findScout(client.id)
		if(thisScout) {
			thisScout.status = "disconnected"
		}
		console.log("DISCONNECTED")
		console.log(scouts)
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
		}

		//TODO improve randomized scouts
		let robotsThatNeedScouting = []
		for (let i = 0; i < 1; i++) {
			robotsThatNeedScouting.push(randomNumber(1, 9999))
		}
		ioScout.emit("match", newMatchData)

		scouts.forEach(thisScout => {
			if(thisScout.status == "connected" || thisScout.status == "submit" && robotsThatNeedScouting.length > 0) {
				ioScout.to(thisScout.socketId).emit("scout", {
					isScout: true,
					robotScouting: robotsThatNeedScouting.pop(),
					isRed: randomNumber(0,1) == 1
				})
			}
		})
	})

	client.on("endMatch", () => {
		console.log("Ending Match")
		ioScout.emit("end")
	})

	client.on("boot", id => {
		let thisScout = findScout(id)
		ioScout.to(thisScout.socketId).emit("alert", "You've been disconnected. Please refresh the page and try again.")
		let index = scouts.indexOf(thisScout)
		if (index > -1) {
			scouts.splice(index, 1);
		}
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
