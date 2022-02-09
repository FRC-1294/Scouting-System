<script lang="ts">
	import { page } from '$app/stores';
</script>

<div>
    <style>
        h2 {
	        font-size: 1rem;
            text-align: center;
        }   
        button {
            
        }
    </style>
    <h1>
        <a sveltekit:prefetch href="/login/discord"><button>Login With Discord</button></a>
    </h1>    
    <h2>
        <a sveltekit:prefetch href="/login/email"><button>Login With Email</button></a>
    </h2>
</div>