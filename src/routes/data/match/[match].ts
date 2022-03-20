import { getListOfRobotsToPitScout, getMatches, getPitTeamData, getTeamData } from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';

export let get = async function ({params}): Promise<{
	body: {
		DATA: {
			MatchData: App.AggregatedTeamData;
			PitData: App.PitData;
		}[];
	};
}> {
	console.log("Match!")
	let output: {
		MatchData: App.AggregatedTeamData;
		PitData: App.PitData;
		red: boolean;
	}[] = [];
	let MatchData = (await getMatches()).find(item => item.matchNumber == params.match);


	let teams = (await getListOfRobotsToPitScout())

	for (let i = 0; i < teams.length; i++) {
		const team = teams[i];
		if(MatchData.blue.includes(team.teamNumber) || MatchData.red.includes(team.teamNumber)) {
	
			console.log(team.teamNumber)
			let aggData = await getTeamData(team.teamNumber)
			console.log(aggData)
			let pitData = await getPitTeamData(team.teamNumber)
			console.log(pitData)
			output.push({MatchData: aggData, PitData: pitData, red: MatchData.red.includes(team.teamNumber)})
		}
		
	}

	console.log("Hecc")
	console.log(output)
	return {
		body: {
			DATA: output
		}
	};
};
