import {parse} from 'cookie'
import { v4 as uuid } from '@lukeed/uuid'
import type { Handle, RequestEvent } from '@sveltejs/kit'
import { getSession } from '$lib/db'

/** @type {Handle} */
export async function handle({ event, resolve }) {
    const cookies = parse(event.request.headers.cookie || '')

    if (cookies.session_id) {
     const session = await getSession(cookies.session_id)
     if (session) {
         (event as RequestEvent).locals.user = { userName: session.userName, isAdmin: session.isAdmin }
         return resolve(event)
     }
    }

    event.locals.user = "Not signed in"
    return resolve(event)
}