import { getEndMatchNumber, getHighlightedMatchNumber, getMatches } from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';

export let get = async function () {
	let listOfMatches: App.Match[] = []
	const highlightedMatchNumber = await getHighlightedMatchNumber();
	const endMatchNumber = await getEndMatchNumber();
	listOfMatches = await getMatches();
	return {
		body: {
			listOfMatches: listOfMatches,
			currentMatchNumber: highlightedMatchNumber,
			endMatchNumber: endMatchNumber
		}
	};
};
