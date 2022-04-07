<script lang="ts">
    import type { Data } from "./[match]";
	import { page } from '$app/stores';
    import TeamDataWidget from "$lib/TeamDataWidget.svelte";

    export let redData: Data[];
    export let blueData: Data[];
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