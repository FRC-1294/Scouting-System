import { getListOfAllTeams, getPitTeamData, getTeamData, getTeamNotes } from '$lib/db';

export let get = async function ({params}) {
	let aggData = await getTeamData(params.team)
			
			let pitData = await getPitTeamData(params.team)
			
			let notes = await getTeamNotes(params.team)

	let finishedData: App.Team = {teamNumber: params.team, notes: notes, matchData: aggData, pitData: pitData}
	return {
		body: {
			data: finishedData
			
		}
	};
};
