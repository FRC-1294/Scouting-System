<script lang="ts">
	import Counter from '$lib/Counter.svelte';
	import { writable } from 'svelte/store';
	import Slider from '$lib/Slider.svelte';
    import NotesInput from './_notesInput.svelte';
	import { page } from '$app/stores';
import { onMount } from 'svelte';

	export let isRed = $page.params.color == 'red';
	export let matchNumber = Number($page.params.match);
    export let match: App.Match;
    
	
	//Scouting and match logic
	let hasSumbitted = false;
	let needToSubmit = false;

	//DATA
	let data: App.ScoutedNotes[] = [];
    if(isRed) {
        match.red.forEach(element => {
            data.push({
                matchNumber: matchNumber,
                teamNumber: element,
                notes: ""
            })
        });
    } else {
        match.blue.forEach(element => {
            data.push({
                matchNumber: matchNumber,
                teamNumber: element,
                notes: ""
            })
        });
    }

	let errorMessage = '';
	async function submit() {
		let response = await fetch('/scout/submitNotes', {
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
</script>

<main>
	{#if !hasSumbitted}
        
	<title>Scouting Q{matchNumber} {isRed ? "Red" : "Blue"}</title>
    <h1>Q{matchNumber}</h1>
    <q>This is a little different then usual scouting. Rather than counting every ball, every climb, etc., you simply need to take notes.</q>
    <p>Maybe a robot had an electrical problem, write that down. Did a robot climb really fast? Write that down. Pay attention to all 3 robots
        on an alliance, and take notes on what you notice.
    </p>
    <h1>{isRed ? "Red" : "Blue"} Alliance</h1>
    {#each data as d}
        <NotesInput bind:data={d}></NotesInput>
    {/each}
		<div id="submit">
			<button on:click={submit}>Submit data</button>
		</div>
	{:else}
		<div class="robotBanner">
			<h1>Data Submitted. Thanks!</h1>
			<a sveltekit:prefetch href="/scout/list"><button class="goback">Go back</button></a>
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
		height: 550px;
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
