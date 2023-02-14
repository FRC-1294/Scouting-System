<script lang="ts">
	import Counter from '$lib/scouting components/Counter.svelte';
	import { writable } from 'svelte/store';
	import Slider from '$lib/scouting components/Slider.svelte';
	import { page } from '$app/stores';

	export let robotScouting = Number($page.params.robot);
	export let isRed = $page.params.color == 'red';
	export let matchNumber = Number($page.params.match);

	//Scouting and match logic
	let hasSumbitted = false;
	let needToSubmit = false;
	let isSubmitting = false;

	//DATA
	let data: App.ScoutedMatch = {
		teamNumber: robotScouting,
		matchNumber: matchNumber,
		auto: {
			functioningAuto: false,
			moveOutOfZone: false,
			totalConesAuto: 0,
			totalCubesAuto: 0
		},
		 //Scale of 0 to 2, 0: None, 1: Move, 2: Score
		teleopCones: {
			upper: false,
			middle: false,
			bottom: false,
			totalConesTeleop: 0,
			totalConesMissedTeleop: 0

		},

		teleopCubes: {
			upper: false,
			middle: false,
			bottom: false,
			totalCubesTeleop: 0,
			totalCubesMissedTeleop: 0

		},

		other: {
			broke: false,
			defense: false,
			notes: '',
			name: ''
		},

	};

	let errorMessage = '';
	async function submit() {
		if(!isSubmitting) {
			isSubmitting = true
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
			<Slider round bind:checked={data.auto.functioningAuto} red={isRed} />
			<br>
			<p>Did the robot move out of the loading zone?</p>
			<Slider round bind:checked={data.auto.moveOutOfZone} red={isRed} />
			<br>
			<p>Total number of cones scored in auto:</p>
			<Counter bind:count={data.auto.totalConesAuto} red={isRed}/>
			<br>
			<p>Total number of cubes scored in auto:</p>
			<Counter bind:count={data.auto.totalCubesAuto} red={isRed}/>

		</div>

		<div class="item" id="teleopCones">
			<h3>TELEOP CONES</h3>
			<p>Upper Node?</p>
			<Slider round bind:checked={data.teleopCones.upper} red={isRed} />
			<br>
			<p>Middle Node?</p>
			<Slider round bind:checked={data.teleopCones.middle} red={isRed} />
			<br>
			<p>Bottom Node?</p>
			<Slider round bind:checked={data.teleopCones.bottom} red={isRed} />
			<br>
			<p>Total Cones Scored:</p>
			<Counter bind:count={data.teleopCones.totalConesTeleop} red={isRed}/>
			<br>
			<p>Total Cones Missed:</p>
			<Counter bind:count={data.teleopCones.totalConesMissedTeleop} red={isRed}/>
			
		</div>


		<div class="item" id="teleopCubes">
			<h3>TELEOP CUBES</h3>
			<p>Upper Node?</p>
			<Slider round bind:checked={data.teleopCubes.upper} red={isRed} />
			<br>
			<p>Middle Node?</p>
			<Slider round bind:checked={data.teleopCubes.middle} red={isRed} />
			<br>
			<p>Bottom Node?</p>
			<Slider round bind:checked={data.teleopCubes.bottom} red={isRed} />
			<br>
			<p>Total Cubes Scored:</p>
			<Counter bind:count={data.teleopCubes.totalCubesTeleop} red={isRed}/>
			<br>
			<p>Total Cubes Missed:</p>
			<Counter bind:count={data.teleopCubes.totalCubesMissedTeleop} red={isRed}/>
			
		</div>

		<div class="item" id="other">
			<h3>OTHER</h3>
			<p>Did the robot break or lose connection?</p>
			<Slider round bind:checked={data.other.broke} red={isRed} />
			<br>
			<p>Did the robot play defense?</p>
			<Slider round bind:checked={data.other.defense} red={isRed} />
			<br>
			<label for="name">Your Name:</label>
			<input bind:value={data.other.name} id="name" />
			<p>If a robot played defense, make sure to take notes on their defense!</p>
			<label for="notes">Additional notes:</label>
			<textarea bind:value={data.other.notes} rows=5 cols=40 id="notes" />



		</div>
		<!--

		<div class="item" id="climb">
			<h3>CLIMB</h3>
			<h4>Which bars did the robot climb to? (click all that apply)</h4>
			<p>Low:</p>
			<Slider bind:checked={data.climb.low} red={isRed} />
			<p>Mid:</p>
			<Slider bind:checked={data.climb.mid} red={isRed} />
			<p>High:</p>
			<Slider bind:checked={data.climb.high} red={isRed} />
			<p>Traverse:</p>
			<Slider bind:checked={data.climb.traverse} red={isRed} />
		</div>
		-->

		
		<!--TODOCOMP add safety for submitting data-->
		<div id="submit">
			<button on:click={submit} disabled={isSubmitting}>{!isSubmitting ? "Submit data" : "Submitting..."}</button>
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
		height: 750px;
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
