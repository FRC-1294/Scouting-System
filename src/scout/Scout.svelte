<script>
    import { onMount, getContext, setContext } from "svelte";

    //import router from "page"
    let router = getContext('router')

    import Match from './Match.svelte'
    let page
    //router('/scout', () => page = null)
    //router('/scout/go', ()=> page = Match)
    router.start()
</script>

<main>
    <h1>SCOUTING!</h1>
    <h2>You are scout #123</h2>
    <br>
    <h2>Match:<br>Q12 R1294</h2>
    <a href="/go">a</a>
    <svelte:component this={page} />

</main>