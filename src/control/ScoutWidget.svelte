<script>
    export let name
    export let id
    export let robot
    //Status: disconnected, connected, scouting, submit
    export let status
</script>

<main>
    <div>
        <h1>{name}</h1>
        <h2>{id}</h2>
        <h2>R{robot}</h2>
        <h2>{status}</h2>
        {#if status == "disconnected"}
        <style>div:{background-color: #ff9999;}</style>
        {:else if status == "connected"}
        <style>div:{background-color: #99c2ff;}</style>
        {:else if status == "scouting"}
        <style>div:{background-color: #80ff80;}</style>
        {:else if status == "submit"}
        <style>div:{background-color: #ff66ff;}</style>
        {/if}
    </div>    
</main>
