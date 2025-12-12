<script lang="ts">
  import { deinit, init } from "$lib";
  import { onMount } from "svelte";

  onMount(() => {
    init();
    return deinit;
  });
</script>

<main id="container"></main>
