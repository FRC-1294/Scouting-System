<script>
	import { Router, Link, Route } from 'svelte-routing'
	import { io } from 'socket.io-client'

	var socket = io('http://localhost:4000', {
		auth: {
			token: 'leToken',
		},
	})

	//Used for urgent alerts
	socket.on('alert', (data) => alert(data))

	//Scouting and match logic
    let hasSumbitted = false
    let needToSubmit = false
	let currentScoutData = {
		isScout: false,
		robotScouting: -1,
		isRed: false,
	}
	let currentMatchData = {
		matchNumber: -1,
		r1: -1,
		r2: -1,
		r3: -1,
		b1: -1,
		b2: -1,
		b3: -1,
	}
	socket.on('match', (matchData) => {
		currentMatchData = matchData
		currentScoutData.isScout = false
        hasSumbitted = false
        needToSubmit = false
	})
	socket.on('scout', (newScoutData) => {
		currentScoutData = newScoutData
	})
    
    function submit() {

        hasSumbitted = true
        needToSubmit = false
    }
    socket.on('end', () => {
        if(!hasSumbitted && currentScoutData.isScout) {
            alert("The match has ended. Please submit your data.")
            needToSubmit = true
        }
    })
</script>

<main>
    {#if needToSubmit}
        <div id="warning">
            <header>
                <h1 id="warningText">MATCH OVER. PLEASE SUBMIT DATA.</h1>
            </header>            
        </div>       
        <style>
            #warning {
                background-color: #ff0000
            }
            #warningText {
                color: #ffffff
            }
        </style>

    {/if}

	{#if currentMatchData.matchNumber != -1}
		<p>Current match: Q{currentMatchData.matchNumber}</p>
		<br />
	{:else}
		<h1>Welcome! Waiting for data from server.</h1>
	{/if}
	{#if currentScoutData.isScout}
		<p>You are scouting robot {currentScoutData.robotScouting}</p>
	{/if}
</main>

{#if currentScoutData.isRed && currentScoutData.isScout}
	<style>
		body {
			background-color: #ff9999;
		}
	</style>
{:else if currentScoutData.isScout}
	<style>
		body {
			background-color: #9999ff;
		}
	</style>
{/if}
