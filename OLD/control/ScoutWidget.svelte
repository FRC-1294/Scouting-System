<script>
	export let scout;
	export let boot;
	const defaultStyle =
		'width:180px; height:400px; margin: auto; float:left; border: 5px solid #000000; padding: 10px; background-color:';
	let divStyle;

	function updateColor() {
		if (scout.status == 'disconnected') {
			divStyle = defaultStyle + '#ff9999'; //Red
		}
		if (scout.status == 'connected') {
			divStyle = defaultStyle + '#99c2ff'; //Blue
		}
		if (scout.status == 'scouting') {
			divStyle = defaultStyle + '#80ff80'; //Green
		}
		if (scout.status == 'submit') {
			divStyle = defaultStyle + '#ff66ff'; //Pink
		}
	}
	updateColor();
	setInterval(() => {
		updateColor();
	}, 100);
</script>

<main>
	<div class="a" style={divStyle}>
		<h1>{scout.name}</h1>
		<!--<h2>{scout.id}</h2>-->
		{#if scout.robotScouting}
			<h2>R{scout.robotScouting}</h2>
		{:else}
			<h2>Not Scouting</h2>
		{/if}
		<h2>{scout.status}</h2>
		<button
			on:click={() => {
				boot(scout.id);
			}}>BOOT</button
		>
	</div>
</main>
