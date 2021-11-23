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

</script>

<main>
    <h1>Welcome!</h1>
    {#if currentMatchData.matchNumber != -1}
        <p>Current match: Q{currentMatchData.matchNumber}</p> 
        <br>
    {/if}
    <Router baseUrl="/scout">
        <Route path="/match"><p>Red 1:{currentMatchData.r1}</p> <style>p: {color: #FF0000;}</style></Route>
    </Router>
</main>