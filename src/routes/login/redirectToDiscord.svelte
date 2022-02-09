<script context="module" lang="ts">
	export const load = async () => {
        return {
            status: 301,
            redirect: "https://discord.com/api/oauth2/authorize?client_id=927729747717419028&redirect_uri=http%3A%2F%2Flocalhost%2Flogin%2Fdiscord&response_type=code&scope=identify"
        }
    }
</script>