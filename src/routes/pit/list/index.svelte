<script lang="ts">
	export let listOfTeams: App.PitTeam[];
	listOfTeams.sort((a,b) => {
		return a.teamNumber - b.teamNumber
	})
</script>

<main>
	<h1>
		This is the list for PIT scouting. Click "Scouting!" above to go to match scouting.
	</h1>
	<div id="table">
		<table>
			<thead>
				<tr>
					<td>Team number</td>
					<td>Data</td>
				</tr>
			</thead>
			<tbody>
				{#each listOfTeams as team}
					<tr>
						<td><a href="/pit/{team.teamNumber}">
							{#if team.hasBeenPitScouted}
							<button class="done">{team.teamNumber}</button>
							{:else}
							<button class="need">{team.teamNumber}</button>
							{/if}
								
							
						</a></td>
						<td><a target="_blank" href="/data/team/{team.teamNumber}" rel="noreferrer noopener" >
							<button >Data {team.teamNumber}</button>
						</a></td>
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
		height: 40px;
	}
	.need {
		background-color: #FF7700;
	}
	.done {
		background-color: #00ff00;
	}
	a {
		color: black;
	}
</style>
