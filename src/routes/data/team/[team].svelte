<script lang="ts">
    import TeamDataWidget from "$lib/TeamDataWidget.svelte";
    export let data: App.CompleteTeamData;
</script>

<main>
    <TeamDataWidget TeamData={data}></TeamDataWidget>
</main>

<style>
</style>