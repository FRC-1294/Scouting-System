<script lang="ts">
    import TeamDataWidget from "$lib/TeamDataWidget.svelte";
    import type { Data } from "../match/[match]";
    export let data: Data;
</script>

<main>
    <TeamDataWidget TeamData={data}></TeamDataWidget>
</main>

<style>
</style>