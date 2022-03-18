import { addScheduleToDB } from "$lib/db";
import { generateScoutSchedule } from "$lib/schedule";

export async function get() {
    let schedule = await generateScoutSchedule(12, 4)
    addScheduleToDB(schedule)
    return {
        body: schedule
    };
}