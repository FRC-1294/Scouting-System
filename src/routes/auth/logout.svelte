<script context="module" lang="ts">
   export const load = async (obj) => {
		let session = obj.session
		if (!session.username) {
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

    onMount((async () => {
        console.log("Logging out")
        await fetch("/auth/api/logout")
        text = "Done"
    }))
</script>

<main>
    <p>{text}</p>
</main>