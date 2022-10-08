
import { aggregate, importEventMatchData } from '$lib/db';
import fs from "fs"
import path from "path"
import type { RequestHandler } from '@sveltejs/kit';
/** @type {import('@sveltejs/kit').RequestHandler} */
export let get: RequestHandler = async function () {
    console.log("Exporting CSV")
    let res: App.AggregatedTeamData[];
    let csvName = `${Math.round(new Date().getTime() / 1000)}.csv`

    //Get CSV Path
    

    console.log("H " + csvName)
    try {
        res = await aggregate();
        console.log(res)
        fs.appendFileSync("./static/export/" + csvName, "Team Number, Average Cargo Auto, Average Cargo Teleop, Average Missed cargo, Climb low, Climb mid, Climb high, Climb traverse, Defense %, Lower hub, upper hub, reliable %, stuck %\r\n")
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        res.forEach((t: App.AggregatedTeamData) => {
            let string = `${t._id},${t.averageCargoAuto},${t.averageCargoTele},${t.averageMissedCargo},${t.climb.low.percent},${t.climb.mid.percent},${t.climb.high.percent},${t.climb.traverse.percent},${t.defensePercent},${t.hub.lower.percent},${t.hub.upper.percent},${t.reliablePercent},${t.stuckPercent}\r\n`
            console.log(string)
            fs.appendFileSync("./static/export/" + csvName, string)
        });
    } catch (error) {
        return {
            status: 500,
            body: error
        }
    }
    return {
        status: 302,
        body: "ok",
        headers: {
            location: "/export/" + csvName
        }
    }
}