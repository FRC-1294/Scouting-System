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
		climb: boolean;
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
		defensePercent: number;
		reliablePercent: number;
		averageCargoAuto: number;
		averageCargoTele: number;
		maxClimb: Climb;
	}
	enum Climb {
		none, low, mid, high, traverse
	}

	interface Human {
		name: string,
		leaving?: number,
		arriving?: number
	}
	interface Shift {
		r1: Human,
		r2: Human,
		r3: Human,
		b1: Human,
		b2: Human,
		b3: Human,
	}
}
