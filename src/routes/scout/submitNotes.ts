//TODO
import type { RequestEvent } from '@sveltejs/kit';
import { addNotesToDB, addScoutedDataToDB } from '$lib/db';
export async function post({ request }) {
	let body = await request.json();
	
	await addNotesToDB(body);
	return {
		status: 200,
		body: {
			message: 'OK'
		}
	};
}
