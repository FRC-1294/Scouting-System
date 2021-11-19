<script>
    import { onMount, getContext, setContext } from "svelte";
    import { io } from 'socket.io-client'
    import Match from './Match.svelte'

    var socket = io.connect('http://localhost:4000', {
      withCredentials: false,
      extraHeaders: {
          "ThisIsASuperSecretSecureStringForUseToAuthentimicateTheRandomnessOnMyBackendYouSeriouslyShouldNotUseThisHNxQ3VEvbESFVES32423513452BSIUFVHSFD": "secret value"
      }
    });
	socket.on('connect', function(data) {
    	socket.emit('join', 'Hello World from client');
    });
    socket.on("messages", data => alert(data))

</script>

<main>
    <h1>SCOUTING!</h1>
    <h2>You are scout #123</h2>
    <br>
    <h2>Match:<br>Q12 R1294</h2>

</main>