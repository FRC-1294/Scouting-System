import { serialize } from 'cookie'
import { createSession, getUser } from '$lib/db';
import { hash } from '$lib/hash';
import type { RequestEvent } from '@sveltejs/kit';


/** @type {import('@sveltejs/kit').RequestHandler} */
export async function post({request}) {
    const body = await request.json()
    let userName = body.userName
    let password = body.password
    const user = await getUser(userName);

    // ⚠️ CAUTION: Do not store a plain passwords. Use proper hashing and salting.
    if (!user || user.passwordHash !== hash(password)) {
     return {
         status: 401,
         body: {
             message: 'Incorrect user or password',
         },
     };
    }

    const id = await createSession(userName);
    return {
     status: 200,
     headers: {
         'Set-Cookie': serialize('session_id', id, {
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