import { databaseMan } from '../../server';

export class ScoutManager {
	/**
	 * logs in a user, creating them if they don't exist
	 */
	public login(id: number, isDiscord: boolean) {
		if (databaseMan.doesUserExist(id)) {
			//TODO
		} else {
			databaseMan.createUser({ id: id, isDiscord: isDiscord });
		}
	}
}

export class User {
	name: string;
	socketId: string;
	status: 'connected' | 'disconnected' | 'scouting' | 'submit';
	isScouting: Boolean;
	robotScouting: Number;
	isDiscord: Boolean;
	discordId: Number; //-1 if none
	/**
	 * Pings this scout, or shows an alert on the control screen
	 */
	public ping() {
		if (this.isDiscord) {
			if (this.discordId > 0) {
				//TODO ping admin
			} else {
				//Only way to get here is if isDiscord is true and discordId is <= 0
				//TODO throw error
			}
		} else {
			//TODO discord ping
		}
	}
}

export type ScoutType = {
	name: string;
	socketId: string;
	status: 'connected' | 'disconnected' | 'scouting' | 'submit';
	isScouting: Boolean;
	robotScouting: Number;
};
