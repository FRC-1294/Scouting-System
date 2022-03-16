import { getHighlightedMatchNumber, getMatches } from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';

export let get = async function () {
	let listOfMatches: App.Match[] = []
	listOfMatches = await getMatches(await getHighlightedMatchNumber());
	console.log(listOfMatches)
	return {
		body: {
			listOfMatches: listOfMatches
		}
	};
};
