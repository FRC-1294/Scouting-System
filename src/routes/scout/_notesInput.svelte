<script lang="ts">
import { onMount } from "svelte";


    export let data: App.ScoutedNotes;

</script>

<main>
    <div class="notes">
        <div class="head">
            <h1>{data.teamNumber}</h1>   
        </div>
        <textarea bind:value={data.notes} rows=10 cols=40 id="notes" />
    </div>
</main>

<style>
    .notes {        
        width: fit-content;
        height: 400px;
        float: left;
    }
    .head {
        width: 100%;
		background-color: var(--Robot-Color);
    }
    .head h1 {
        color: white;
    }

</style>