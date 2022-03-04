import { serialize } from 'cookie';
import { getUser } from '$lib/db';
import { hash } from '$lib/hash';
import type { RequestHandler } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').RequestHandler} */
export let post: RequestHandler = async function ({ request, locals }) {
	console.log('Logging in lel');
	const body = await request.json();
	let username = body.username;
	let password = body.password;
	const user = await getUser(username);

	// ⚠️ CAUTION: Do not store a plain passwords. Use proper hashing and salting.
	if (!user || user.passwordHash !== hash(password)) {
		return {
			status: 401,
			body: {
				message: 'Incorrect user or password'
			}
		};
	}

	locals.session.data = user;
	return {
		status: 200,
		body: {
			message: 'Successfully signed in' //TODO redirect user to scout
		}
	};
};
