import { destroySession } from '$lib/db';
import { parse, serialize } from 'cookie'

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get({locals}) {
    let ok = false;
    console.log("Nuking session")
    console.log(locals.session)
    console.log(locals.session.username)
    locals.session.destroy()
    console.log("Session nuked")
    console.log(locals.session)
    console.log(locals.session.username)
    if(!(locals.session ?? false)) {
        ok = true;
    }
    return { //TODO fix dis
     status: 200,
     body: {
         ok: ok
     }
    }
}