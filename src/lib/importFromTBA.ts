export async function importDataFromTheBlueAlliance(): Promise<App.MatchData[]> {
    let ParsedMatches:App.MatchData[] = []
    const url = "https://www.thebluealliance.com/api/v3/event/2016nytr/matches/simple"
    const apiKey = "8bTwcesd937ossCd8CfaKvrLeZ8djZiCl6ghmOWKjALLZqk59IpxpfQB5kkKY2kG"
    const res = await fetch(url, {headers: {"X-TBA-Auth-Key": apiKey}})
    const APIResult = await res.json()
    console.log(APIResult)
    APIResult.forEach((match: {
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
        let redKeys: number[] = []
        let blueKeys: number[] = []
        match.alliances.red.team_keys.forEach((teamString:string) => {
            redKeys.push(Number(teamString.substring(3)))
        })
        match.alliances.blue.team_keys.forEach((teamString:string) => {
            blueKeys.push(Number(teamString.substring(3)))
        })
        ParsedMatches.push({
            matchNumber: match.match_number,
            red: redKeys,
            blue: blueKeys
        })
    })
    return ParsedMatches
}