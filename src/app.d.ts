/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs#typescript
// for information about these interfaces

interface SessionData {
	// Your session data
	username: string;
	fullName: string;
	isAdmin: boolean;
}

declare namespace App {
	interface Locals {
		session: import('svelte-kit-cookie-session').Session<SessionData>;
		cookies: Record<string, string>; // all parsed cookies are automatically set from handleSession to avoid overhead
	}

	interface Platform {}

	interface Session extends SessionData {}

	interface StoredSession {
		username: string;
		sessionId: string;
	}

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
		efficient: boolean;
		notes: string;
	}

	interface Match {
		matchNumber: number;
		red: number[];
		blue: number[];
	}

	interface Event {
		key: string;
		matches: Match[];
		teams: number[];
	}

	interface StoredUser extends Session {
		passwordHash: string;
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
		hasBeenScouted: boolean;
	}
}
