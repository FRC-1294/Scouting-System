<script>
	import { onMount, getContext, setContext } from 'svelte'

	import { Router, Link, Route } from 'svelte-routing'

	//Imports
	import Home from './home/Home.svelte'
	import Control from './control/Control.svelte'
	import Scout from './scout/Scout.svelte'
	import Email from './email login/Email.svelte'
</script>

<main>
	<div style="height: 100px; width: 100%;">
		<header>
			<image src="/logo.png" height="100px" width="100px" align="center"/>
		</header>
	</div>
	<p>Pack Of Parts Scouting</p>
	<Router>
		<div>
			<Route path="/" component={Home} />
			<Route path="control" component={Control} />
			<Route path="/scout"><Scout /></Route>
			<Route path='/email'><Email /></Route>
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
