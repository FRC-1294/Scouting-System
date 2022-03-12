<script context="module" lang="ts">
</script>

<script lang="ts">
	import Counter from '$lib/Counter.svelte';
	import Slider from '$lib/Slider.svelte';
	let errorMessage = '';
	let data: App.PitData = {
		teamNumber: 0,
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
		}
	}
</script>

<main>
	<div id="auto">
		<p>Auto:</p>
		<Slider round bind:checked={data.auto} />
		<p>Number of cargo:</p>
		<Counter bind:count={data.cargoAuto} />
	</div>
	<div id="reliability">
		<p>Reliability:</p>
		<Counter bind:count={data.reliability} />
	</div>
	<div id="climb" class="switch">
		<p>Climb:</p>
		<Slider round bind:checked={data.climb} />
	</div>
	<div id="comments">
		<p>Strengths:</p>
		<input type="text" bind:value={data.strengths} placeholder="Strengths" />
		<p>Weaknesses:</p>
		<input type="text" bind:value={data.weakness} placeholder="Weaknesses" />
		<p>Other:</p>
		<input type="text" bind:value={data.comments} placeholder="Other" />
	</div>

	<div id="submit">
		<button on:click={submit}>Submit Data</button>
		{#if errorMessage}
			<p>{errorMessage}</p>
		{/if}
	</div>
</main>

<!--TODO fix up div sizes-->
<style>
	:root {
		--Robot-Color: #ff7700;
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
	}
</style>
