/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs#typescript
// for information about these interfaces
declare namespace App {
	interface Locals {
		userid: string;
	}

	interface Platform {}

	interface Session {}

	interface Stuff {}

	interface ScoutData {
		teamNumber: number,
		matchNumber: number,
		auto: boolean,
		cargo: {
			auto: number,
			teleop: number
		},
		hub: {
			upper: boolean,
			lower: boolean
		}
		efficient: boolean,
		notes: string
	}

	interface MatchData {
		matchNumber: number,
		red: number[],
		blue: number[]
	}

	interface EventData {
		matches: MatchData[]
	}

	interface UserData {
		userName: string,
		name: string,
		passwordHash: string,
		token: string
	}
}
