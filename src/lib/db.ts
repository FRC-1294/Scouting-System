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
let eventInfoColl: Collection<App.EventInfo> = compDB.collection("EventInfo");

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
	return await teamsColl.find().toArray();
}

export async function updateEventInfo(data: App.EventInfo) {
	if((await eventInfoColl.find().toArray()).length < 1 ) {
		await eventInfoColl.insertOne(data);
	} else {
		await eventInfoColl.updateOne({}, {$set: data});
	}
}

export async function setNextMatchNumber(num: number) {
	await eventInfoColl.updateOne({}, {$set: {nextMatchNumber: num}});
}

export async function getEventInfo(): Promise<App.EventInfo> {
	return await eventInfoColl.findOne();
}