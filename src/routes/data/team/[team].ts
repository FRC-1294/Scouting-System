import { getListOfAllTeams, getPitTeamData, getTeamData, getTeamNotes } from '$lib/db';

export let get = async function ({params}) {
	let team: App.PitTeam = {
		teamNumber: params.team,
		hasBeenPitScouted: false
	}
	let aggData = await getTeamData(team.teamNumber)
			
			let pitData = await getPitTeamData(team.teamNumber)
			
			let notes = await getTeamNotes(team.teamNumber)

	let finishedData: App.CompleteTeamData = {teamNumber: team.teamNumber, notes: notes, MatchData: aggData, PitData: pitData, red: false}
	return {
		body: {
			data: finishedData
			
		}
	};
};
