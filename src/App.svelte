<script>
	export let url;
	import { onMount, getContext, setContext } from "svelte";

	import { Router, Link, Route } from "svelte-routing"

	//Imports
	import Home from './home/Home.svelte'
	import Control from './control/Control.svelte'
	import Scout from './scout/Scout.svelte'

	/*
	//Routing
	let page
	router('/', () => page = Home)
	router('/scout', () => page = Scout)
	router('/control', () => page = Control)

	//No touchy
	//router('*', () => page = PageNotFound)
	router.start()

	setContext('router', router)
*/
</script>

<main>
	<Router url="{url}">
		<nav>
		  <Link to="/">Home</Link>
		  <Link to="scout">Scout</Link>
		  <Link to="control">Control</Link>
		</nav>
		<div>
		  <Route path="scout" component="{Scout}" />
		  <Route path="control" component="{Control}" />
		  <Route path="/"><Home /></Route>
		</div>
	  </Router>
</main>

<!--
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
-->