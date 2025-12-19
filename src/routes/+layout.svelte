<script lang="ts">
	import "./layout.css";

	let { children } = $props();
</script>

<svelte:head>
	<title>little ducky & the shark</title>
</svelte:head>

{@render children()}
