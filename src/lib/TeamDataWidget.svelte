<script lang="ts">


    export let teamData: App.Team
    export let red: boolean = false
</script>

<main>
    <div class={red ? "red" : "blue"}>
        <title>Data for team {teamData.teamNumber}</title>
        <h1>{teamData.teamNumber}</h1>
        {#if teamData.matchData}
        <p>Average balls Auto: {teamData.matchData.averageCargoAuto} </p>
        <p>Average balls Teleop: {teamData.matchData.averageCargoTele} </p>
        <p>Average missed balls: {teamData.matchData.averageMissedCargo}</p>
        <p>Defense percentage: {teamData.matchData.defensePercent * 100}%</p>
        <p>Reliable percentage: {teamData.matchData.reliablePercent * 100}%</p>
        <p>Low climb: {teamData.matchData.climb.low.can} {teamData.matchData.climb.low.percent * 100}%</p>
        <p>Mid climb: {teamData.matchData.climb.mid.can} {teamData.matchData.climb.mid.percent * 100}%</p>
        <p>High climb: {teamData.matchData.climb.high.can} {teamData.matchData.climb.high.percent * 100}%</p>
        <p>Traverse climb: {teamData.matchData.climb.traverse.can} {teamData.matchData.climb.traverse.percent * 100}%</p>
        {/if}

        {#if teamData.notes}
            <h1>Other notes:</h1>
            <p>{teamData.notes.notes}</p>
        {/if}

        {#if teamData.pitData}
        <br>
        <h2><strong>Pit data:</strong></h2>
        <p>Climb: {teamData.pitData.climb}</p>
        <p>Hub: Up: {teamData.pitData.hub.upper} Low: {teamData.pitData.hub.lower} </p>
        <p>Strengths: {teamData.pitData.strengths}</p>
        <p>Weaknesses: {teamData.pitData.weakness} </p>
        <p>Other: {teamData.pitData.comments}</p>
        <h3>Auto:</h3>
        <p>Can auto?: {teamData.pitData.auto}</p>
        <p>Cargo: {teamData.pitData.cargoAuto} </p>
        {/if}
    </div>
</main>
<style>    
    div {
        width: 300px;
        height: 1200px;
        float: left;
    }
    .red {
        background-color: var(--light-red);
    }
    .blue {
        background-color: var(--light-blue);
    }
</style>