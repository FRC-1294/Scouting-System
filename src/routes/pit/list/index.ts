import type { RequestHandler } from '@sveltejs/kit';

export let get: RequestHandler = async function () {
	return {
		body: {}
	};
};
