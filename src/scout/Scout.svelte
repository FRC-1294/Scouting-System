<script>
	import { Router, Link, Route } from 'svelte-routing'
	import { io } from 'socket.io-client'
	import { writable } from 'svelte/store'

	var socket = io()


	socket.on('alert', (data) => alert(data))
	socket.on('match', (matchData) => {
		currentMatchData = matchData
		currentScoutData.isScout = false
		hasSumbitted = false
		needToSubmit = false
	})
	socket.on('scout', (newScoutData) => {
		//TODO deal with this event overriding current scout
		currentScoutData = newScoutData
	})
	socket.on('end', (subtle) => {
		//TODO unlock submit button
		if (!subtle) {
			if (!hasSumbitted && currentScoutData.isScout) {
				alert('The match has ended. Please submit your data.')
				needToSubmit = true
			}
		}
	})

	//Disconnect
	socket.on('disconnect', () => {
		alert('You got disconnected. Oh no!')
		//TODOCOMP Deal with disconnect
	})

	//Used for urgent alerts

	//Scouting and match logic
	let hasSumbitted = false
	let needToSubmit = false
	let currentScoutData = {
		isScout: false,
		robotScouting: -1,
		isRed: false,
	}
	let currentMatchData = {
		matchNumber: -1,
	}

	//DATA
	let data = {
		teamNumber: currentScoutData.robotScouting,
		matchNumber: currentMatchData.matchNumber,
		auto: 0, //Scale of 0 to 2, 0: None, 1: Move, 2: Score
		boxesMovedAuto: 0,
		boxesMovedTeleop: 0,
		efficient: false, //Whether the robot navigated "Efficiently"
	}
	function submit() {
		if (document.getElementById('auto0').checked) {
			data.auto = 0
		} else if (document.getElementById('auto1').checked) {
			data.auto = 1
		} else if (document.getElementById('auto2').checked) {
			data.auto = 2
		}

		data.efficient = document.getElementById('dataEfficient').checked

		socket.emit(
			'data',
			{
				teamNumber: currentScoutData.robotScouting,
				matchNumber: currentMatchData.matchNumber,
				data: data,
			},
			() => {
				alert('Data submitted successfully!')
			}
		)
		hasSumbitted = true
		needToSubmit = false
	}

	//Counters
	function incAuto() {
		data.boxesMovedAuto++
	}
	function decAuto() {
		if (data.boxesMovedAuto > 0) {
			data.boxesMovedAuto--
		}
	}

	function incTele() {
		data.boxesMovedTeleop++
	}
	function decTele() {
		if (data.boxesMovedTeleop > 0) {
			data.boxesMovedTeleop--
		}
	}
</script>

<main>
	<!--Need to sumbit warning-->
	{#if needToSubmit}
		<header class="warningHeader">
			<div class="warningHeaderDiv">
				<h1 class="warningHeaderText">
					MATCH OVER. PLEASE SUBMIT DATA.
				</h1>
			</div>
		</header>
	{/if}

	<!--Login-->

		<!--Scouting-->

		{#if currentMatchData.matchNumber != -1}
			<p>Current match: Q{currentMatchData.matchNumber}</p>
			<br />
		{:else}
			<h1>Welcome! Waiting for data from server.</h1>
		{/if}
		{#if currentScoutData.isScout}
			<p>You are scouting robot {currentScoutData.robotScouting}</p>
			<!--Data collection here-->
			{#if !hasSumbitted}
				<br />
				<h3>AUTO</h3>

				<br /><input type="radio" id="auto0" name="auto" />
				<label for="auto0">Robot did not move</label>

				<br /><input type="radio" id="auto1" name="auto" />
				<label for="auto1">Robot moved</label>

				<br /><input type="radio" id="auto2" name="auto" />
				<label for="auto2">Robot scored points</label>

				<br />
				<h3>BOXES</h3>

				<button class="counter" on:click={incAuto}>+</button>
				<button class="counter" on:click={decAuto}>-</button>
				<label for="boxesAuto">Boxes Auto:</label>
				<input
					id="boxesAuto"
					bind:value={data.boxesMovedAuto}
					placeholder="Boxes Moved Auto"
				/>
				<br />
				<button class="counter" on:click={incTele}>+</button>
				<button class="counter" on:click={decTele}>-</button>
				<label for="boxesTele">Boxes Teleop:</label>
				<input
					id="boxesTele"
					bind:value={data.boxesMovedTeleop}
					placeholder="Boxes Moved Teleop"
				/>
				<br />

				<br />
				<h3>OTHER</h3>
				<br /><input
					type="checkbox"
					id="dataEfficient"
					name="dataEfficient"
				/>
				<label for="dataEfficient">Was the robot Efficient?</label>
				<!--TODOCOMP add safety for submitting data-->
				<br /><button on:click={submit}>Submit data</button>
			{/if}
		{:else}
			<p>You are not scouting this match</p>
		{/if}

</main>

{#if currentScoutData.isRed && currentScoutData.isScout}
	<style>
		body {
			background-color: #ff9999;
		}
	</style>
{:else if currentScoutData.isScout}
	<style>
		body {
			background-color: #9999ff;
		}
	</style>
{:else}
	<style>
		body {
			background-color: #ffffff;
		}
	</style>
{/if}

<style>
	.warningHeader {
		background-color: #ff0000;
		width: 100%;
		height: 100px;
	}
	.warningHeaderText {
		color: #ffffff;
	}
	.counter {
		font-size: large;
		background-color: orange;
		width: 50px;
		height: 50px;
	}
</style>
