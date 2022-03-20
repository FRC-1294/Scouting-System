<script context="module" lang="ts">
</script>

<script lang="ts">
	//TODO FIX THIS PAGE IT BROKEN
	import { writable } from 'svelte/store';
	import { page } from '$app/stores';
	import Counter from '$lib/Counter.svelte';
	import Slider from '$lib/Slider.svelte';
	let robotScouting = Number($page.params.number);

	let errorMessage = '';
	let hasSumbitted = false;
	let data: App.PitData = {
		teamNumber: robotScouting,
		auto: false,
		cargoAuto: 0,
		reliability: 0,
		climb: 0,
		comments: '',
		strengths: '',
		weakness: '',
		hub: {
			upper: false,
			lower: false
		}
	};

	async function submit() {
		let response = await fetch('/pit/submit', {
			method: 'POST',
			body: JSON.stringify(data)
		});
		if (response.status != 200) {
			errorMessage = (await response.json()).message;
		} else {
			errorMessage = '';
			hasSumbitted = true;
		}
	}
</script>

<main>
	{#if !hasSumbitted}
		<!--Scouting-->
		<div class="robotBanner">
			<h1>{robotScouting}</h1>
		</div>
		<!--Data collection here-->
		<div class="item">
			<h3>AUTO</h3>

			<p>Did the robot have a functioning auto?</p>
			<Slider round bind:checked={data.auto} />
		</div>

		<div class="item" id="cargo">
			<h3>Cargo</h3>
			<p>Cargo in Auto:</p>
			<Counter bind:count={data.cargoAuto} />
		</div>

		<div class="item">
			<h3>HUB</h3>
			<h4>Which hub(s) did the robot use?</h4>
			<p>Upper:</p>
			<Slider bind:checked={data.hub.upper} />
			<br />
			<p>Lower:</p>
			<Slider bind:checked={data.hub.lower} />
		</div>

		<div class="item" id="comments">
			<h3>Climb</h3>
			<Counter bind:count={data.climb}></Counter>
			<h3>Additional notes:<h3><br>
			<table>
				<tbody>
					<tl>
						<td class="label">Strengths</td>						
						<td><textarea bind:value={data.weakness} rows=7 cols=40 id="notes" /></td>
					</tl>
					<tl>
						<td class="label">Weakness</td>
						<td><textarea bind:value={data.strengths} rows=7 cols=40 id="notes" /></td>
					</tl>
					<tl>
						<td class="label">Other</td>
						<td><textarea bind:value={data.comments} rows=7 cols=40 id="notes" /></td>
					</tl>
				</tbody>
			</table>
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

<style>
	:root {
		--Robot-Color: #ff7700;
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

	#comments {
		width: 300px;
		height: 600px;
		padding-bottom: 10px;
		
	}
	
	table,
	td {
		border: 3px solid #333;
		font-size: 20px;
		text-align: center;
	}

	tr {		
		height: 8px;
	}

	thead {
		background-color: #333;
		color: #fff;
	}

	table {
		margin: auto;
		width: 60%;
		padding: 10px;
	}

	.label {
		width: 110px;
	}
	.item {
		width: 200px;
	}
	#cargo {
		margin-right: 30px;
	}
	div {
		height: 320px;
		float: left;
	}	#submit {
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
