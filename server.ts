import express, { response } from 'express'
import http from 'http'
import https from 'https'
import fs from 'fs'
import mongoose from 'mongoose'
let path = require('path')
import crypto from 'crypto'
var webApp = express()
let portWeb = 80
var session = require('express-session')
var cookieParser = require('cookie-parser')
var MongoDBStore = require('connect-mongodb-session')(session)

//
//IMPORT CONFIG
//
type configFile = {
	client_id: string,
	client_secret: string,
	bot_token: string,
	database_url: string,
	cookie_secret: string
}

let config: configFile = <configFile>JSON.parse(fs.readFileSync("./config.json").toString())
if(!config.client_id || !config.bot_token || !config.client_secret || !config.database_url || !config.cookie_secret) {
	throw new Error("Config file did not have required parameters");
}

//
//MANAGERS
//
import { DatabaseManager } from './src/backend/database'
import { DiscordManager } from './src/backend/discord'
import { ScoutManager, ScoutType } from './src/backend/scouts'
import { SessionManager } from './src/backend/sessionManager'

//ORDER MATTERS, some of these depend on the other
export let databaseMan = new DatabaseManager(config.database_url)
export let discordMan = new DiscordManager(config.bot_token)
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

//Middleware
//cookies
webApp.use(cookieParser(config.cookie_secret, {}))

//sessions
webApp.use(session({
	secret: config.cookie_secret,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 2 //1000ms * 60s * 60m * 24h * 2d
	}
}))
var store = new MongoDBStore({
	uri: config.database_url,
	collection: 'sessions',
	expires: 1000 * 60 * 60 * 24 * 2, // 2 days in milliseconds
  })


//Auth
webApp.get('/loginWithDiscord', (req, res) => {
	res.redirect('') //TODO specify OAuth URL based on environment variable
})

webApp.post('/email', (req,res) => {

	res.redirect('/scout')
})

webApp.get('/discordCallback', (req: any, res) => {
	console.log(req.params.code)
	//TODO
	//Session must implement userId, isAdmin
})

webApp.get('/logout', (req: any, res) => {
	req.session.destroy()
})

//Let Svelte handle all page requests
webApp.get('/', (req, res) => {
	res.sendFile('public/main.html', { root: __dirname })
})
webApp.get('/scout', (req: any, res) => {
	if(!req.session.userId) {
		res.redirect('/')
	} else {
		res.sendFile('public/main.html', { root: __dirname })
	}
})
webApp.get('/email', (req, res) => {
	res.sendFile('public/main.html', { root: __dirname })
})
webApp.get('/control', (req: any, res) => {
	if(req.session.isAdmin) {
		res.sendFile('public/main.html', { root: __dirname })
	} else {
		res.redirect('/')
	}
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

	

	//Client events
	client.on('data', (data, callback) => {
		console.log('Client sent data')
		let thisScout = findScout(client.id)
		if (!thisScout) {
			throw new Error() //TODO document this error
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

	
	//Admin events
	client.on('setupMatch', (newMatchNumber, newRobotNumber) => {
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
		console.log('Ending Match')
		ioScout.emit('end')
	})

	client.on('boot', (id) => {
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
