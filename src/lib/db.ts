/*
Mongo will have an auth database, "Auth", and a database for each competition

Auth will have 2 collections:
"Users" will store data for each user including their username and password hash 
"Sessions" will store session data.


Each competition database will have a few collections:
"Prescout" which will hold pre-scout data
"Matches" which will hold data for the matches at a competition
"ScoutedMatches" which will hold data for each match scouted and each robot
*/

//Setup Mongo
import { Collection, MongoClient } from 'mongodb';
import { importDataFromTheBlueAlliance } from './importFromTBA';

let client = new MongoClient('mongodb://localhost');
client.connect();

let authDB = client.db('Auth');
let usersColl: Collection<App.StoredUser> = authDB.collection('Users');
let sessionColl: Collection<App.StoredSession> = authDB.collection('Sessions');

let compDB = client.db('TESTING_COMP_DATABASE');
let scoutedDataColl: Collection<App.ScoutedMatch> = compDB.collection('MatchData');
let pitDataColl: Collection<App.PitData> = compDB.collection('PitData');
let matchesColl: Collection<App.Match> = compDB.collection("Matches");
let teamsColl: Collection<App.PitTeam> = compDB.collection("Teams");

//Methods
export async function aggregate() {}

export async function getUser(username: string): Promise<App.StoredUser> {
	return await usersColl.findOne({ username: username });
}

export async function doesUserExist(username: string): Promise<boolean> {
	return (await usersColl.countDocuments({ username: username })) > 0;
}

export async function createUser(user: App.StoredUser): Promise<void> {
	if (await doesUserExist(user.username))
		throw new Error('Username taken, make sure to check for that');
	await usersColl.insertOne(user);
}

export async function addScoutedDataToDB(scoutedData: App.ScoutedMatch) {
	await scoutedDataColl.insertOne(scoutedData);
}

export async function addPitDataToDB(scoutedData: App.PitData) {
	console.log('DATA');
	console.log(scoutedData);
	await pitDataColl.insertOne(scoutedData);
	await teamsColl.updateOne({teamNumber: scoutedData.teamNumber}, {hasBeenPitScouted: true});
}


export async function importEventData() {
	if(await teamsColl.find().count() > 0) {
		throw new Error("Data already imported!")
	}
	let data = await importDataFromTheBlueAlliance();
	matchesColl.insertMany(data.matches);
	teamsColl.insertMany(data.teams);
	return "ok"
}

export async function getEventData(): Promise<App.Event> {
	let output: any = {};
	output.matches = await matchesColl.find().toArray();
	output.teams = await teamsColl.find().toArray();

	return output;
}

export async function getListOfRobotsToPitScout(): Promise<App.PitTeam[]> {
	if(await teamsColl.find({hasBeenPitScouted: false}).count() < 1) {
		teamsColl.insertMany([
			{teamNumber: 1294, hasBeenPitScouted: false},
			{teamNumber: 1234, hasBeenPitScouted: false},
			{teamNumber: 1212, hasBeenPitScouted: false},
			{teamNumber: 222, hasBeenPitScouted: true},
			{teamNumber: 194, hasBeenPitScouted: true},
		])
	}
	console.log(await teamsColl.find({hasBeenPitScouted: false}).toArray())
	return await teamsColl.find({hasBeenPitScouted: false}).toArray();
}