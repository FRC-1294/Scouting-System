<script lang="ts" context="module">
import type { Load } from "@sveltejs/kit";
import Match from "../match/[match].svelte";


    export const load: Load = async function({ params, fetch, session, stuff }) {
        let matchData = await fetch(`/data/api/team/${params.team}`)
        let pitData = await fetch(`/data/api/team/pit/${params.team}`)
        console.log("Requests:")
        let realMatchData = await matchData.json()
        let realPitData = await pitData.json()
        return {
            props: {
                MatchData: realMatchData.data,
                PitData: realPitData.data
            }
        }
    }
</script>

<script lang="ts">
    export let MatchData: App.AggregatedTeamData;
    export let PitData: App.PitData;
</script>

<main>
    {#if MatchData}
    <h1>{MatchData._id}</h1>
    <p>Climb: {MatchData.climb}</p>
    <p>Average balls Teleop: {MatchData.averageCargoTele} </p>
    <p>Average balls Auto: {MatchData.averageCargoAuto} </p>
    <p>Defense percentage: {MatchData.defensePercent * 100}%</p>
    <p>Reliable percentage: {MatchData.reliablePercent * 100}%</p>
    <p>Percent Stuck: {MatchData.stuckPercent * 100}%</p>
    <p>Low climb: {MatchData.climb.low.can} {MatchData.climb.low.percent * 100}%</p>
    <p>Mid climb: {MatchData.climb.mid.can} {MatchData.climb.mid.percent * 100}%</p>
    <p>High climb: {MatchData.climb.high.can} {MatchData.climb.high.percent * 100}%</p>
    <p>Traverse climb: {MatchData.climb.traverse.can} {MatchData.climb.traverse.percent * 100}%</p>
    {/if}

    {#if PitData}
    <br>
    <h2><strong>Pit data:</strong></h2>
    <p>Hub: Up: {PitData.hub.upper} Low: {PitData.hub.lower} </p>
    <p>Strengths: {PitData.strengths}</p>
    <p>Weaknesses: {PitData.weakness} </p>
    <p>Other: {PitData.comments}</p>
    <h3>Auto:</h3>
    <p>Can auto?: {PitData.auto}</p>
    <p>Cargo: {PitData.cargoAuto} </p>
    {/if}
</main>

<style>
    h2 {
        font-size: 20px;
    }
</style>