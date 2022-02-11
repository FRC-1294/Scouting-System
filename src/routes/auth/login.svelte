<script lang="ts">
    let username
    let password
    let error
    async function login() {
        const response = await fetch('/auth/api/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: {
            'Content-Type': 'application/json'
        }
      })
  
      if (!response.ok) {
        error = (await response.json()).message
        return
      }
  
      // @ts-ignore
      window.location = '/'
    }
</script>

<main>
    <div>
        <input bind:value={username} type="text" placeholder="Username">
        <input bind:value={password} type="password" placeholder="Password">
        <button on:click={login}>Login!</button>
        <p>{error}</p>
    </div>
</main>

<style>
div {
    
}
</style>