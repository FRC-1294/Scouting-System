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
    import TeamDataWidget from "$lib/TeamDataWidget.svelte";
    export let MatchData: App.AggregatedTeamData;
    export let PitData: App.PitData;
</script>

<main>
    <TeamDataWidget TeamData={{MatchData: MatchData, PitData: PitData, red: false}}></TeamDataWidget>
</main>

<style>
</style>