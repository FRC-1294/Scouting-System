import { createSession, createUser, doesUserExist, getUser } from '$lib/db';
import { hash } from '$lib/hash';
import { serialize } from 'cookie';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function post({ request }) {
	let { username, password, fullName } = await request.json();
	if (await doesUserExist(username)) {
		return {
			status: 401,
			body: {
				message: 'Username taken'
			}
		};
	}
	await createUser({
		username: username,
		passwordHash: hash(password),
		isAdmin: false,
		fullName: fullName
	});
	const id = await createSession(username);
	return {
		status: 200,
		headers: {
			'Set-Cookie': serialize('session_id', id, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				maxAge: 60 * 60 * 24 * 7 // one week
			})
		},
		body: {
			message: 'Successfully signed up'
		}
	};
}
