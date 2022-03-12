export async function get() {
	//Redirect the user if they go here without the required parameters.
	return {
		headers: { Location: '/scout/list' },
		status: 302
	};
}
