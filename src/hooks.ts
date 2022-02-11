import {parse} from 'cookie'
import { retreiveSession } from '$lib/db'
import type {RequestEvent} from '@sveltejs/kit'

/** @type {Handle} */
export async function handle({ event, resolve }) {
	console.log("\nREQUEST\n")
	console.log(JSON.stringify(event.request.headers.get("cookie")))
    const cookies = parse(event.request.headers.get("cookie") || '')
    if (cookies.session_id) {
     const session = await retreiveSession(cookies.session_id)
     if (session) {
		 console.log(session)
         event.locals.user = { username: session.username, isAdmin: session.isAdmin, fullName: session.fullName }
		 console.log(event.locals.user)
         return resolve(event)
     }
    }

    event.locals.user = "Not signed in"
    return resolve(event)
}

export async function getSession(event: RequestEvent) {
	let out: App.Session = {
			// only include properties needed client-side —
			// exclude anything else attached to the user
			// like access tokens etc
			username: event.locals.user.username,
			fullName: event.locals.user.fullName,
			isAdmin: event.locals.user.isAdmin
		
  }
	return out
}