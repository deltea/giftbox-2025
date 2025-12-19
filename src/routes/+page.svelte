<script lang="ts">
  import { deinit, init } from "$lib";
  import { showBlahaj } from "$lib/stores";
  import { onMount } from "svelte";

  onMount(() => {
    init();
    return deinit;
  });
</script>

<main id="container" class="relative">
  {#if $showBlahaj}
    <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <img
        src="/blahaj.png"
        alt="blåhaj"
        class="mt-16"
      />
    </div>
  {/if}
</main>
