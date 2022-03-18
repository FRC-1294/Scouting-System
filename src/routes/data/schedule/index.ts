import { generateMatchSchedule } from "$lib/schedule";

export async function get() {
    return {
        body: await generateMatchSchedule(12)
    };
}