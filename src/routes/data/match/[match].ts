import { getListOfAllTeams, getMatches, getPitTeamData, getTeamData, getTeamNotes } from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';



export let get = async function ({params}): Promise<{
	body: {
		redData: App.CompleteTeamData[];
		blueData: App.CompleteTeamData[];
	};
}> {
	
	let redOutput:App.CompleteTeamData[]  = [];
	let blueOutput:App.CompleteTeamData[] = [];
	let MatchData = (await getMatches()).find(item => item.matchNumber == params.match);


	let teams = (await getListOfAllTeams())
	

	for (let i = 0; i < teams.length; i++) {
		const team = teams[i];
		if(MatchData.blue.includes(team.teamNumber)) {
	
			
			let aggData = await getTeamData(team.teamNumber)
			
			let pitData = await getPitTeamData(team.teamNumber)
			
			let notes = await getTeamNotes(team.teamNumber)
			blueOutput.push({teamNumber: team.teamNumber, notes: notes, MatchData: aggData, PitData: pitData, red: MatchData.red.includes(team.teamNumber)})
		}
		
	}

	for (let i = 0; i < teams.length; i++) {
		const team = teams[i];
		if(MatchData.red.includes(team.teamNumber)) {
	
			
			let aggData = await getTeamData(team.teamNumber)
			
			let pitData = await getPitTeamData(team.teamNumber)
			
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
