/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs#typescript
// for information about these interfaces
declare namespace App {
	interface Locals {
		user: StoredSession
	}

	interface Platform {}

	interface Session {
			username: string,
			fullName: string,
			isAdmin: boolean
	}

	interface StoredSession {
		username: string,
		sessionId: string
	}

	interface Stuff {}

	interface ScoutedMatch {
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

	interface Match {
		matchNumber: number,
		red: number[],
		blue: number[]
	}

	interface Event {
		matches: Match[]
	}

	interface StoredUser extends Session {
		passwordHash: string
	}

	interface PitData {
		teamNumber: number,
		auto: boolean,
		cargoAuto: number,
		reliability: number,
		climb: boolean,
		//TODO Add images?
		strengths: string,
		weakness: string,
		comments: string,
	}
}
