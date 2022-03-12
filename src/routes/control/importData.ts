
import { importEventData } from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';
/** @type {import('@sveltejs/kit').RequestHandler} */
export let get: RequestHandler = async function () {
    let res = await importEventData();
    console.log(res)
    return {
        status: 200,
        body: res
    }
}