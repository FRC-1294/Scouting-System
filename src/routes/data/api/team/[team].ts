import { getListOfRobotsToPitScout, getTeamData } from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';

export let get = async function () {
	let data: App.AggregatedTeamData
	data = await getTeamData(1294)
	console.log(data)
	return {
		body: {
			data: data
		}
	};
};
