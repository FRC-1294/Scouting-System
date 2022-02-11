/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs#typescript
// for information about these interfaces
declare namespace App {
	interface Locals {
		user: {
			username: string,
			fullName: string,
			isAdmin: boolean
		}
	}

	interface Platform {}

	interface Session {
			username: string,
			fullName: string,
			isAdmin: boolean
	}

	interface StoredSession {
		username: string,
		fullName: string,
		isAdmin: boolean,
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

	interface User {
		username: string,
		fullName: string,
		passwordHash: string,
		isAdmin: boolean
	}
}
