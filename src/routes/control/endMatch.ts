import type { RequestEvent } from '@sveltejs/kit';
import { getEndMatchNumber, getHighlightedMatchNumber, updateEndingMatch } from '$lib/db';
export async function post({ request }) {
	let body = await request.json();
	console.log("End: " + body);
	await updateEndingMatch(body);
	return {
		status: 200,
		body: {
			message: 'OK'
		}
	};
}
export async function get({}) {
	let matchNum = await getEndMatchNumber()
	return {
		body: {
			matchNumber: matchNum
		}
	}
}