export async function get() {
	//Redirect the user if they go here without the required parameters.
	return {
		headers: { Location: '/pit/list' },
		status: 302
	};
}
