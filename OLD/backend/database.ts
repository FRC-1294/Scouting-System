import mongoose from 'mongoose';
import crypto from 'crypto';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
export class DatabaseManager {
	matchSchema = new mongoose.Schema({
		matchNumber: Number,
		redBots: [Number],
		blueBots: [Number]
	});
	MATCH = mongoose.model('match', this.matchSchema);

	//The idea here is that the scouts would send data to the server, and the server would create a document for each match/team combo.
	//To get data on a team, I'll setup an aggregation to merge all these match/team documents into a single team document.
	robotDataSchema = new mongoose.Schema({
		teamNumber: Number,
		matchNumber: Number,

		auto: Number, //Scale of 0 to 2, 0: None, 1: Move, 2: Score
		boxesMovedAuto: Number,
		boxesMovedTeleop: Number,
		efficient: Boolean //Whether the robot navigated "Efficiently"
	});
	ROBOTDATA = mongoose.model('robotdata', this.robotDataSchema);

	/**
	 * @param {string} url - The URL of the database as mongo://{username}:{password}@{IP}/
	 */
	constructor(url?: string) {
		if (true) {
			console.log('spawning database');
			let dataPath = path.join(process.cwd(), './mongo/data');
			try {
				fs.mkdirSync(dataPath);
			} catch (e) {
				console.log('Folder already exists');
			}
			let databaseProcess = spawn(path.join(process.cwd(), './mongo/bin/mongod.exe'), [
				'--dbpath',
				dataPath
			]);
			databaseProcess.on('message', (m) => {
				console.log('DB: ' + m);
			});
			databaseProcess.on('error', (e) => {
				console.log('DB error: ' + e);
			});
			process.on('SIGINT', () => {
				databaseProcess.kill();
			});
			process.on('SIGTERM', () => {
				databaseProcess.kill();
			});
		}
		mongoose.connect(url ?? 'mongodb://localhost');
	}

	/**
	 * submitData
	 */
	public submitData(dataToSumbit: Object) {
		//TODO validate
		let dataObject: mongoose.Document = new this.ROBOTDATA(dataToSumbit);
		dataObject.save();
	}

	/**
	 * aggregateTeams
	 */
	public async aggregateTeams() {
		let pipeline = [
			{
				$group: {
					_id: '$teamNumber',
					MaxAuto: {
						$max: '$auto'
					},
					AvgAuto: {
						$avg: '$auto'
					},
					MinAuto: {
						$min: '$auto'
					},
					AvgBoxesMovedAuto: {
						$avg: '$boxesMovedAuto'
					},
					AvgBoxesMovedTeleop: {
						$avg: '$boxesMovedTeleop'
					},
					MaxBoxesMovedAuto: {
						$max: '$boxesMovedAuto'
					},
					MaxBoxesMovedTeleop: {
						$max: '$boxesMovedTeleop'
					}
				}
			},
			{
				$sort: {
					AvgBoxesMovedTeleop: -1,
					AvgBoxesMovedAuto: -1,
					MaxAuto: -1,
					AvgAuto: -1
				}
			}
		];
		console.log('Aggregation requested');
		let result = await this.ROBOTDATA.aggregate(pipeline).exec();
		return result;
	}

	//
	//Everything related to users
	//
	userSchema = new mongoose.Schema({
		id: Number, //The ID of the user. Positive if discord, negative if email
		isDiscord: Boolean, //Is the user registered through Discord?
		name: String, //The name of the user
		lastMatchScouted: Number, //The last match this user scouted, -1 if they haven't scouted yet
		socketId: String //The socket ID of the user
	});
	USER = mongoose.model('user', this.userSchema);

	/**
	 * Creates a user and adds them to the database
	 * @param {Object} user The user object to create and add
	 */
	public createUser(user: { id: number; isDiscord: boolean; name: string }) {
		let newUserDoc: mongoose.Document = new this.USER({
			id: user.id,
			isDiscord: user.isDiscord,
			name: user.name,
			lastMatchScouted: -1
		});
		newUserDoc.save();
	}

	/**
	 * Checks if a user with the specified ID exists
	 */
	public async doesUserExist(id: number) {
		let docs = await this.USER.find({ id: id }).exec();
		return docs.length > 0;
	}
}
