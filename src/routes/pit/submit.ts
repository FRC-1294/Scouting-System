//TODO
import type { RequestEvent } from '@sveltejs/kit';
import { addPitDataToDB } from '$lib/db';
export async function post({ request }) {
	let body = await request.json();
	
	await addPitDataToDB(body);
	return {
		status: 200,
		body: {
			message: 'OK'
		}
	};
}
