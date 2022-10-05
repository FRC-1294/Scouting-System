import { getListOfAllTeams, getPitTeamData, getTeamData, getTeamNotes } from '$lib/db';

export let get = async function ({params}) {
	let teamNumber = Number(params.team)
	let aggData = await getTeamData(teamNumber)
			
	let pitData = await getPitTeamData(teamNumber)
			
	let notes = await getTeamNotes(teamNumber)

	let finishedData: App.Team = {teamNumber: teamNumber, notes: notes, matchData: aggData, pitData: pitData}
	return {
		body: {
			data: finishedData
			
		}
	};
};
