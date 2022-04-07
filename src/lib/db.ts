//Setup Mongo
import { Collection, MongoClient } from 'mongodb';
import { importMatchDataFromTheBlueAlliance, importTeamDataFromTheBlueAlliance } from './importFromTBA';

let client = new MongoClient('mongodb://localhost');
client.connect();

let compDB = client.db('REGIONALS');
let scoutedDataColl: Collection<App.ScoutedMatch> = compDB.collection('MatchData');
let scoutedNotesColl: Collection<App.ScoutedNotes> = compDB.collection('MatchNotes');
let pitDataColl: Collection<App.PitData> = compDB.collection('PitData');
let matchesColl: Collection<App.Match> = compDB.collection("Matches");
let teamsColl: Collection<App.PitTeam> = compDB.collection("Teams");
let humansColl: Collection<App.Human> = compDB.collection("Humans");
let scheduleColl: Collection<App.Shift> = compDB.collection("Schedule")
let matchNumberColl: Collection<{matchNumber: number}> = compDB.collection("MatchToHighlight");
let endMatchColl: Collection<{matchNumber: number}> = compDB.collection("EndingMatch");

//Methods

export async function addScoutedDataToDB(scoutedData: App.ScoutedMatch) {
	await scoutedDataColl.insertOne(scoutedData);
}

export async function addNotesToDB(notes: App.ScoutedNotes[]) {
	await scoutedNotesColl.insertMany(notes);
}

export async function addPitDataToDB(scoutedData: App.PitData) {
	console.log('DATA');
	console.log(scoutedData);
	await pitDataColl.insertOne(scoutedData);
	await teamsColl.updateOne({teamNumber: scoutedData.teamNumber}, {$set: {hasBeenPitScouted: true} });
}

export async function matchDataHasBeenImported() {
	return await matchesColl.find().count() > 0
}

export async function teamDataHasBeenImported() {
	return await matchesColl.find().count() > 0
}

export async function importEventMatchData() {
	if(await matchDataHasBeenImported()) {
		throw new Error("Match data already imported!")
	}
	let data = await importMatchDataFromTheBlueAlliance();
	matchesColl.insertMany(data);
	return "ok"
}

export async function importEventTeamData() {
	if(await teamDataHasBeenImported()) {
		throw new Error("Team data already imported!")
	}
	let data = await importTeamDataFromTheBlueAlliance();
	teamsColl.insertMany(data);
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

export async function getListOfAllTeams(): Promise<App.PitTeam[]> {
	return await teamsColl.find().toArray();
}

export async function updateHighlightedMatch(newMatchNumber: number) {
	await matchNumberColl.deleteMany({});
	await matchNumberColl.insertOne({matchNumber: newMatchNumber});
}
export async function updateEndingMatch(newMatchNumber: number) {
	await endMatchColl.deleteMany({});
	await endMatchColl.insertOne({matchNumber: newMatchNumber});
}

export async function getHighlightedMatchNumber(): Promise<number> {
	let matchNumber = 0;
	try {
		matchNumber = (await matchNumberColl.findOne()).matchNumber;
	} catch (error) {
		matchNumber = 0;
	}
	return matchNumber ?? 0;
}
export async function getEndMatchNumber(): Promise<number> {
	let matchNumber = 0;
	try {
		matchNumber = (await endMatchColl.findOne()).matchNumber;
	} catch (error) {
		matchNumber = 0;
	}
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

export async function aggregate(): Promise<App.AggregatedTeamData[]> {
	let pipeline = [
		{
		  '$group': {
			'_id': '$teamNumber', 
			'averageCargoAuto': {
			  '$avg': '$cargo.auto'
			}, 
			'averageCargoTele': {
			  '$avg': '$cargo.teleop'
			}, 
			'averageMissedCargo': {
			  '$avg': '$cargo.missed'
			}, 
			'canClimbLow': {
			  '$max': '$climb.low'
			}, 
			'percentClimbLow': {
			  '$avg': {
				'$cmp': [
				  '$climb.low', false
				]
			  }
			}, 
			'canClimbMid': {
			  '$max': '$climb.mid'
			}, 
			'percentClimbMid': {
			  '$avg': {
				'$cmp': [
				  '$climb.mid', false
				]
			  }
			}, 
			'canClimbHigh': {
			  '$max': '$climb.high'
			}, 
			'percentClimbHigh': {
			  '$avg': {
				'$cmp': [
				  '$climb.high', false
				]
			  }
			}, 
			'canClimbTraverse': {
			  '$max': '$climb.traverse'
			}, 
			'percentClimbTraverse': {
			  '$avg': {
				'$cmp': [
				  '$climb.traverse', false
				]
			  }
			}, 
			'defensePercent': {
			  '$avg': {
				'$cmp': [
				  '$defense', false
				]
			  }
			}, 
			'reliablePercent': {
			  '$avg': {
				'$cmp': [
				  true, '$itBroke'
				]
			  }
			}, 
			'stuckPercent': {
			  '$avg': {
				'$cmp': [
				  true, '$gotStuckOften'
				]
			  }
			}, 
			'percentLowHub': {
			  '$avg': {
				'$cmp': [
				  true, '$gotStuckOften'
				]
			  }
			}, 
			'percentUpperHub': {
			  '$avg': {
				'$cmp': [
				  '$hub.upper', false
				]
			  }
			}, 
			'percentLowerHub': {
			  '$avg': {
				'$cmp': [
				  '$hub.lower', false
				]
			  }
			}, 
			'canUpperHub': {
			  '$max': '$hub.upper'
			}, 
			'canLowerHub': {
			  '$max': '$hub.lower'
			}, 
			'commentsArray': {
			  '$push': '$notes'
			}
		  }
		}, {
		  '$addFields': {
			'climb': {
			  'low': {
				'can': '$canClimbLow', 
				'percent': '$percentClimbLow'
			  }, 
			  'mid': {
				'can': '$canClimbMid', 
				'percent': '$percentClimbMid'
			  }, 
			  'high': {
				'can': '$canClimbHigh', 
				'percent': '$percentClimbHigh'
			  }, 
			  'traverse': {
				'can': '$canClimbTraverse', 
				'percent': '$percentClimbTraverse'
			  }
			}, 
			'hub': {
			  'lower': {
				'can': '$canLowerHub', 
				'percent': '$percentLowerHub'
			  }, 
			  'upper': {
				'can': '$canUpperHub', 
				'percent': '$percentUpperHub'
			  }
			}, 
			'notes': {
			  '$reduce': {
				'input': '$commentsArray', 
				'initialValue': '', 
				'in': {
				  '$cond': {
					'if': {
					  '$eq': [
						'$$value', ''
					  ]
					}, 
					'then': '$$this', 
					'else': {
					  '$concat': [
						'$$value', ', ', '$$this'
					  ]
					}
				  }
				}
			  }
			}
		  }
		}, {
		  '$unset': [
			'canClimbLow', 'canClimbMid', 'canClimbHigh', 'canClimbTraverse', 'percentClimbLow', 'percentClimbMid', 'percentClimbHigh', 'percentClimbTraverse', 'canLowerHub', 'canUpperHub', 'percentLowerHub', 'percentLowHub', 'percentUpperHub'
		  ]
		}
	  ]

	  let result = await scoutedDataColl.aggregate(pipeline).toArray()
	  return result as unknown as App.AggregatedTeamData[];
}

export async function getAggregatedNotes(): Promise<App.AggregatedNotes[]> {
	let pipeline = [
		{
		  '$group': {
			'_id': '$teamNumber', 
			'commentsArray': {
			  '$push': '$notes'
			}
		  }
		}, {
		  '$addFields': {
			'notes': {
			  '$reduce': {
				'input': '$commentsArray', 
				'initialValue': '', 
				'in': {
				  '$cond': {
					'if': {
					  '$eq': [
						'$$value', ''
					  ]
					}, 
					'then': '$$this', 
					'else': {
					  '$concat': [
						'$$value', ', ', '$$this'
					  ]
					}
				  }
				}
			  }
			}
		  }
		}
	  ]

	  let result = await scoutedNotesColl.aggregate(pipeline).toArray()
	  return result as unknown as App.AggregatedNotes[];
}

export async function getTeamData(teamNumber: number): Promise<App.AggregatedTeamData> {
	let data = await aggregate();
	return data.find(i => i._id == teamNumber);
	
}

export async function getTeamNotes(teamNumber: number): Promise<App.AggregatedNotes> {
	let data = await getAggregatedNotes();
	return data.find(team => team._id == teamNumber)
}

export async function getPitTeamData(teamNumber: number): Promise<App.PitData> {
	return await pitDataColl.findOne({teamNumber: teamNumber});
}