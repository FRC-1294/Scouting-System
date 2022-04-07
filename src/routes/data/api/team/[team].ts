import { getListOfAllTeams, getTeamData, getTeamNotes } from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';

export let get = async function ({params}) {
	let data: App.AggregatedTeamData
	console.log("Data")
	data = await getTeamData(Number(params.team))
	let notes = data.notes
	notes += ", " + (await getTeamNotes(Number(params.team)))
	console.log("Notes " + notes)

	console.log(data)
	return {
		body: {
			data: data
		}
	};
};
