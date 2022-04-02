
import { importEventTeamData } from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';
/** @type {import('@sveltejs/kit').RequestHandler} */
export let get: RequestHandler = async function () {
    let res;
    try {
        res = await importEventTeamData();
        console.log(res)        
    } catch (error) {
        return {
            status: 500,
            body: error
        }
    }
    return {
        status: 200,
        body: res
    }
}