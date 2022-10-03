<script lang="ts">
    import TeamDataWidget from "$lib/TeamDataWidget.svelte";
    export let data: App.Team;
</script>

<main>
    <TeamDataWidget teamData={data}></TeamDataWidget>
</main>

<style>
</style>