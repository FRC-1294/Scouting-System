<script context="module" lang="ts">
	//PROBLEM It's not getting the session properly, no idea how to fix
	import { getStores, navigating, page, session, updated } from '$app/stores'
	import type {Load} from '@sveltejs/kit'
    export const load: Load = async (obj) => {
		let session = obj.session
		console.log(session)
		if (session.username) {
    return {
        status: 302,
        redirect: "/"
    }
    }
		return {
			props: {
				name: session.fullName
			}
		}
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
        error = (await response.json()).message //TODO implement error message
        return
      }
  
      // @ts-ignore
      window.location = '/'
    }
</script>

<main>
    <div>
        <input bind:value={user.username} type="text" placeholder="Username">
        <input bind:value={user.password} type="password" placeholder="Password">
        <button on:click={login}>Login!</button>
        <p>{error}</p>
    </div>
</main>

<style>
</style>