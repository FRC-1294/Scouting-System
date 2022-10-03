import { getEndMatchNumber, getHighlightedMatchNumber, getMatches } from "$lib/db";

export let get = async function ({params}) {
	let listOfMatches: App.Match[] = await getMatches();
	return {
		body: {
			match: listOfMatches.find(match => match.matchNumber == params.match)
		}
	};
};
