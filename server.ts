import express, { response } from 'express'
import http from 'http'
import https from 'https'
import fs from 'fs'
import mongoose from 'mongoose'
let path = require('path')
import crypto from 'crypto'
var webApp = express()
let portWeb = 80

//
//IMPORT CONFIG
//
type configFile = {
	client_id: string,
	client_secret: string,
	bot_token: string
}

let config: configFile = <configFile>JSON.parse(fs.readFileSync("./config.json").toString())
if(!config.client_id || !config.bot_token || !config.client_secret) {
	throw new Error("Config file did not have required parameters");
}
console.log(config)

//
//MANAGERS
//
import { DatabaseManager } from './src/backend/database'
import { DiscordManager } from './src/backend/discord'
import { ScoutManager, ScoutType } from './src/backend/scouts'
import { SessionManager } from './src/backend/sessionManager'

//ORDER MATTERS, some of these depend on the other
export let databaseMan = new DatabaseManager("mongodb://localhost:27017/robotics")
export let discordMan = new DiscordManager()
export let sessionMan = new SessionManager()
export let scoutMan = new ScoutManager()

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
let scouts: ScoutType[] = []
setInterval(() => {
	ioAdmin.emit('scouts', scouts)
}, 200)
function findScout(id: string): ScoutType {
	let toReturn = undefined
	scouts.forEach((thisScout) => {
		if (thisScout.token == id || thisScout.socketId == id) {
			toReturn = thisScout
		}
	})
	return toReturn
}

//
//Server
//
//SSL  TLS
var server: http.Server | https.Server
if (false) { //disabled until I get stuff working
	console.log("SECURE MODE ENABLED")
	const keys = {	
		key: fs.readFileSync('./keys/key.pem'),
		cert: fs.readFileSync('./keys/cert.pem')	  
	}
	server = https.createServer(keys, webApp)
} else {
	console.log("SECURE MODE DISABLED")
	server = http.createServer(webApp)
}

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
				response.id = thisScout.token
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
						response.id = thisScout.token
					}
				})

				if (!foundAScout) {
					let newId = getId()
					scouts.push({
						name: clientAuth.name,
						token: newId,
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

		/* TODO remove this comment
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
		databaseMan.submitData({ //TODO
			teamNumber: data.teamNumber,
			matchNumber: data.matchNumber,
			auto: data.data.auto,
			boxesMovedAuto: data.data.boxesMovedAuto,
			boxesMovedTeleop: data.data.boxesMovedTeleop,
			efficient: data.data.efficient,
		})

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
		let result = databaseMan.aggregateTeams()
		console.log(result)
		sendResult(result)
	})
})

//Listen apps
server.listen(portWeb, async () => {
	console.log('Welcome to the scouting system!')
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
