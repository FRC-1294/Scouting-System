<script>
	import { io } from 'socket.io-client'
	import ScoutWidget from './ScoutWidget.svelte'
	var socket = io('http://localhost:4000/admin', {
		auth: {
			token: 'leToken',
		},
	})
	let isAdmin = false
	socket.on("connect", () => {
		isAdmin = true
	})

	let matchNumberToSetUp = 0
	function leClicc() {
		socket.emit("setupMatch", matchNumberToSetUp)
	}
	let scouttt = ["A", "B"]
	function leClicc2() {
		scouttt.push("aaa")
		scouttt = scouttt
	}

	//Kick a scout off
	function kickOff(id) {
		alert(id)
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
	<button on:click={leClicc2}>AAAAAAAAAAAA</button>	
	<button on:click={() => {socket.emit("endMatch")}}>End Match</button>
	<br>
	<ScoutWidget name="h" id="1234" robot="1294" status="scouting" boot={kickOff}/>
	<ScoutWidget name="b" id="8888" robot="2941" status="disconnected" boot={kickOff}/>
	{#each scouttt as newScoutName, newScout}		
		<ScoutWidget name={newScoutName} id={newScout} robot="123" status="disconnected" boot={kickOff}/>
	{/each}
</main>
