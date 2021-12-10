<script>
    export let scout
    export let boot
    const defaultStyle = "width:23%; height:400px; margin: auto; float:left; border: 5px solid #000000; padding: 10px; background-color:"
    let divStyle
    if(scout.status == "disconnected") {
        divStyle = defaultStyle + "#ff9999"
    }
    if (scout.status == "connected") {
        divStyle = defaultStyle + "#99c2ff"
    }
    if (scout.status == "scouting") {
        divStyle = defaultStyle + "#80ff80"
    }
    if (scout.status == "submit") {
        divStyle = defaultStyle + "#ff66ff"
    }
</script>

<main>
    <div class="a" style={divStyle}>
        <h1>{scout.name}</h1>
        <h2>{scout.id}</h2>
        <h2>R{scout.robotScouting}</h2>
        <h2>{scout.status}</h2>
        <button on:click={() => {scout.boot(scout.id)}}>BOOT</button>
        
    </div>    
</main>
