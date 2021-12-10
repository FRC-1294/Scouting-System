<script>
	import { io } from 'socket.io-client'
	import ScoutWtokenget from './ScoutWidget.svelte'

	var socket = io('http://localhost:4000/admin')

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
	function setupMatch() {
		socket.emit('setupMatch', matchNumberToSetUp)
	}

	//Kick a scout off
	function kickOff(token) {
		socket.emit('boot', token)
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
		<input bind:value={password} placeholder="Password" type="password"/>
		<button on:click={login}>Login</button>
	{:else}
		<!--<input bind:value={matchNumberToSetUp} />-->
		<button on:click={setupMatch}>Scout us!</button> <br>
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
