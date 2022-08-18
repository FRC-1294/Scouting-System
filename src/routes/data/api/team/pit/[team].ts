import { getListOfAllTeams, getPitTeamData, getTeamData } from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';

export let get = async function ({params}) {
	let data: App.ScoutedPit
	data = await getPitTeamData(Number(params.team))
	return {
		body: {
			data: data
		}
	};
};
