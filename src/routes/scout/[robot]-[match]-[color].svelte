<script lang="ts">
	import Counter from '$lib/scouting components/Counter.svelte';
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
			teleop: 0,
			missed: 0
		},
		hub: {
			upper: false,
			lower: false
		},
		climb: {
			low: false,
			mid: false,
			high: false,
			traverse: false
		},
		gotStuckOften: false, //Whether the robot got stuck often
		itBroke: false,
		defense: false,
		notes: '',
		name: ''
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
	<title>Scouting robot {robotScouting} in Q{matchNumber}</title>
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
			<p>Match Q{matchNumber}</p>
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
			<br />
			<p>Missed Cargo:</p>
			<Counter bind:count={data.cargo.missed} />
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

		<div class="item" id="climb">
			<h3>CLIMB</h3>
			<h4>Which bars did the robot climb to? (click all that apply)</h4>
			<p>Low:</p>
			<Slider bind:checked={data.climb.low} />
			<p>Mid:</p>
			<Slider bind:checked={data.climb.mid} />
			<p>High:</p>
			<Slider bind:checked={data.climb.high} />
			<p>Traverse:</p>
			<Slider bind:checked={data.climb.traverse} />
		</div>

		<div class="item" id="other">
			<h3>OTHER</h3>
			<p>Did the robot get stuck often?</p>
			<Slider round bind:checked={data.gotStuckOften} />
			<p>Did the robot break or lose connection?</p>
			<Slider round bind:checked={data.itBroke}></Slider>
			<p>Did the robot play defense?</p>
			<Slider round bind:checked={data.defense}></Slider>
			<br />
			<br />
			<label for="name">Your Name:</label>
			<input bind:value={data.name} id="name" />
			<label for="notes">Additional notes:</label>
			<textarea bind:value={data.notes} rows=5 cols=40 id="notes" />
		</div>
		<!--TODOCOMP add safety for submitting data-->
		<div id="submit">
			<button on:click={submit}>Submit data</button>
		</div>
	{:else}
		<div class="robotBanner">
			<h1>Data Submitted. Thanks!</h1>
			<a sveltekit:prefetch href="/scout"><button class="goback">Go back</button></a>
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

	#other {
		height: 550px;
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
		height: 400px;
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
	.goback {
		width: 50%;
		height: 100px;
		background-color: rgb(189, 0, 189);
		border: none;
		color: white;
		text-align: center;
		text-decoration: none;
		display: inline-block;
		font-size: 80px;
		border-radius: 34px;
		transition: background-color 1s;
	}
	.goback:hover {
		background-color: rgb(185, 120, 0);
	}
</style>
