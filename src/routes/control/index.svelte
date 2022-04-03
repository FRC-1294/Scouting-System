<script lang="ts" context="module">
	export async function load({fetch}) {
		let res = await fetch("/control/updateEventData")
		let number = (await res.json()).matchNumber
		
		return {
			props: {
				highlightMatchNumber: number
			}
		}
	}
</script>

<script lang="ts">
import Counter from "$lib/Counter.svelte";
import { writable } from "svelte/store";
	

    let errorMessage = "";
    export let highlightMatchNumber = 0;
	let matchNumber = writable(highlightMatchNumber)

	matchNumber.subscribe(async num => {
		try {
		let response = await fetch('/control/updateEventData', {
			method: 'POST',
			body: JSON.stringify(num)
		});
		if (response.status != 200) {
			errorMessage = (await response.json()).message;
		} else {
			errorMessage = '';
		}
			
		} catch (e) {
			if(e.code == "ERR_INVALID_URL") {
				console.log("Invalid fetch URL. Oh no!")
			} else {
				throw e
			}
		}
	})
</script>

<main>
	<title>Next match: {$matchNumber}</title>
    <a href="/control/import">Import data</a> <br>
    {#if errorMessage}
        <p>{errorMessage}</p>
    {/if}
    <label for="matchNumber">Match to highlight:</label>
	<Counter bind:count={$matchNumber}></Counter>
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
	:root {
		--Robot-Color: #000000;
	}
</style>