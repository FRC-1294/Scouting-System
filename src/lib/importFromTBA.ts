export async function importDataFromTheBlueAlliance(): Promise<{
	matches: App.Match[];
	teams: App.PitTeam[];
}> {
	console.log('Importing data!');
	let eventKey = '2019wasno';
	//Outputs
	let parsedMatches: App.Match[] = [];
	let parsedTeams: App.PitTeam[] = [];

	//URLs
	const matchesUrl = `https://www.thebluealliance.com/api/v3/event/${eventKey}/matches/simple`;
	const teamsUrl = `https://www.thebluealliance.com/api/v3/event/${eventKey}/teams/simple`;

	const apiKey = '8bTwcesd937ossCd8CfaKvrLeZ8djZiCl6ghmOWKjALLZqk59IpxpfQB5kkKY2kG';

	//Invoke fetch
	const matchesRes = fetch(matchesUrl, { headers: { 'X-TBA-Auth-Key': apiKey } });
	const teamsRes = fetch(teamsUrl, { headers: { 'X-TBA-Auth-Key': apiKey } });

	//Matches
	const matchesAPIResult = await (await matchesRes).json();
	console.log(matchesAPIResult);
	(await matchesAPIResult).forEach(
		(match: {
			//This is the schema that every imported match conforms to
			match_number: number;
			alliances: {
				red: {
					team_keys: string[]; //The team keys will be in the format "frc1294" , with the team number after "frc". Extract the number to push to the array
				};
				blue: {
					team_keys: string[];
				};
			};
			comp_level: string;
		}) => {
			if (match.comp_level == 'qm') {
				//Only process a match if it's a qualifying match
				let redKeys: number[] = [];
				let blueKeys: number[] = [];
				match.alliances.red.team_keys.forEach((teamString: string) => {
					redKeys.push(Number(teamString.substring(3)));
				});
				match.alliances.blue.team_keys.forEach((teamString: string) => {
					blueKeys.push(Number(teamString.substring(3)));
				});
				parsedMatches.push({
					matchNumber: match.match_number,
					red: redKeys,
					blue: blueKeys,
					isCurrentMatch: false
				});
			}
		}
	);

	//Teams
	const teamsAPIResult = await (await teamsRes).json();
	console.log(teamsAPIResult);
	(await teamsAPIResult).forEach(
		(team: {
			//Team object from TBA
			key: string;
			nickname: string;
			team_number: number;
		}) => {
			parsedTeams.push({teamNumber: team.team_number, hasBeenPitScouted: false});
		}
	);

	//Return
	return {
		matches: parsedMatches,
		teams: parsedTeams
	};
}
