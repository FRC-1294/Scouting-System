<script>
    import { io } from 'socket.io-client'

    var socket = io('http://localhost:4000', {
        auth: {
            token: "leToken"
        }
    })


	socket.on('connect', function(data) {
        alert(data)
    })
    //Used for urgent alerts
    socket.on("alert", data => alert(data))
    

</script>

<main>
    
</main>