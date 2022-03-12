<script lang="ts">
	export let listOfTeams: App.PitTeam[];
</script>

<main>
	<div id="table">
		<table>
			<tbody>
				{#each listOfTeams as team}
					<tr>
						<td>{team.teamNumber}</td>
						<td><a href="/pit/{team.teamNumber}"><button>SCOUT</button></a></td>
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

	thead,
	tfoot {
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
		background-color: #FF7700;
		height: 30px;
	}
</style>
