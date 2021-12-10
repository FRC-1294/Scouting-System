<script>
	import { io } from 'socket.io-client'
	import ScoutWidget from './ScoutWidget.svelte'
	var socket = io('http://localhost:4000/admin', {
		auth: {
			token: 'leToken',
		},
	})
	let scouts = []
	socket.on("scouts", newScouts => {
		scouts = newScouts
	})
	let isAdmin = false
	socket.on("connect", () => {
		isAdmin = true
	})

	let matchNumberToSetUp = 0
	function leClicc() {
		socket.emit("setupMatch", matchNumberToSetUp)
	}
	

	//Kick a scout off
	function kickOff(id) {
		socket.emit("boot", id)
	}
</script>

<main>
<style>	
	body {
		background-color: #FFFFFF;
	}
</style>

	<h1>ADMIN</h1>
	<input bind:value={matchNumberToSetUp} />
	<button on:click={leClicc}>Clicc</button>
	<button on:click={() => {socket.emit("endMatch")}}>End Match</button>
	<br>
	{#each scouts as thisScout}
		<ScoutWidget scout={thisScout} boot={kickOff}/>
	{/each}
</main>
