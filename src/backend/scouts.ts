export class ScoutManager {
    /**
     *
     */
    constructor() {
        
    }
}

export class Scout {
    name: string
	id: string
	socketId: string
	status: 'connected' | 'disconnected' | 'scouting' | 'submit'
	isScouting: Boolean
	robotScouting: Number
}