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
      error = (await response.json()).message
      // @ts-ignore
      window.location = '/'
    }

    function testKey(event) {
        if(event.keycode == 13) {
            login()
        }
    }
</script>

<svelte:window on:keydown={testKey} />
<main>
    <div>
        <form on:submit|preventDefault={login}>
            <input bind:value={user.username} type="text" placeholder="Username">
            <input bind:value={user.fullName} type="text" placeholder="Your Name">
            <input bind:value={user.password} type="password" placeholder="Password">
            <input bind:value={confirmPassword} type="password" placeholder="Confirm Password">
            <button type="submit">Create account!</button>
            <a href="/auth/login">Already have an account?</a>
            {#if error}          
              <p>{error}</p>
            {/if}
        </form>
    </div>
</main>

<style>
</style>