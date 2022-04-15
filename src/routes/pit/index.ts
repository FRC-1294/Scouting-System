import { getListOfAllTeams } from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';

export let get = async function () {
	let listOfTeams: App.PitTeam[] = []
	listOfTeams = await getListOfAllTeams()
	
	return {
		body: {
			listOfTeams: listOfTeams
		}
	};
};
