const apiKey = 'TFboZkPpil9R9KYurh3CsBQzzVJIHUJ6ObjvjadlN3jWo9m8p5Dq0WTIcRSsd5lA';
let eventKey = '2022wagg';

export async function importMatchDataFromTheBlueAlliance(): Promise<App.Match[]> {
	
	//Outputs
	let parsedMatches: App.Match[] = [];

	const matchesUrl = `https://www.thebluealliance.com/api/v3/event/${eventKey}/matches/simple`;
	
	const matchesRes = fetch(matchesUrl, { headers: { 'X-TBA-Auth-Key': apiKey } });

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
					blue: blueKeys
				});
			}
		}
	);



	return parsedMatches;
}


export async function importTeamDataFromTheBlueAlliance(): Promise<App.Team[]> {

	let parsedTeams: App.Team[] = [];

	const teamsUrl = `https://www.thebluealliance.com/api/v3/event/${eventKey}/teams/simple`;

	const teamsRes = fetch(teamsUrl, { headers: { 'X-TBA-Auth-Key': apiKey } });

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
			parsedTeams.push({teamNumber: team.team_number, matchData: null, notes: null, pitData: null});
		}
	);

	return parsedTeams;
}