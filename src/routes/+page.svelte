<script lang="ts">
  import { onMount } from "svelte";

  interface Pixel {
    char: string;
    hex: string;
  }

  let dims = $state({ width: 0, height: 0 });
  const fontSize = 12;
  const padding = 24;
  let grid: Pixel[][] = $state([]);

  onMount(() => {
    dims.width = Math.floor((window.innerWidth - padding * 2) / fontSize * 1.5);
    dims.height = Math.floor((window.innerHeight - padding * 2) / fontSize);

    for (let y = 0; y < dims.height; y++) {
      const row: Pixel[] = [];
      for (let x = 0; x < dims.width; x++) {
        row.push({ char: "o", hex: "#839788" });
      }
      grid.push(row);
    }
  });
</script>

<main
  class="min-h-screen grid justify-center items-center"
  style:grid-template-columns="repeat({dims.width}, {fontSize / 1.5}px)"
  style:grid-template-rows="repeat({dims.height}, {fontSize}px)"
  style:font-size="{fontSize}px"
  style:padding="{padding}px"
>
  {#each grid as row}
    {#each row as pixel}
      <span
        class="flex h-full justify-center items-center"
        style:color={pixel.hex}
        style:font-size="{fontSize}px"
      >{pixel.char}</span>
    {/each}
  {/each}
</main>
