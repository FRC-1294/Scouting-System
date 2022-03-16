import { getListOfRobotsToPitScout } from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';

export let get = async function () {
	let listOfTeams: App.PitTeam[] = []
	listOfTeams = await getListOfRobotsToPitScout()
	console.log(listOfTeams)
	return {
		body: {
			listOfTeams: listOfTeams
		}
	};
};
