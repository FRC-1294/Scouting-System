<script lang="ts">
    export let TeamData: {MatchData: App.AggregatedTeamData, PitData: App.PitData, red: boolean}
</script>

<main>
    <div class={TeamData.red ? "red" : "blue"}>
        <h1>{TeamData.PitData.teamNumber}</h1>
        {#if TeamData.MatchData}
        <p>Average balls Teleop: {TeamData.MatchData.averageCargoTele} </p>
        <p>Average balls Auto: {TeamData.MatchData.averageCargoAuto} </p>
        <p>Defense percentage: {TeamData.MatchData.defensePercent * 100}%</p>
        <p>Reliable percentage: {TeamData.MatchData.reliablePercent * 100}%</p>
        <p>Percent Stuck: {TeamData.MatchData.stuckPercent * 100}%</p>
        <p>Low climb: {TeamData.MatchData.climb.low.can} {TeamData.MatchData.climb.low.percent * 100}%</p>
        <p>Mid climb: {TeamData.MatchData.climb.mid.can} {TeamData.MatchData.climb.mid.percent * 100}%</p>
        <p>High climb: {TeamData.MatchData.climb.high.can} {TeamData.MatchData.climb.high.percent * 100}%</p>
        <p>Traverse climb: {TeamData.MatchData.climb.traverse.can} {TeamData.MatchData.climb.traverse.percent * 100}%</p>
        {/if}

        {#if TeamData.PitData}
        <br>
        <h2><strong>Pit data:</strong></h2>
        <p>Hub: Up: {TeamData.PitData.hub.upper} Low: {TeamData.PitData.hub.lower} </p>
        <p>Strengths: {TeamData.PitData.strengths}</p>
        <p>Weaknesses: {TeamData.PitData.weakness} </p>
        <p>Other: {TeamData.PitData.comments}</p>
        <h3>Auto:</h3>
        <p>Can auto?: {TeamData.PitData.auto}</p>
        <p>Cargo: {TeamData.PitData.cargoAuto} </p>
        {/if}
    </div>
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