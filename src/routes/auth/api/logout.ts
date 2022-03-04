import { parse, serialize } from 'cookie'
import type { RequestHandler } from '@sveltejs/kit';
/** @type {import('@sveltejs/kit').RequestHandler} */
export let get: RequestHandler = async function({locals}) {
    let ok = false;
    console.log("Nuking session")
    console.log(locals.session)
    console.log(locals.session.data.username ?? "No username")
    await locals.session.destroy()
    console.log("Session nuked")
    console.log(locals.session)
    console.log(locals.session.data.username ?? "No username")
    if(!(locals.session.data.username ?? false)) {
        ok = true;
    }
    return { //TODO fix dis
     status: 200,
     body: {
         ok: ok
     }
    }
}