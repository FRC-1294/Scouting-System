import type { RequestEvent } from '@sveltejs/kit';
import { getHighlightedMatchNumber, updateHighlightedMatch } from '$lib/db';
export async function post({ request }) {
	let body = await request.json();
	console.log(body);
	await updateHighlightedMatch(body);
	return {
		status: 200,
		body: {
			message: 'OK'
		}
	};
}
export async function get({}) {
	let matchNum = await getHighlightedMatchNumber()
	return {
		body: {
			matchNumber: matchNum
		}
	}
}