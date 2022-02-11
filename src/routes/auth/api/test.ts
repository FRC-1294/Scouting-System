import { serialize } from 'cookie'
import { createSession, getUser } from '$lib/db';
import { hash } from '$lib/hash';


/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get({request}) {
    return {
     status: 200,
     headers: {
         'Set-Cookie': serialize('session_id', "76d1a4fec4d15c7d4fbce774db7ae3", {
             path: '/',
             httpOnly: true,
             sameSite: 'strict',
             maxAge: 60 * 60 * 24 * 7, // one week
         }),
     },
     body: {
         message: 'Successfully signed in', //TODO redirect user to scout
     },
    };
}