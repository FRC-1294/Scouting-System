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
let humansColl: Collection<App.Human> = compDB.collection("Humans");
let scheduleColl: Collection<App.Shift> = compDB.collection("Schedule")
let matchNumberColl: Collection<{matchNumber: number}> = compDB.collection("MatchToHighlight");

//Methods
export async function aggregate() {}

export async function addScoutedDataToDB(scoutedData: App.ScoutedMatch) {
	await scoutedDataColl.insertOne(scoutedData);
}

export async function addPitDataToDB(scoutedData: App.PitData) {
	console.log('DATA');
	console.log(scoutedData);
	await pitDataColl.insertOne(scoutedData);
	await teamsColl.updateOne({teamNumber: scoutedData.teamNumber}, {$set: {hasBeenPitScouted: true} });
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


export async function getMatches(highlightNumber?: number) {
	let matches = await matchesColl.find().toArray();
	if(highlightNumber) {
		matches.forEach(match => {
			if(match.matchNumber == highlightNumber) match.isCurrentMatch = true; 
		})
	}
	return matches;
}

export async function getListOfRobotsToPitScout(): Promise<App.PitTeam[]> {
	return await teamsColl.find().toArray();
}

export async function updateHighlightedMatch(newMatchNumber: number) {
	await matchNumberColl.deleteMany({});
	await matchNumberColl.insertOne({matchNumber: newMatchNumber});
}

export async function getHighlightedMatchNumber(): Promise<number> {
	let matchNumber = (await matchNumberColl.findOne()).matchNumber
	return matchNumber ?? 0;
}

export async function getHumans(): Promise<App.Human[]> {
	let arr = await humansColl.find().toArray();
	arr.forEach(item => {
		delete item._id
	})
	return arr;
}

export async function addScheduleToDB(schedule: App.Shift[]) {
	await scheduleColl.drop()
	await scheduleColl.insertMany(schedule);
}