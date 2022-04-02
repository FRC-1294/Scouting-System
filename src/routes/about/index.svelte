<main>
    <div class="content">
        <h1>About the scouting system</h1>
        <p>
            Hi! I'm Sam (AKA Traffic Cone). I created the scouting system during the 2021-22 season for the game Rapid React.     
            <br>The goal of the system was to replace paper-and-pencil scouting, which was a huge pain. We had to keep track of 30 papers,
            pass them out and collect them every match, queue future matches, and manually input data. Our scouting leads were often
            stressed out with no breaks.
        </p>
        
        <h2>Acknowledgements:</h2>
        <p>
            I want to thank our team's board, for supporting the idea from it's creation to it's completion. <br>
            I want to thank the programming subteam for their help in testing and their input, helping make it
            reliable and better to use. <br>
            I want to thank Izzy, Skye, and Avery for their support, advice, and help making this happen, 
            both on a technical side and at competitions. <br>
            And last, but not least, I want to thank Bernice, our previous scouting lead.
        </p>

        <h2>Technical information:</h2>
        <p>
            The scouting system is written mostly in Typescript. It uses SvelteKit as it's frontend framework, which provides reactivity
            along with performance. I chose SvelteKit over popular frameworks like React because it is easy to
            understand at a glance, allowing anyone on the programming team to contribute.
        </p>
        <p>
            The system uses MongoDB as it's primary database. I chose Mongo because it is document-oriented and structureless, 
            allowing us to change the collected data and structure of the data on the fly, without complicated SQL queries. The MongoDB
            driver also has brilliant typescript support, keeping everything type-safe and avoiding errors in processing data.
        </p>
        <p>
            We considered many options for how to transfer data between devices. 
            We knew that any wi-fi option was out, as that could interfere with matches.<br>

            One option was using cell phones and cellular data.
            Since cellular is on a different band than wi-fi, it wouldn't interfere with the robots on the field.
            Sadly, cellular service isn't very good in the gyms where events are held, so we were worried about the connection dropping.<br>

            The next option we considered was using bluetooth. However, in order to access bluetooth, you need to use an app. Websites
            cannot access bluetooth. In order to make an app accessible to all members, we would need to build an iPhone version. Sadly,
            in order to build an iPhone app, you need to use a mac. The team does not have any macs, and we did not see the value in 
            investing $800+ just for an app.<br>

            We eventually settled on using school or personal laptops. They have ethernet ports, allowing us to use hard-wired local
            networking. For laptops that don't have ethernet ports, we bought some USB-Ethernet adapters. Since it's a website, any laptop
            that has an up-to-date browser can use the system.<br>
        </p>
    </div>
</main>
<style>    
	.content {
		width: 100%;
		max-width: var(--column-width);
		margin: var(--column-margin-top) auto 0 auto;
        font-size: larger;
	}
</style>