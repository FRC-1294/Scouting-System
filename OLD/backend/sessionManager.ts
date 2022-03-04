export class SessionManager {
	/**
	 * logout
	 * Logs out a user by their ID
	 * @param {Number} id The ID of the user to logout
	 */
	public logout(id: Number) {
		//TODO
	}

	/**
	 * login
	 * Log in a user
	 * @param {Number} id The ID of the user
	 * @returns {string} The session token to store on the server
	 */
	public login(id: Number): string {
		//TODO
		return '';
	}

	/**
	 * isUserLoggedIn
	 * Checks if a user is logged in by their ID and token
	 * @param {Number} id The ID of a user
	 * @param {string} token The token the user or browser sent
	 */
	public isUserLoggedIn(id: Number, token: string) {
		//TODO
	}
}
