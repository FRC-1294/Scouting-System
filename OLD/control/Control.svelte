<script>
	import { io } from 'socket.io-client';
	import ScoutWtokenget from './ScoutWidget.svelte';

	var socket = io('/admin');

	let scouts = [];
	socket.on('scouts', (newScouts) => {
		scouts = newScouts;
	});
	let isAdmin = false;
	socket.on('connect', () => {
		isAdmin = true;
	});

	//Match setup
	let matchNumberToSetUp = 0;
	let robotNumberToSetup = 0;
	function setupMatch() {
		socket.emit('setupMatch', matchNumberToSetUp, robotNumberToSetup);
	}

	//Kick a scout off
	function kickOff(token) {
		socket.emit('boot', token);
	}

	//Disconnect
	socket.on('disconnect', () => {
		window.location.reload();
	});

	//Aggregate
	let aggResult;
	function aggregateData() {
		socket.emit('aggregate', (result) => {
			aggResult = JSON.stringify(result);
		});
	}
</script>

<main>
	<style>
		body {
			background-color: #ffffff;
		}
	</style>

	<h1>ADMIN</h1>
	<input bind:value={matchNumberToSetUp} placeholder="Match" />
	<input bind:value={robotNumberToSetup} placeholder="Robot" />
	<button on:click={setupMatch}>Scout us!</button> <br />

	<br />
	<button on:click={aggregateData}>Aggregate data </button> <br />
	<p>{aggResult}</p>
	<br />

	<button
		on:click={() => {
			socket.emit('endMatch');
		}}>End Match</button
	>
	<br />
	{#each scouts as thisScout}
		<ScoutWtokenget scout={thisScout} boot={kickOff} />
	{/each}
</main>
