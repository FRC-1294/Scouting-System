import { getEndMatchNumber, getHighlightedMatchNumber, getMatches } from "$lib/db";

export let get = async function ({params}) {
	let listOfMatches: App.Match[] = []
	const highlightedMatchNumber = await getHighlightedMatchNumber();
	const endMatchNumber = await getEndMatchNumber();
	listOfMatches = await getMatches(highlightedMatchNumber);
	return {
		body: {
			match: listOfMatches.find(match => match.matchNumber == params.match)
		}
	};
};
