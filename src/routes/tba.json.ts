import { importDataFromTheBlueAlliance } from "$lib/importFromTBA";
export async function get() {
    let data = await importDataFromTheBlueAlliance()
    console.log({data})
    return {
        body: data
    }
}