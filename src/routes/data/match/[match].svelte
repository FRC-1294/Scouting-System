<script lang="ts">
	import { page } from '$app/stores';
    import TeamDataWidget from "$lib/TeamDataWidget.svelte";

    export let redData: App.CompleteTeamData[];
    export let blueData: App.CompleteTeamData[];
</script>

<main>
    <title>Data for match {$page.params.match}</title>
    <table>
        <tr>
            {#each redData as aTeam}
            <td>
                <TeamDataWidget TeamData={aTeam}></TeamDataWidget>
            </td>
            {/each}
        </tr>
        <tr>
            {#each blueData as aTeam}
            <td>
                <TeamDataWidget TeamData={aTeam}></TeamDataWidget>
            </td>
            {/each}
        </tr>
    </table>
</main>