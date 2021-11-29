<script>
    export let name
    export let id
    export let robot
    //Status: disconnected, connected, scouting, submit
    export let status
    export let boot
    const defaultStyle = "width:23%; height:400px; margin: auto; float:left; border: 5px solid #000000; padding: 10px; background-color:"
    let divStyle
    if(status == "disconnected") {
        divStyle = defaultStyle + "#ff9999"
    }
    if (status == "connected") {
        divStyle = defaultStyle + "#99c2ff"
    }
    if (status == "scouting") {
        divStyle = defaultStyle + "#80ff80"
    }
    if (status == "submit") {
        divStyle = defaultStyle + "#ff66ff"
    }
</script>

<main>
    <div class="a" style={divStyle}>
        <h1>{name}</h1>
        <h2>{id}</h2>
        <h2>R{robot}</h2>
        <h2>{status}</h2>
        {#if status == "disconnected"}
            <button on:click={() => {boot(id)}}>BOOT</button>
        {/if}
    </div>    
</main>
