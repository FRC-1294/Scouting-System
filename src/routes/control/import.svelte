<script lang="ts">


	import { importDataFromTheBlueAlliance } from '$lib/importFromTBA';
	import { onMount } from 'svelte';
	let data = {};
	let res = "Not imported yet"
	let leImport = async () => {
		await fetch("/control/importData")
		res = "Probably OK"
	};
</script>

<main>
	<p>
		{res}
	</p>
	<button on:click={leImport}>IMPORT</button>
</main>
