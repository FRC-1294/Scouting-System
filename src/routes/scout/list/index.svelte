<script lang="ts">
	export let listOfMatches: App.Match[];
	listOfMatches.sort((a, b) => {
		return a.matchNumber - b.matchNumber;
	});
</script>

<main>
	<div id="table">
		<table>
			<thead>
				<tr>
					<td>Match number (click for data)</td>
					<td>b1</td>
					<td>b2</td>
					<td>b3</td>
					<td>r1</td>
					<td>r2</td>
					<td>r3</td>
				</tr>
			</thead>
			<tbody>
				{#each listOfMatches as match}
					<tr class={match.isCurrentMatch ? 'highlight' : ''}>
						<td
							><a href="/data/team/{match.matchNumber}"
								><button class="matchData">{match.matchNumber}</button></a
							></td
						>
						{#each match.blue as team}
							{#if team == 1294}
								<td
									><a href="/scout/{team}-{match.matchNumber}-blue"
										><button class="pop">{team}</button></a
									></td
								>
							{:else}
								<td
									><a href="/scout/{team}-{match.matchNumber}-blue"
										><button class="blue">{team}</button></a
									></td
								>
							{/if}
						{/each}
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
		background-color: #AAAAFF;
	}
	.red {
		background-color: #FFAAAA;
	}
	.pop {
		background-color: #000000;
		color: gold;
	}
	a {
		color: black;
	}
	.highlight button {
		background-color: #f0f000;
	}
	.highlight {
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
</style>
