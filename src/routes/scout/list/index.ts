import { getListOfRobotsToPitScout, getMatches } from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';

export let get = async function () {
	let listOfMatches: App.Match[] = []
	console.log("hecc")
	listOfMatches = await getMatches()
	console.log(listOfMatches)
	return {
		body: {
			listOfMatches: listOfMatches
		}
	};
};
