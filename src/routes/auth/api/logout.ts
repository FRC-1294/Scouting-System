import { destroySession } from '$lib/db';
import { parse, serialize } from 'cookie'

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get({ request }) {
    const cookies = parse(request.headers.get("cookie") || '');

    if (cookies.session_id) {
     await destroySession(cookies.session_id);
    }

    return { //TODO fix dis
     status: 200,
     headers: {
         'Set-Cookie': serialize('session_id', '', {
             path: '/',
             expires: new Date(0),
         })
     }
    }
}