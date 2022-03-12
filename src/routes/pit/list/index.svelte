<script lang="ts">
	export let listOfTeams: App.PitTeam[];
	listOfTeams.sort((a,b) => {
		return a.teamNumber - b.teamNumber
	})
</script>

<main>
	<div id="table">
		<table>
			<thead>
				<tr>
					<td>Team number</td>
				</tr>
			</thead>
			<tbody>
				{#each listOfTeams as team}
					<tr>
						<td><a href="/pit/{team.teamNumber}"><button>{team.teamNumber}</button></a></td>
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

	thead, table {
		margin: auto;
		width: 60%;
		padding: 10px;
	}
	table button {
		width: 100%;
		background-color: #FF7700;
		height: 40px;
	}
</style>
