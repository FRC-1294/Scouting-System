export async function importDataFromTheBlueAlliance() {
    let ParsedMatches:App.MatchData[] = []
    const url = "https://www.thebluealliance.com/api/v3/event/2016nytr/matches/simple"
    const res = await fetch(url)
    const json = await res.json()
    json.forEach((match: {
        //This is the schema that every match conforms to
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

        })
    })
}