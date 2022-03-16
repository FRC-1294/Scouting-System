<script lang="ts">
    let errorMessage = "";
    let highlightMatchNumber = 0;

    	async function updateEventData() {
		let response = await fetch('/control/updateEventData', {
			method: 'POST',
			body: JSON.stringify(highlightMatchNumber)
		});
		if (response.status != 200) {
			errorMessage = (await response.json()).message;
		} else {
			errorMessage = '';
		}
	}
</script>

<main>
    <a href="/control/import">Import data</a> <br>
    {#if errorMessage}
        <p>{errorMessage}</p>
    {/if}
    <label for="matchNumber">Match to highlight:</label>
    <input id="matchNumber" type="number" bind:value={highlightMatchNumber}>
    <button on:click={updateEventData}>UPDATE</button>
</main>

<style>
    button {
		background-color: #ff0000;
		width: 100px;
		height: 50px;
		border: none;
		color: white;
		text-align: center;
		text-decoration: none;
		display: inline-block;
		font-size: 19px;
		border-radius: 34px;
		transition: background-color 1s;
	}
	button:hover {
		background-color: #ff9900;
	}
</style>