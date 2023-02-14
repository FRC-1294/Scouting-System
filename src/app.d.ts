/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs#typescript
// for information about these interfaces

declare namespace App {
	interface Locals {}

	interface Platform {}

	interface Session {}

	interface Stuff {}

	//
	// Match data
	//
	
	interface Match {
		matchNumber: number;
		red: number[];
		blue: number[];
	}

	//
	// Scouted data
	//
	interface ScoutedMatch {
		teamNumber: number;
		matchNumber: number;
		auto: {
			functioningAuto: boolean;
			moveOutOfZone: boolean;
			totalConesAuto: number;
			totalCubesAuto: number;

		}
		
		teleopCones: {
			upper: boolean;
			middle: boolean;
			bottom: boolean;
			totalConesTeleop: number;
			totalConesMissedTeleop: number;

		}

		teleopCubes: {
			upper: boolean;
			middle: boolean;
			bottom: boolean;
			totalCubesTeleop: number;
			totalCubesMissedTeleop: number;

		}

		other: {
			broke: boolean;
			defense: boolean;
			name: string;
			notes: string;
			
		}

	}

	interface ScoutedNotes {
		teamNumber: number;
		matchNumber: number;
		notes: string;
	}

	interface ScoutedPit {
		teamNumber: number;
		
		auto: {
			auto: boolean;
			conesAuto: number;
			cubesAuto: number;
			chargeStationAuto: boolean;
		}

		teleop: {
			conesTeleop: number;
			cubesTeleop: number;
			chargeStationTeleop: boolean;
		}
		
		mass: number;
		nodes: {
			upper: boolean;
			middle: boolean;
			lower: boolean;
		};
		
		
		//TODO Add images?
		strengths: string;
		weakness: string;
		comments: string;
	}

	//
	// Aggregated data
	//
	
	interface AggregatedTeamData {
		_id: number;
		defensePercent: number;
		reliablePercent: number;
		stuckPercent: number;
		averageConesAuto: number;
		averageCubesAuto: number;
		averageConesTeleop: number;
		averageCubesTeleop: number;
		
		averageMissedConesTeleop: number;
		averageMissedCubesTeleop: number;
		
		nodes: {
			upper: {
				can: boolean;
				percent: number;
			}
			middle: {
				can: boolean;
				percent: number;
			}
			
			lower: {
				can: boolean;
				percent: number;
			}
			
		}
	}

	interface AggregatedNotes {
		_id: number;
		commentsArray: string[];
		notes: string;
		
	}

	//
	// The Team type
	// This type is supposed to give you handy easy access to all the relevant data for a team, 
	// without re-computing aggregations every time.
	//

	interface Team {
		teamNumber: number;
		matchData: App.AggregatedTeamData;
		pitData: App.ScoutedPit;
		notes: App.AggregatedNotes;
	}

}
