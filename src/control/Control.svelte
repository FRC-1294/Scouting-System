<script>
	import { io } from 'socket.io-client'

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
</script>

<main>
<style>	
	body {
		background-color: #98ff83;
	}
</style>

	<h1>ADMIN</h1>
	<input bind:value={matchNumberToSetUp} />
	<button on:click={leClicc}>Clicc</button>
	
</main>
