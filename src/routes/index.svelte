<script context="module" lang="ts">
	//PROBLEM It's not getting the session properly, no idea how to fix
	import { getStores, navigating, page, session, updated } from '$app/stores'
	import type {Load} from '@sveltejs/kit'
    export const load: Load = async (obj) => {
		let session = obj.session
		if (!(session ?? false)) {
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
	
	import Counter from '$lib/Counter.svelte'
	let sessionName = $session.fullName
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
	<h1>
		<div class="welcome">
			<picture>
				
				<img src="svelte-welcome.png" alt="Welcome" />
			</picture>
		</div>

		to the scouting system!
		{sessionName}
	</h1>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>
