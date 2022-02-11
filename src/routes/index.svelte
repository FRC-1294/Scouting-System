<script context="module" lang="ts">
	
    export async function load({ session }) {
		return {
			props: {
				name: session.user
			}
		}
    }
</script>

<script lang="ts">
	import { page } from '$app/stores';
	import Counter from '$lib/Counter.svelte';

	
    export let name
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
		{name}
	</h1>

	<h1>
		<a sveltekit:prefetch href="/login">Login!</a>
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
