<script lang="ts">
	import "./layout.css";

	let { children } = $props();
</script>

<svelte:head>
	<title>the gift machine</title>
</svelte:head>

{@render children()}
