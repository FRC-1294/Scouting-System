<script>

	import { onMount, getContext, setContext } from "svelte";
	import router from "page"

	//Imports
	import Home from './home/Home.svelte'
	import Control from './control/Control.svelte'
	import Scout from './scout/Scout.svelte'
	import PageNotFound from './oh no/PageNotFound.svelte'

	//Routing
	let page
	router('/', () => page = Home)
	router('/scout', () => page = Scout)
	router('/control', () => page = Control)

	//No touchy
	//router('*', () => page = PageNotFound)
	router.start()

	setContext('router', router)

</script>

<main>
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