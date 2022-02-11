import {parse} from 'cookie'
import { v4 as uuid } from '@lukeed/uuid'
import { Handle, RequestEvent } from '@sveltejs/kit'
import { retreiveSession } from '$lib/db'

/** @type {Handle} */
export async function handle({ event, resolve }) {
    const cookies = parse(event.request.headers.cookie || '')

    if (cookies.session_id) {
     const session = await retreiveSession(cookies.session_id)
     if (session) {
         (event as RequestEvent).locals.user = { userName: session.user.userName, isAdmin: session.user.isAdmin, fullName: session.user.fullName }
         return resolve(event)
     }
    }

    event.locals.user = "Not signed in"
    return resolve(event)
}

export async function getSession(event: RequestEvent) {
	return event.locals.user
		? {
				user: {
					// only include properties needed client-side —
					// exclude anything else attached to the user
					// like access tokens etc
					userName: event.locals.user.userName,
					fullName: event.locals.user.fullName,
					isAdmin: event.locals.user.isAdmin
				}
		  }
		: {}
}