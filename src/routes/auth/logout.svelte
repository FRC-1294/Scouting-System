<script context="module" lang="ts">
import type { Load } from '@sveltejs/kit';
   export const load: Load = async (obj) => {
       
    console.log("Logging out")
		let session = obj.session
		if (!session) {
    return {
        status: 302,
        redirect: "/auth/login"
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
    import { goto } from "$app/navigation"
import { onMount } from "svelte";

    let text = "Signing out...";

    let logoutFunction = (async () => {
        alert("Logging out!")
        console.log("Logging out")
        await fetch("/auth/api/logout")
        location.reload()
        text = "Done"
    })
    onMount(logoutFunction)
</script>

<main>
    <p>{text}</p>
</main>