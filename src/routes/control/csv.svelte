<script lang="ts">
	import { text } from "svelte/internal";


	let res = "Awaiting action"
	let exportData = async () => {
		res = await (await fetch("/control/exportData")).text()
	}
</script>

<main>
	<a href="/control">Back</a>
	<p>
		{res}
	</p>
    <a href="/control/exportData"><input type="submit" class="enabled" value="Download Data"></a>
    <form action="/control/exportData">
        
    </form>
</main>

<style>
	input {
		width: 200px;
		height: 100px;
		border-radius: 10px;
	}
	.enabled {
		background-color: green;
		color: white;

	}
</style>
