<script lang="ts">
import TeamDataWidget from "$lib/TeamDataWidget.svelte";

    export let DATA: {MatchData: App.AggregatedTeamData, PitData: App.PitData, red: boolean}[]
</script>

<main>
    {#each DATA as aTeam}
        <TeamDataWidget TeamData={aTeam}></TeamDataWidget>
    {/each}
</main>