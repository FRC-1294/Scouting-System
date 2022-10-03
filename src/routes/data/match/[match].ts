import { getListOfAllTeams, getMatches, getPitTeamData, getTeamData, getTeamNotes } from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';



export let get = async function ({params}): Promise<{
	body: {
		redData: App.Team[];
		blueData: App.Team[];
	};
}> {
	
	let redOutput:App.Team[]  = [];
	let blueOutput:App.Team[] = [];
	let MatchData = (await getMatches()).find(item => item.matchNumber == params.match);


	let teams = (await getListOfAllTeams())
	

	for (let i = 0; i < teams.length; i++) {
		const team = teams[i];
		if(MatchData.blue.includes(team.teamNumber)) {
	
			
			let aggData = await getTeamData(team.teamNumber)
			
			let pitData = await getPitTeamData(team.teamNumber)
			
			let notes = await getTeamNotes(team.teamNumber)
			blueOutput.push({teamNumber: team.teamNumber, notes: notes, matchData: aggData, pitData: pitData})
		}
		
	}

	for (let i = 0; i < teams.length; i++) {
		const team = teams[i];
		if(MatchData.red.includes(team.teamNumber)) {
	
			
			let aggData = await getTeamData(team.teamNumber)
			
			let pitData = await getPitTeamData(team.teamNumber)
			
			let notes = await getTeamNotes(team.teamNumber)
			redOutput.push({teamNumber: team.teamNumber, notes: notes, matchData: aggData, pitData: pitData})
		}
		
	}
	return {
		body: {
			redData: redOutput,
			blueData: blueOutput
		}
	};
};
