/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs#typescript
// for information about these interfaces

declare namespace App {
	interface Locals {}

	interface Platform {}

	interface Session {}

	interface Stuff {}

	interface ScoutedMatch {
		teamNumber: number;
		matchNumber: number;
		auto: boolean;
		cargo: {
			auto: number;
			teleop: number;
		};
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
		gotStuckOften: boolean;
		defense: boolean;
		itBroke: boolean;
		notes: string;
	}

	interface Match {
		matchNumber: number;
		red: number[];
		blue: number[];
		isCurrentMatch: boolean;
	}

	interface PitData {
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

	interface PitTeam {
		teamNumber: number;
		hasBeenPitScouted: boolean;
	}

	interface AggregatedTeamData {
		_id: number;
		defensePercent: number;
		reliablePercent: number;
		stuckPercent: number;
		averageCargoAuto: number;
		averageCargoTele: number;
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
	enum Climb {
		none, low, mid, high, traverse
	}

	interface Human {
		name: string,
		leaving1?: number,
		arriving1?: number,
		leaving2?: number,
		arriving2?: number,
		dayOne: boolean,
		dayTwo: boolean,
	}
	interface Shift {
		shiftNumber: number,
		day: number,
		r1: Human,
		r2: Human,
		r3: Human,
		b1: Human,
		b2: Human,
		b3: Human,
	}
}
