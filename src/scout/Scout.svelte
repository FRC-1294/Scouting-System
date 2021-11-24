<script>
    import { Router, Link, Route } from "svelte-routing"
    import { io } from 'socket.io-client'

    var socket = io('http://localhost:4000', {
        auth: {
            token: "leToken"
        }
    })


	//Used for urgent alerts
    socket.on("alert", data => alert(data))
    
    //Scouting and match logic
    let currentScoutData = {
        isScout: false,
        robotScouting: -1,
        isRed: false
    }
    let currentMatchData = {
        matchNumber: -1,
        r1: -1,
        r2: -1,
        r3: -1,
        b1: -1,
        b2: -1,
        b3: -1
    }
    socket.on("match", matchData => {
        currentMatchData = matchData
    })
    socket.on("scout", newScoutData => {
        currentScoutData = newScoutData
    })

</script>

<main>
    <h1>Welcome!</h1>
    {#if currentMatchData.matchNumber != -1}
        <p>Current match: Q{currentMatchData.matchNumber}</p> 
        <br>
    {/if}
    {#if currentScoutData.isScout}
        <p>You are scouting robot {currentScoutData.robotScouting}</p>        
    {/if}
</main>


{#if currentScoutData.isRed && currentScoutData.isScout}
        <style>
            body {background-color: #ff9999;}
    
        </style>
    {:else}
        <style>
            body {background-color: #9999ff;}
    
        </style>
    {/if}
