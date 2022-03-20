<script lang="ts">
    export let DATA: {MatchData: App.AggregatedTeamData, PitData: App.PitData, red: boolean}[]
</script>

<main>
    {#each DATA as aTeam}
        <div class={aTeam.red ? "red" : "blue"}>
        <h1>{aTeam.PitData.teamNumber}</h1>
        {#if aTeam.MatchData}
        <p>Average balls Teleop: {aTeam.MatchData.averageCargoTele} </p>
        <p>Average balls Auto: {aTeam.MatchData.averageCargoAuto} </p>
        <p>Defense percentage: {aTeam.MatchData.defensePercent * 100}%</p>
        <p>Reliable percentage: {aTeam.MatchData.reliablePercent * 100}%</p>
        <p>Percent Stuck: {aTeam.MatchData.stuckPercent * 100}%</p>
        <p>Low climb: {aTeam.MatchData.climb.low.can} {aTeam.MatchData.climb.low.percent * 100}%</p>
        <p>Mid climb: {aTeam.MatchData.climb.mid.can} {aTeam.MatchData.climb.mid.percent * 100}%</p>
        <p>High climb: {aTeam.MatchData.climb.high.can} {aTeam.MatchData.climb.high.percent * 100}%</p>
        <p>Traverse climb: {aTeam.MatchData.climb.traverse.can} {aTeam.MatchData.climb.traverse.percent * 100}%</p>
        {/if}

        {#if aTeam.PitData}
        <br>
        <h2><strong>Pit data:</strong></h2>
        <p>Hub: Up: {aTeam.PitData.hub.upper} Low: {aTeam.PitData.hub.lower} </p>
        <p>Strengths: {aTeam.PitData.strengths}</p>
        <p>Weaknesses: {aTeam.PitData.weakness} </p>
        <p>Other: {aTeam.PitData.comments}</p>
        <h3>Auto:</h3>
        <p>Can auto?: {aTeam.PitData.auto}</p>
        <p>Cargo: {aTeam.PitData.cargoAuto} </p>
        {/if}
    </div>
    {/each}
</main>

<style>
    div {
        width: 300px;
        float: left;
    }
    .red {
        background-color: lightcoral;
    }
    .blue {
        background-color: lightblue;
    }
</style>