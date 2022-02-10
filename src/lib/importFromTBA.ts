export async function importDataFromTheBlueAlliance(): Promise<App.MatchData[]> {
    let ParsedMatches:App.MatchData[] = []
    const url = "https://www.thebluealliance.com/api/v3/event/2016nytr/matches/simple"
    const res = await fetch(url)
    const json = await res.json()
    json.forEach((match: {
        //This is the schema that every imported match conforms to
        match_number: number,
        alliances: {
            red: {
                team_keys: string[] //The team keys will be in the format "frc1294" , with the team number after "frc". Extract the number to push to the array
            },
            blue: {
                team_keys: string[]
            }
        }
    }) => {
        ParsedMatches.push({
            //Your code here! Parse each match object into the correct format:
            /*
                {
		matchNumber: number,
		red: number[],
		blue: number[]
	}
            */


    
        })
    })
    return ParsedMatches
}