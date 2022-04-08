<script lang="ts">
import { onMount } from "svelte";
import { writable } from "svelte/store";

	export let listOfMatches: App.Match[];
	export let currentMatchNumber: number;
	export let endMatchNumber: number;
	let currentMatchStore = writable(currentMatchNumber)
	let endMatchStore = writable(endMatchNumber)
	listOfMatches.sort((a, b) => {
		return a.matchNumber - b.matchNumber;
	});
	onMount(() => {
		setInterval(async ()=>{
			let newHightlightedMatch = await (await fetch("/control/nextMatch")).json()
			$currentMatchStore = parseInt(newHightlightedMatch.matchNumber);

			let newEndMatch = await (await fetch("/control/endMatch")).json()
			$endMatchStore = parseInt(newEndMatch.matchNumber)
			
		},100)
	})
</script>

<main>
	<title>List of matches</title>
	<h1>Fun fact:</h1>
	<h1>You can click on the match number in the table to view data on the match, collected by our own scouts!</h1>
	<div id="table">
		<table>
			<thead>
				<tr>
					<td>Match number (click for data)</td>
					<td>BLUE</td>
					<td>b1</td>
					<td>b2</td>
					<td>b3</td>
					<td>RED</td>
					<td>r1</td>
					<td>r2</td>
					<td>r3</td>
				</tr>
			</thead>
			<tbody>
				{#each listOfMatches as match}
					<tr class={match.matchNumber == $currentMatchStore ? 'highlight' : (match.matchNumber > $endMatchStore || match.matchNumber < $currentMatchStore) ? 'grey' : ''}>
						
						<td>
							<a target="_blank" rel="noreferrer noopener" href="/data/match/{match.matchNumber}">
								<button class="data">{match.matchNumber} </button>
							</a>
						</td>			
						<td>
							<a href="/scout/{match.matchNumber}-blue">
								<button class="all allBlue">Blue</button>
							</a>
						</td>
						{#each match.blue as team}
							{#if team == 1294}
								<td>
									<a href="/scout/{team}-{match.matchNumber}-blue">
										<button class="pop">{team}</button>
									</a>
								</td>
							{:else}
								<td>
									<a href="/scout/{team}-{match.matchNumber}-blue">
										<button class="blue">{team}</button>
									</a>
								</td>
							{/if}
						{/each}		
						<td>
							<a href="/scout/{match.matchNumber}-red">
								<button class="all allRed">Red</button>
							</a>
						</td>	
						{#each match.red as team}
							{#if team == 1294}
								<td
									><a href="/scout/{team}-{match.matchNumber}-red"
										><button class="pop">{team}</button></a
									></td
								>
							{:else}
								<td
									><a href="/scout/{team}-{match.matchNumber}-red"
										><button class="red">{team}</button></a
									></td
								>
							{/if}
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>

	</div>
</main>

<style>
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
	table button {
		width: 100%;
		height: 30px;
	}
	.blue {
		background-color: #aaaaff;
	}
	.red {
		background-color: #ffaaaa;
	}
	.all {
		width: 100px;
		color: white;
	}
	.allRed {
		background-color: #ff0000;
	}
	.allBlue {
		background-color: #0000ff;
	}
	.pop {
		background-color: #000000;
		color: gold;
	}
	a {
		color: black;
	}
	.highlight {
		background-color: #f0f000;
	}
	.highlight .data {
		background-color: #f0f000;
	}
	.highlight .red {
		background-color: #ff0000;
		color: white;
	}
	.highlight .blue {
		background-color: #3b3bff;
		color: white;
	}
	.grey {
		background-color: gray;
		color: black;
	}
	.grey button {
		background-color: gray;
		color: black;
	}
	.grey .pop {
		color: gold;
	}
</style>
