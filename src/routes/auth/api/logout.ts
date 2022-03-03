import { destroySession } from '$lib/db';
import { parse, serialize } from 'cookie'

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get({ locals }) {
    locals.session.destroy()

    return { //TODO fix dis
     status: 302,
     headers: { Location: "/auth/login"}
    }
}