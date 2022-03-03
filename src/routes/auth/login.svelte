<script context="module" lang="ts">
	//PROBLEM It's not getting the session properly, no idea how to fix
	import { getStores, navigating, page, session, updated } from '$app/stores'
	import type {Load} from '@sveltejs/kit'
    export const load: Load = async (obj) => { //TODO access session here
		let session = obj.session
		console.log(session)
		if ((session ?? false)) {
    return {
        status: 302,
        redirect: "/"
    }
    }
		return {}
    }
</script>

<script lang="ts">
    let user = {username: "",
        password: ""}
    let error
    async function login() {
        const response = await fetch('/auth/api/login', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        }
      })
  
      if (!response.ok) {
        error = (await response.json()).message
        return
      }
  
      // @ts-ignore
      window.location = '/'
    }

    function testKey(event) {
        if(event.keycode == 13) {
            login()
        }
    }
</script>

<svelte:window on:keydown={testKey} />
<main>
    <div>
      <form on:submit|preventDefault={login}>
        <input bind:value={user.username} type="text" placeholder="Username">
        <input bind:value={user.password} type="password" placeholder="Password">
        <button on:click={login}>Login!</button>
        <br>
        <a href="/auth/signup">Create account</a>
        {#if error}          
          <p>{error}</p>
        {/if}

      </form>
    </div>
</main>

<style>
</style>