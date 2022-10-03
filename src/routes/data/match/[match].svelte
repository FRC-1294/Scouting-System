<script lang="ts">
	import { page } from '$app/stores';
    import TeamDataWidget from "$lib/TeamDataWidget.svelte";

    export let redData: App.Team[];
    export let blueData: App.Team[];
</script>

<main>
    <title>Data for match {$page.params.match}</title>
    <table>
        <tr>
            {#each redData as aTeam}
            <td>
                <TeamDataWidget teamData={aTeam} red></TeamDataWidget>
            </td>
            {/each}
        </tr>
        <tr>
            {#each blueData as aTeam}
            <td>
                <TeamDataWidget teamData={aTeam}></TeamDataWidget>
            </td>
            {/each}
        </tr>
    </table>
</main>