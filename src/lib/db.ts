//Setup Mongo
import { Collection, MongoClient } from 'mongodb';
import { importDataFromTheBlueAlliance } from './importFromTBA';

let client = new MongoClient('mongodb://localhost');
client.connect();

let compDB = client.db('TESTING_COMP_DATABASE');
let scoutedDataColl: Collection<App.ScoutedMatch> = compDB.collection('MatchData');
let pitDataColl: Collection<App.PitData> = compDB.collection('PitData');
let matchesColl: Collection<App.Match> = compDB.collection("Matches");
let teamsColl: Collection<App.PitTeam> = compDB.collection("Teams");

//Methods
export async function aggregate() {}

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


export async function getMatches(noneLessThan?: number) {
	return await matchesColl.find({matchNumber: {$gt: noneLessThan ?? 0}}).toArray();
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