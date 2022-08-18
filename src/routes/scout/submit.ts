//TODO
import { addNotesToDB, addScoutedDataToDB } from '$lib/db';
export async function post({ request }) {
	let body: App.ScoutedMatch = await request.json();
	
	await addScoutedDataToDB(body);
	await addNotesToDB([{notes: body.notes, matchNumber: body.matchNumber, teamNumber: body.teamNumber}])
	return {
		status: 200,
		body: {
			message: 'OK'
		}
	};
}
