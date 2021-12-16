<script>
	import { io } from 'socket.io-client'
	import ScoutWtokenget from './ScoutWidget.svelte'

	var socket = io('/admin')

	//AUTH
	let isLoggedIn
	let password
	let token = localStorage.getItem('token') ?? undefined
	if (token) {
		//TODOCOMP this is hacky, fix
		password = token
		login()
	}
	function login() {
		socket.emit('login', password, (ack) => {
			if (ack.loggedIn) {
				token = ack.token
				localStorage.setItem('token', ack.token)
				isLoggedIn = true
			} else {
				//Clear the token from storage if it's invalid
				localStorage.setItem('token', '')
				password = ""
			}
		})
	}

	let scouts = []
	socket.on('scouts', (newScouts) => {
		scouts = newScouts
	})
	let isAdmin = false
	socket.on('connect', () => {
		isAdmin = true
	})

	//Match setup
	let matchNumberToSetUp = 0
	let robotNumberToSetup = 0
	function setupMatch() {
		socket.emit('setupMatch', matchNumberToSetUp, robotNumberToSetup)
	}

	//Kick a scout off
	function kickOff(token) {
		socket.emit('boot', token)
	}

	//Disconnect
	socket.on("disconnect", () => {
		alert("You got disconnected. Oh no!")
		//TODOCOMP Deal with disconnect
	})

	//Aggregate
	let aggResult
	function aggregateData() {
		socket.emit('aggregate', (result) => {
			aggResult = JSON.stringify(result)
		})
	}
</script>

<main>
	<style>
		body {
			background-color: #ffffff;
		}
	</style>

	<h1>ADMIN</h1>
	{#if !isLoggedIn}
		<input bind:value={password} placeholder="Password" type="password" />
		<button on:click={login}>Login</button>
	{:else}
		<input bind:value={matchNumberToSetUp} placeholder="Match"/>
		<input bind:value={robotNumberToSetup} placeholder="Robot"/>
		<button on:click={setupMatch}>Scout us!</button> <br>
		
		<br>
		<button on:click={aggregateData}>Aggregate data </button> <br>
		<p>{aggResult}</p>
		<br>

		<button
			on:click={() => {
				socket.emit('endMatch')
			}}>End Match</button
		>
		<br />
		{#each scouts as thisScout}
			<ScoutWtokenget scout={thisScout} boot={kickOff} />
		{/each}
	{/if}
</main>
