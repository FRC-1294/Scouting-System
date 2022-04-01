<script lang="ts">
	export let canImportMatch = true;
	export let canImportTeam = true;
	let res = "Awaiting action"
	let importMatchData = async () => {
		res = await (await fetch("/control/importMatchData")).text()
	};
	let importTeamData = async () => {
		res = await (await fetch("/control/importTeamData")).text()
	}
</script>

<main>
	<a href="/control">Back</a>
	<p>
		{res}
	</p>
	<button disabled={!canImportMatch} class={canImportMatch ? "enabled" : "disabled"} on:click={importMatchData}>Import Match Data</button>
	<br>
	<button disabled={!canImportTeam} class={canImportTeam ? "enabled" : "disabled"} on:click={importTeamData}>Import Team Data</button>
</main>

<style>
	button {
		width: 200px;
		height: 100px;
		border-radius: 10px;
	}
	.enabled {
		background-color: green;
		color: white;

	}
	.disabled {
		background-color: rgb(83, 0, 0);
		color: gray;
	}
</style>
