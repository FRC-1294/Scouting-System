import { getListOfRobotsToPitScout, getPitTeamData, getTeamData } from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';

export let get = async function ({params}) {
	let data: App.PitData
	console.log("Pit Data: " + Number(params.team))
	data = await getPitTeamData(Number(params.team))
	console.log(data)
	return {
		body: {
			data: data
		}
	};
};
