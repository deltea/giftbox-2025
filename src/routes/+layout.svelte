<script lang="ts">
	import "./layout.css";

	let { children } = $props();
</script>

<svelte:head>
	<title>The Gacha Machine</title>
</svelte:head>

{@render children()}
