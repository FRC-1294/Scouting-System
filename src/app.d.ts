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
		auto: boolean;
		cargo: {
			auto: number;
			teleop: number;
			missed: number;
		};
		swimDistance: number;
		hub: {
			upper: boolean;
			lower: boolean;
		};
		climb: {
			low: boolean;
			mid: boolean;
			high: boolean;
			traverse: boolean;
		}
		defense: boolean;
		itBroke: boolean;
		name: string;
		notes: string;
	}

	interface ScoutedNotes {
		teamNumber: number;
		matchNumber: number;
		notes: string;
	}

	interface ScoutedPit {
		teamNumber: number;
		auto: boolean;
		cargoAuto: number;
		hub: {
			upper: boolean;
			lower: boolean;
		};
		reliability: number;
		climb: number;
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
		averageCargoAuto: number;
		averageCargoTele: number;
		averageMissedCargo: number;
		climb: {
			low: {
				can: boolean;
				percent: number;
			}
			mid: {
				can: boolean;
				percent: number;
			}
			high: {
				can: boolean;
				percent: number;
			}
			traverse: {
				can: boolean;
				percent: number;
			}
		}
		hub: {
			lower: {
				can: boolean;
				percent: number;
			}			
			upper: {
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
	};

}
