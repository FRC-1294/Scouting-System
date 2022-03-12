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
		climb: false,
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
		<div id="auto">
			<h3>AUTO</h3>

			<p>Did the robot have a functioning auto?</p>
			<Slider round bind:checked={data.auto} />
		</div>

		<div id="cargo">
			<h3>Cargo</h3>
			<p>Cargo in Auto:</p>
			<Counter bind:count={data.cargoAuto} />
		</div>

		<div id="hub">
			<h3>HUB</h3>
			<h4>Which hub(s) did the robot use?</h4>
			<p>Upper:</p>
			<Slider bind:checked={data.hub.upper} />
			<br />
			<p>Lower:</p>
			<Slider bind:checked={data.hub.lower} />
		</div>

		<div id="other">
			<p>Additional notes:<p><br>
			<table>
				<tbody>
					<tl>
						<td>Strengths</td>						
						<td><textarea bind:value={data.weakness} rows=7 cols=40 id="notes" /></td>
					</tl>
					<tl>
						<td>Weakness</td>
						<td><textarea bind:value={data.strengths} rows=7 cols=40 id="notes" /></td>
					</tl>
					<tl>
						<td>Other</td>
						<td><textarea bind:value={data.comments} rows=7 cols=40 id="notes" /></td>
					</tl>
				</tbody>
			</table>

			<br />
			<p></p>
			<p></p>
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
	#auto {
		width: 200px;
		height: 200px;
	}

	.switch {
		width: 200px;
		height: 200px;
	}

	#reliability {
		width: 200px;
		height: 150px;
	}

	#comments {
		width: 300px;
		height: 500px;
	}table,
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
</style>
