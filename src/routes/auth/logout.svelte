<script context="module" lang="ts">
   export const load = async (obj) => {
		let session = obj.session
		console.log(session)
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
    (async () => {
        await fetch("/auth/api/logout")
        goto("/auth/login", {replaceState: false})
    })()
</script>

<main>
    <p>Signing out...</p>
</main>