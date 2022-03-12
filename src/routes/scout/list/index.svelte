<script lang="ts">
	export let listOfMatches: App.Match[];
	listOfMatches.sort((a,b) => {
		return a.matchNumber - b.matchNumber
	})
</script>

<main>
	<div id="table">
		<table>
			<thead>
				<tr>
					<td>Match number</td>
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
					<tr>
						<td>{match.matchNumber}</td>
						{#each match.blue as team}
							<td><a href="/scout/{team}-{match.matchNumber}-blue"><button class="blue">{team}</button></a></td>
						{/each}
						{#each match.red as team}
							<td><a href="/scout/{team}-{match.matchNumber}-red"><button class="red">{team}</button></a></td>
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
		background-color: #7777FF;
	}
	.red {
		background-color: #FF7777;
	}
</style>
