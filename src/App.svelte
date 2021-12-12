<script>
	import { onMount, getContext, setContext } from 'svelte'

	import { Router, Link, Route } from 'svelte-routing'

	//Imports
	import Home from './home/Home.svelte'
	import Control from './control/Control.svelte'
	import Scout from './scout/Scout.svelte'
</script>

<main>
	<p>Pack Of Parts Scouting</p>
	<Router>
		<div>
			<Route path="scout" component={Scout} />
			<Route path="control" component={Control} />
			<Route path="/"><Home /></Route>
		</div>
	</Router>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}



	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
