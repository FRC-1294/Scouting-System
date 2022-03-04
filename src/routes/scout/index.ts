export async function get() {
	//Redirect the user if they go here without the required parameters.
	return {
		headers: { Location: '/' },
		status: 302
	};
}
