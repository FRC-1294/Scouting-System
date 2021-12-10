<script>
	import { Router, Link, Route } from 'svelte-routing'
	import { io } from 'socket.io-client'
	import { writable } from 'svelte/store'

	var socket = io('http://localhost:4000')
	//Login
	let isLoggedIn = false
	let name = localStorage.getItem('name') ?? ''
	let id = localStorage.getItem('id') ?? undefined
	let password

	if (id) {
		login(true)
	}

	//TODO: Figure out if it's possible to have events outside the login function
	function login() {
		localStorage.setItem('name', name)
		socket.emit(
			'login',
			{
				id: id,
				name: name,
				password: password,
			},
			(ack) => {
				if (ack.loggedIn) {
					id = ack.id
					localStorage.setItem('id', ack.id)
					isLoggedIn = true
				} else {
					//Clear the ID from storage if it's invalid
					localStorage.setItem('id', '')
				}
			}
		)
	}

	socket.on('alert', (data) => alert(data))
	socket.on('match', (matchData) => {
		currentMatchData = matchData
		currentScoutData.isScout = false
		hasSumbitted = false
		needToSubmit = false
	})
	socket.on('scout', (newScoutData) => {
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
	auto: 0, //Scale of 0 to 2, 0: None, 1: Move, 2: Score
	boxesMovedAuto: 0,
	boxesMovedTeleop: 0,
	efficient: false, //Whether the robot navigated "Efficiently"
}
	function submit() {

		if(document.getElementById("auto0").checked) {
			data.auto = 0
		} else if(document.getElementById("auto1").checked) {
			data.auto = 1
		} else if(document.getElementById("auto2").checked) {
			data.auto = 2
		}

		data.efficient = document.getElementById("dataEfficient").checked

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

	{#if !isLoggedIn}
		<h1>LOGIN</h1>
		<label for="nameInput">Name:</label><input
			bind:value={name}
			id="nameInput"
			placeholder="Name"
			title="Name"
			type="text"
		/>
		<label for="passwordInput">Password:</label><input
			bind:value={password}
			id="passwordInput"
			placeholder="Password"
			title="Password"
			type="password"
		/>
		<button on:click={login}>Login</button>
	{:else}
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
				<input bind:value={data.boxesMovedAuto} placeholder="DATA LEL" />

				<br><h3>AUTO</h3>

				<br><input type="radio" id="auto0" name="auto">
				<label for="auto0">Robot did not move</label>

				<br><input type="radio" id="auto1" name="auto">
				<label for="auto1">Robot moved</label>

				<br><input type="radio" id="auto2" name="auto">
				<label for="auto2">Robot scored points</label>

				<br><h3>BOXES</h3>
				


				<br><h3>OTHER</h3>
				<br><input type="checkbox" id="dataEfficient" name="dataEfficient">
				<label for="dataEfficient">Was the robot Efficient?</label>
				<!--TODOCOMP add safety for submitting data-->
				<br><button on:click={submit}>Submit data</button>
			{/if}
		{:else}
			<p>You are not scouting this match</p>
		{/if}
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
</style>
