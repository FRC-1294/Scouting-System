import mongoose from 'mongoose'
import crypto from 'crypto'
export class DatabaseManager {
	matchSchema = new mongoose.Schema({
		matchNumber: Number,
		redBots: [Number],
		blueBots: [Number],
	})
	MATCH = mongoose.model('match', this.matchSchema)

	//The idea here is that the scouts would send data to the server, and the server would create a document for each match/team combo.
	//To get data on a team, I'll setup an aggregation to merge all these match/team documents into a single team document.
	robotDataSchema = new mongoose.Schema({
		teamNumber: Number,
		matchNumber: Number,

		auto: Number, //Scale of 0 to 2, 0: None, 1: Move, 2: Score
		boxesMovedAuto: Number,
		boxesMovedTeleop: Number,
		efficient: Boolean, //Whether the robot navigated "Efficiently"
	})
	ROBOTDATA = mongoose.model('robotdata', this.robotDataSchema)

	/**
	 * @param {string} url - The URL of the database as mongo://{username}:{password}@{IP}/
	 */
	constructor(url: string) {
		mongoose.connect(url)
	}

	/**
	 * submitData
	 */
	public submitData(dataToSumbit: Object) {
		//TODO validate
		let dataObject: mongoose.Document = new this.ROBOTDATA(dataToSumbit)
		dataObject.save()
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
						$max: '$auto',
					},
					AvgAuto: {
						$avg: '$auto',
					},
					MinAuto: {
						$min: '$auto',
					},
					AvgBoxesMovedAuto: {
						$avg: '$boxesMovedAuto',
					},
					AvgBoxesMovedTeleop: {
						$avg: '$boxesMovedTeleop',
					},
					MaxBoxesMovedAuto: {
						$max: '$boxesMovedAuto',
					},
					MaxBoxesMovedTeleop: {
						$max: '$boxesMovedTeleop',
					},
				},
			},
			{
				$sort: {
					AvgBoxesMovedTeleop: -1,
					AvgBoxesMovedAuto: -1,
					MaxAuto: -1,
					AvgAuto: -1,
				},
			},
		]
		console.log('Aggregation requested')
		let result = await this.ROBOTDATA.aggregate(pipeline).exec()
		return result
	}

    //
	//Everything related to users
    //
	userSchema = new mongoose.Schema({
		id: Number, //The ID of the user. Positive if discord, negative if email
		isDiscord: Boolean, //Is the user registered through Discord?
	})
	USER = mongoose.model('user', this.userSchema)

	/**
	 * createUser
	 * Creates a user and adds them to the database
	 * @param {Object} user The user object to create and add
	 */
	public createUser(user: Object) {
		//TODO
	}

    //
	//Everything related to sessions
    //
	sessionSchema = new mongoose.Schema({
		userId: Number,
		token: String,
		expiry: Number, //The UNIX epoch when the session expires (Tested <= to current)
	})
	SESSION = mongoose.model('session', this.sessionSchema)

	/**
	 * createSession
	 * Creates a session and saves it to the database
	 * @param {Number} userId the ID of the user to create a session for
	 * @returns {string} The token of the user
	 */
	public createSession(userId: Number) {
		let token = crypto.randomBytes(20).toString('hex')
		var date = new Date()
		let newSession: mongoose.Document = new this.SESSION({
			userId: userId,
			token: token,
			expiry: date.getTime() + 1000 * 60 * 60 * 24 * 2, //1000 ms * 60 sec * 60 min * 24 hr * 2 day = 2 days from now
		})
		newSession.save()
		return token
	}

	/**
	 * getSession
	 * Gets the session object from the database. Returns { userId: -1 } if there's no sesion
	 * @param {Number} id The ID of the user
	 * @param {string} token The Token to check
	 */
	public async getSession(id: Number, token: string) { //TODO this may not work
		let foundDocument = await this.SESSION.findOne(
			{
				userId: id,
				token: token,
			}
		).exec()
        return foundDocument ?? {userId: -1}
	}
}
