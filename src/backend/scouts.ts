export class ScoutManager {
    /**
     *
     */
    constructor() {
        
    }
}

export type Scout = {
    name: string
	token: string
	socketId: string
	status: 'connected' | 'disconnected' | 'scouting' | 'submit'
	isScouting: Boolean
	robotScouting: Number
}