<script lang="ts">
    let username
    let password
    function login() {
        alert("Haha your password is " + password)
    }
</script>

<main>
    <div>
        <input bind:value={username} type="text" placeholder="Username">
        <input bind:value={password} type="password" placeholder="Password">
        <button on:click={login}>Login!</button>
    </div>
</main>

<style>
div {
    
}
</style>