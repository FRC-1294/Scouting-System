<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	export const load: Load = async (obj) => {
		console.log(obj.session);
		if (!obj.session) {
			return {
				status: 302,
				redirect: '/auth/login'
			};
		}
		return {};
	};
</script>

<script lang="ts">
	import { session } from '$app/stores';
	import Counter from '$lib/Counter.svelte';
	let sessName = $session.fullName;
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
	<h1>
		<div class="welcome">
			<picture>
				<img src="svelte-welcome.png" alt="Welcome" />
			</picture>
		</div>

		to the scouting system!
		{sessName}
	</h1>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>
