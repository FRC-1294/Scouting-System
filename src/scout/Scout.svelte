<script>
	import { Router, Link, Route } from 'svelte-routing'
	import { io } from 'socket.io-client'
	import { writable } from 'svelte/store'
	
	var socket = io('http://localhost:4000')
	//Login
	let isLoggedIn = false
	let name = localStorage.getItem("name") ?? ""
	let id = localStorage.getItem("id") ?? undefined
	let password
	
	if(id) {
		login()
	}

	//TODO: Figure out if it's possible to have events outside the login function
	function login() {
		localStorage.setItem("name", name)
		socket.emit("login", {
			id: id,
			name: name,
			password: password
		}, (ack) => {
			alert(JSON.stringify(ack))
			if(ack.loggedIn) {
				id = ack.id
				localStorage.setItem("id", ack.id)
				isLoggedIn = true
			}
		})
	
	}
	
	socket.on('alert', (data) => alert(data))
	socket.on('match', (matchData) => {
		currentMatchData = matchData
		currentScoutData.isScout = false
        hasSumbitted = false
        needToSubmit = false
	})
	socket.on('scout', (newScoutData) => {
		currentScoutData = newScoutData
	})
	socket.on('end', () => {
        if(!hasSumbitted && currentScoutData.isScout) {
            alert("The match has ended. Please submit your data.")
            needToSubmit = true
        }
    })

	//Used for urgent alerts
	

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
		//TODO do I really need to send all the robots to each scout?
		r1: -1,
		r2: -1,
		r3: -1,
		b1: -1,
		b2: -1,
		b3: -1,
	}
	
	//DATA
    let leTestData
    function submit() {
		socket.emit("data", {
			teamNumber: currentScoutData.robotScouting,
			matchNumber: currentMatchData.matchNumber,
			leUberFunTEstingData: leTestData
		})
        hasSumbitted = true
        needToSubmit = false
    }
   
</script>

<main>
	<!--Need to sumbit warning-->
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

	<!--Login-->

	{#if !isLoggedIn}
		<h1>LOGIN</h1>
		<label for="nameInput">Name:</label><input bind:value={name} id="nameInput" placeholder="Name" title="Name" type="text">
		<label for="passwordInput">Password:</label><input bind:value={password} id="passwordInput" placeholder="Password" title="Password" type="password">
		<button on:click={login} >Login</button>
	{/if}

	<!--Scouting-->
	{#if currentMatchData.matchNumber != -1}
		<p>Current match: Q{currentMatchData.matchNumber}</p>
		<br />
	{:else}
		<h1>Welcome! Waiting for data from server.</h1>
	{/if}
	{#if currentScoutData.isScout}
		<p>You are scouting robot {currentScoutData.robotScouting}</p>
		<!--Data collection here-->
		{#if !hasSumbitted}
			<input bind:value={leTestData} placeholder="DATA LEL">
			<!--TODO add safety for submitting data-->
			<button on:click={submit}>Submit data</button>
		{/if}
	{:else}
		<p>You are not scouting this match</p>
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
{:else}
	<style>
		body {
			background-color: #ffffff;
		}
	</style>
{/if}
