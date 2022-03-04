import { handleSession } from 'svelte-kit-cookie-session';
import type { GetSession } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').GetSession} */
export let getSession: GetSession = async function ({ locals }) {
	return locals.session.data;
};

export const handle = handleSession(
	{
		secret: 'Pl3AZ_D0onOT_StE4L_thiS3CR3T___it_imPorTantL0L'
	},
	({ event, resolve }) => {
		// event.locals is populated with the session `event.locals.session`
		// event.locals is also populated with all parsed cookies by handleSession, it would cause overhead to parse them again - `event.locals.cookies`.

		// Do anything you want here
		return resolve(event);
	}
);
