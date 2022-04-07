import { getListOfAllTeams, getMatches, getPitTeamData, getTeamData, getTeamNotes } from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';

export type Data = {
	teamNumber: number;
	MatchData: App.AggregatedTeamData;
	PitData: App.PitData;
	red: boolean;
	notes: App.AggregatedNotes;
};

export let get = async function ({params}): Promise<{
	body: {
		redData: Data[];
		blueData: Data[];
	};
}> {
	console.log("Match!")
	let redOutput:Data[]  = [];
	let blueOutput:Data[] = [];
	let MatchData = (await getMatches()).find(item => item.matchNumber == params.match);


	let teams = (await getListOfAllTeams())
	console.log(teams)

	for (let i = 0; i < teams.length; i++) {
		const team = teams[i];
		if(MatchData.blue.includes(team.teamNumber)) {
	
			console.log(team.teamNumber)
			let aggData = await getTeamData(team.teamNumber)
			console.log(aggData)
			let pitData = await getPitTeamData(team.teamNumber)
			console.log(pitData)
			let notes = await getTeamNotes(team.teamNumber)
			blueOutput.push({teamNumber: team.teamNumber, notes: notes, MatchData: aggData, PitData: pitData, red: MatchData.red.includes(team.teamNumber)})
		}
		
	}

	for (let i = 0; i < teams.length; i++) {
		const team = teams[i];
		if(MatchData.red.includes(team.teamNumber)) {
	
			console.log(team.teamNumber)
			let aggData = await getTeamData(team.teamNumber)
			console.log(aggData)
			let pitData = await getPitTeamData(team.teamNumber)
			console.log(pitData)
			let notes = await getTeamNotes(team.teamNumber)
			redOutput.push({teamNumber: team.teamNumber, notes: notes, MatchData: aggData, PitData: pitData, red: MatchData.red.includes(team.teamNumber)})
		}
		
	}
	return {
		body: {
			redData: redOutput,
			blueData: blueOutput
		}
	};
};
