<script lang="ts">
	import Counter from '$lib/Counter.svelte';
	import { writable } from 'svelte/store';
	import Slider from '$lib/Slider.svelte';
	import { page } from '$app/stores';

	export let robotScouting = Number($page.params.robot);
	export let isRed = $page.params.color == 'red';
	export let matchNumber = Number($page.params.match);

	/*
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
*/
	//Scouting and match logic
	let hasSumbitted = false;
	let needToSubmit = false;

	//DATA
	let data: App.ScoutedMatch = {
		teamNumber: robotScouting,
		matchNumber: matchNumber,
		auto: false, //Scale of 0 to 2, 0: None, 1: Move, 2: Score
		cargo: {
			auto: 0,
			teleop: 0
		},
		hub: {
			upper: false,
			lower: false
		},
		efficient: false, //Whether the robot navigated "Efficiently"
		notes: ''
	};

	let errorMessage = '';
	async function submit() {
		let response = await fetch('/scout/submit', {
			method: 'POST',
			body: JSON.stringify(data)
		});
		if (response.status != 200) {
			errorMessage = (await response.json()).message;
		} else {
			errorMessage = '';
			hasSumbitted = true;
			needToSubmit = false;
		}
	}
</script>

<main>
	<!--Need to sumbit warning-->
	{#if needToSubmit}
		<header class="warningHeader">
			<div class="warningHeaderDiv">
				<h1 class="warningHeaderText">MATCH OVER. PLEASE SUBMIT DATA.</h1>
			</div>
		</header>
	{/if}

	{#if !hasSumbitted}
		<!--Scouting-->
		<div class="robotBanner">
			<h1>{robotScouting}</h1>
			<p>Current match: Q{matchNumber}</p>
		</div>
		<!--Data collection here-->
		<div class="item" id="auto">
			<h3>AUTO</h3>

			<p>Did the robot have a functioning auto?</p>
			<Slider round bind:checked={data.auto} />
		</div>

		<div class="item" id="cargo">
			<h3>Cargo</h3>
			<p>Cargo Auto:</p>
			<Counter bind:count={data.cargo.auto} />
			<br />
			<p>Cargo Teleop:</p>
			<Counter bind:count={data.cargo.teleop} />
		</div>

		<div class="item" id="hub">
			<h3>HUB</h3>
			<h4>Which hub(s) did the robot use?</h4>
			<p>Upper:</p>
			<Slider bind:checked={data.hub.upper} />
			<br />
			<p>Lower:</p>
			<Slider bind:checked={data.hub.lower} />
		</div>

		<div class="item" id="other">
			<h3>OTHER</h3>
			<p>Was the robot efficient?</p>
			<Slider round bind:checked={data.efficient} />
			<br />
			<br />
			<label for="notes">Additional notes:</label>
			<textarea bind:value={data.notes} rows=7 cols=40 id="notes" />
		</div>
		<!--TODOCOMP add safety for submitting data-->
		<div id="submit">
			<button on:click={submit}>Submit data</button>
		</div>
	{:else}
		<div class="robotBanner">
			<h1>Data Submitted. Thanks!</h1>
		</div>
	{/if}
</main>

{#if isRed}
	<style>
		:root {
			--Robot-Color: #ff0000;
		}
	</style>
{:else}
	<style>
		:root {
			--Robot-Color: #0000ff;
		}
	</style>
{/if}

<style>
	.item {
		width: 200px;
	}
	div {
		height: 320px;
		float: left;
	}

	.warningHeader {
		background-color: #ff0000;
		width: 100%;
		height: 100px;
	}
	.warningHeaderText {
		color: #ffffff;
	}

	.robotBanner {
		background-color: var(--Robot-Color);
		color: white;
		text-align: center;
		display: inline-block;
		width: 100%;
		height: 300px;
		margin: auto;
	}
	.robotBanner h1 {
		font-size: 80px;
		color: white;
	}
	.robotBanner p {
		color: white;
	}

	#submit {
		width: 100%;
		height: 100%;
		margin: auto;
	}
	#submit button {
		background-color: var(--Robot-Color);
		width: 100%;
		height: 200px;
		border: none;
		color: white;
		text-align: center;
		text-decoration: none;
		display: inline-block;
		font-size: 80px;
		border-radius: 34px;
		transition: background-color 1s;
	}
	#submit button:hover {
		background-color: #ff9900;
	}
</style>
