<script lang="ts">
    let user = {username: "",
        password: "",
    fullName: ""}
    let error
    let confirmPassword
    async function login() {
        const response = await fetch('/auth/api/signup', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        }
      })
  
      if (!response.ok) {
        error = (await response.json()).message //TODO implement error message
        return
      }
  
      // @ts-ignore
      window.location = '/'
    }
</script>

<main>
    <div>
        <input bind:value={user.username} type="text" placeholder="Username">
        <input bind:value={user.fullName} type="text" placeholder="Your Name">
        <input bind:value={user.password} type="password" placeholder="Password">
        <input bind:value={confirmPassword} type="password" placeholder="Confirm Password">
        <button on:click={login}>Login!</button>
        <p>{error}</p>
    </div>
</main>

<style>
div {
    
}
</style>