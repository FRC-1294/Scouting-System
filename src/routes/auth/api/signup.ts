import { createSession, getUser } from "$lib/db";
import { serialize } from "cookie";

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function post({ body: { userName, password } }) {
    
    if (await getUser(userName)) {
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
             secure: process.env.NODE_ENV === 'production',
             maxAge: 60 * 60 * 24 * 7, // one week
         }),
     },
     body: {
         message: 'Successfully signed in',
     },
    };
}