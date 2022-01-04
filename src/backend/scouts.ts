export class ScoutManager {
    
}

export class Scout {
    name: string
	token: string
	socketId: string
	status: 'connected' | 'disconnected' | 'scouting' | 'submit'
	isScouting: Boolean
	robotScouting: Number
	/**
	 * Pings this scout, or shows an alert on the control screen
	 */
	public ping() {

    }
}

export type ScoutType = {
	name: string
	token: string
	socketId: string
	status: 'connected' | 'disconnected' | 'scouting' | 'submit'
	isScouting: Boolean
	robotScouting: Number
}
