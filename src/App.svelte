<script>
	export let name;
	import { onMount } from "svelte";
	import router from "page"

	import Home from './home/Home.svelte'
	import Control from './scout/Scout.svelte'
	import Scout from './scout/Scout.svelte'

	let page
	router('/', () => page = Home)
	router('/scout', () => page = Scout)
	router('/control', () => page = Control)

</script>

<main>
	<h1>Hello {name}!</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
	<svelte:component this={page} />
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>