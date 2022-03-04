<script>
	import SignInForm from 'OLD/Example form/SignInForm.svelte';

	let error;

	async function handleSubmit({ detail: { username, password } }) {
		const response = await fetch('/auth/api/login', {
			method: 'POST',
			body: JSON.stringify({ username, password }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			error = (await response.json()).message;
			return;
		}

		// @ts-ignore
		window.location = '/';
	}
</script>

<h1 class="text-2xl font-semibold text-center">Sign In</h1>
{#if error}
	<p class="mt-3 text-red-500 text-center font-semibold">{error}</p>
{/if}
<SignInForm class="max-w-xl mx-auto mt-8" on:submit={handleSubmit} />
