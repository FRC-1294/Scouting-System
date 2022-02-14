<script>
  import Input from 'OLD/Example form/Input.svelte';
  import Button from 'OLD/Example form/Button.svelte';

  import { createEventDispatcher } from 'svelte';

  let username = '';
  let password = '';

  const dispatch = createEventDispatcher();

  function submit() {
    dispatch('submit', {
        username,
    password
    })
  }
</script>

<form on:submit|preventDefault={submit} class='space-y-5 {$$props.class}'>
  <Input label='User Name' id='username' name='username' type='text' bind:value={username} required />
  <Input label='Password' id='password' name='password' type='password' bind:value={password} required />
  <Button type='submit'>Sign In</Button>
</form>