<script lang="ts">
	import Counter from '$lib/Counter.svelte';
	import { writable } from 'svelte/store';

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
	let currentScoutData: {
		isScout: Boolean;
		robotScouting: number;
		isRed: Boolean;
	} = {
		isScout: false,
		robotScouting: -1,
		isRed: false
	};
	let currentMatchData = {
		matchNumber: -1
	};

	//DATA
	let data: App.ScoutData = {
		teamNumber: currentScoutData.robotScouting,
		matchNumber: currentMatchData.matchNumber,
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
		notes: ""
	};


	function submit() {
		hasSumbitted = true;
		needToSubmit = false;
	}

	//Counters
	function incAuto() {
		data.cargo.auto++;
	}
	function decAuto() {
		if (data.cargo.auto > 0) {
			data.cargo.auto--;
		}
	}

	function incTele() {
		data.cargo.teleop++;
	}
	function decTele() {
		if (data.cargo.teleop > 0) {
			data.cargo.teleop--;
		}
	}
	currentScoutData = {
			isScout: true,
			robotScouting: 1294,
			isRed: true
		};
	setInterval(() => {
		currentScoutData = {
			isScout: true,
			robotScouting: 1294,
			isRed: !currentScoutData.isRed
		};
	}, 2000);
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
			<div id="auto">
				<h3>AUTO</h3>

				<p>Did the robot have a functioning auto?</p>
				<label class="switch">
					<input bind:checked={data.auto} id="auto" type="checkbox" />
					<span class="slider round" />
				</label>
			</div>
			<div id="cargo">
				<h3>Cargo</h3>
				<p>Cargo Auto:</p>
				<Counter bind:count={data.cargo.auto}></Counter>
				<br />			
				<p>Cargo Teleop:</p>
				<Counter bind:count={data.cargo.teleop}></Counter>
			</div>
			<div id="hub">
				<h3>HUB</h3>
				<h4>Which hub(s) did the robot use?</h4>
	
				<p>Upper:</p>
				<label class="switch">
					<input bind:checked={data.hub.upper} id="upper" type="checkbox" />
					<span class="slider" />
				</label>
	
				<br />
				<p>Lower:</p>
				<label class="switch">
					<input bind:checked={data.hub.lower} id="lower" type="checkbox" />
					<span class="slider" />
				</label>			
			</div>
			<div id="other">
				<h3>OTHER</h3>
				<p>Was the robot efficient?</p>
				<label class="switch">
					<input bind:checked={data.efficient} id="efficient" type="checkbox" />
					<span class="slider round" />
				</label>
				<br />
				<br>
				<label for="notes">Additional notes:</label>
				<input bind:value={data.notes} type="text" id="notes" />
			</div>
			<p>{JSON.stringify(data)}</p>
			<!--TODOCOMP add safety for submitting data-->
			<br /><button on:click={submit}>Submit data</button>
		{/if}
	{:else}
		<p>You are not scouting this match</p>
	{/if}
</main>

{#if currentScoutData.isRed && currentScoutData.isScout}
	<style>
		:root {
			--Robot-Color: #ff9999;
		}
	</style>
{:else if currentScoutData.isScout}
	<style>
		:root {
			--Robot-Color: #9999ff;
		}
	</style>
{:else}
	<style>
		:root {
			--Robot-Color: #ffffff;
		}
	</style>
{/if}

<style>
	#auto {
		width:300px;
		height: 130px;
	}
	#cargo {
		width: 170px;
		height: 320px;
		margin-right: 30px;
	}
	#hub {
		width: 200px;
		height: 300px;
	}
	#other {
		width: 200px;
		height: 200px;
	}
	div {
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

	/* The switch - the box around the slider */
	.switch {
		position: relative;
		display: inline-block;
		width: 60px;
		height: 34px;
	}

	/* Hide default HTML checkbox */
	.switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	/* The slider */
	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #ccc;
		-webkit-transition: 0.4s;
		transition: 0.4s;
	}

	.slider:before {
		position: absolute;
		content: '';
		height: 26px;
		width: 26px;
		left: 4px;
		bottom: 4px;
		background-color: white;
		-webkit-transition: 0.4s;
		transition: 0.4s;
	}

	input:checked + .slider {
		background-color: var(--Robot-Color);
	}

	input:focus + .slider {
		box-shadow: 0 0 1px var(--Robot-Color);
	}

	input:checked + .slider:before {
		-webkit-transform: translateX(26px);
		-ms-transform: translateX(26px);
		transform: translateX(26px);
	}

	/* Rounded sliders */
	.slider.round {
		border-radius: 34px;
	}

	.slider.round:before {
		border-radius: 50%;
	}

	/* Rounded sliders */
	.round {
		border-radius: 34px;
	}

	.slider.round:before {
		border-radius: 50%;
	}
</style>
