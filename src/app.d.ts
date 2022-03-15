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
		gotStuckOften: boolean;
		notes: string;
	}

	interface Match {
		matchNumber: number;
		red: number[];
		blue: number[];
		isCurrentMatch: boolean;
	}

	interface Event {
		key: string;
		matches: Match[];
		teams: PitTeam[];
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

	interface EventInfo {
		key: string,
		nextMatchNumber: number
	}
}
