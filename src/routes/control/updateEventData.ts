import type { RequestEvent } from '@sveltejs/kit';
import { updateHighlightedMatch } from '$lib/db';
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
