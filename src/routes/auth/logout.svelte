<script context="module" lang="ts">
    export function load({fetch}) {
        fetch("/auth/api/logout")
        return {
            status: 301,
            redirect: "/auth/login"
        }
    }
</script>