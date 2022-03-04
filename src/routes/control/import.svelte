<script lang="ts">
	import { importDataFromTheBlueAlliance } from '$lib/importFromTBA';
	import { onMount } from 'svelte';
	let data = {};
	let leImport = async () => {
		data = await importDataFromTheBlueAlliance();
	};
</script>

<main>
	<p>
		{JSON.stringify(data)}
	</p>
	<button on:click={leImport}>IMPORT</button>
</main>
