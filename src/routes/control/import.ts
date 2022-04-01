import { matchDataHasBeenImported, teamDataHasBeenImported } from "$lib/db";

export let get = async function (): Promise<{
	body: {
		canImportMatch: boolean;
        canImportTeam: boolean;
	};
}> {
    let canImportMatch = !(await matchDataHasBeenImported());
    let canImportTeam = !(await teamDataHasBeenImported());
    return {
        body: {
            canImportMatch: canImportMatch,
            canImportTeam: canImportTeam
        }
    }
}