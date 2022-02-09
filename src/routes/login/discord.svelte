<script lang='ts'>
    import { page } from '$app/stores'
    const code = $page.url.searchParams.get('code')
</script>

<div>
    <p>{code}</p>
</div>