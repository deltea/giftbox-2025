<script lang="ts">
  import { onMount } from "svelte";

  interface Cell {
    char: string;
    color: string;
  }

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let dims = $state({ width: 0, height: 0 });
  let grid: Cell[][] = $state([]);
  const fontSize = 16;
  const padding = 24;
  const pixelRatio = 2;
  let animationId: number;

  function drawRect(x: number, y: number, w: number, h: number, char: string = " ", color: string = "var(--color-fg)") {
    for (let i = y; i < y + h; i++) {
      for (let j = x; j < x + w; j++) {
        if (i >= 0 && i < dims.height && j >= 0 && j < dims.width) {
          grid[i][j] = { char, color };
        }
      }
    }
  }

  function drawText(x: number, y: number, text: string, color: string = "var(--color-fg)", center: boolean = true) {
    const startX = center ? x - Math.floor(text.length / 2) : x;
    for (let i = 0; i < text.length; i++) {
      const posX = startX + i;
      if (y >= 0 && y < dims.height && posX >= 0 && posX < dims.width) {
        grid[y][posX] = { char: text.charAt(i), color };
      }
    }
  }

  function init() {
    grid = Array(dims.height).fill(null).map(() => Array(dims.width).fill(" "));
  }

  function update(currentTime: number) {
    const time = currentTime * 0.002;
    const chars = " .:-=+*#%@";

    for (let y = 0; y < dims.height; y++) {
      const sinY = Math.sin(y * 0.3 + time);

      for (let x = 0; x < dims.width; x++) {
        const sinX = Math.sin(x * 0.3 + time);
        const sinXY = Math.sin((x + y) * 0.2 + time);

        const value = sinX + sinY + sinXY;
        const normalized = (value + 3) / 6;
        const charIndex = Math.floor(normalized * 9);

        grid[y][x] = { char: chars.charAt(charIndex), color: `hsl(135, 9%, ${normalized * 95 + 5}%)` };
      }
    }

    drawRect(
      Math.floor(dims.width / 4),
      Math.floor(dims.height / 4),
      Math.floor(dims.width / 2),
      Math.floor(dims.height / 2)
    );
    drawText(
      Math.floor(dims.width / 2),
      Math.floor(dims.height / 2) - 2,
      "THE GIFT MACHINE",
      "#ffffff"
    );
    drawText(
      Math.floor(dims.width / 2),
      Math.floor(dims.height / 2) + 2,
      "a small toy made for hack club giftbox",
      "var(--color-fg)"
    );
  }

  function render(currentTime: number) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${fontSize * pixelRatio}px monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let y = 0; y < dims.height; y++) {
      for (let x = 0; x < dims.width; x++) {
        const cell = grid[y][x];
        ctx.fillStyle = cell.color;
        ctx.fillText(
          cell.char,
          (x + 0.5) * (fontSize / 1.5) * pixelRatio,
          (y + 0.5) * fontSize * pixelRatio
        );
      }
    }
  }

  function tick(currentTime: number) {
    update(currentTime);
    render(currentTime);
    animationId = requestAnimationFrame(tick);
  }

  onMount(() => {
    dims.width = Math.floor((window.innerWidth - padding * 2) / fontSize * 1.5);
    dims.height = Math.floor((window.innerHeight - padding * 2) / fontSize);

    init();

    const displayWidth = dims.width * (fontSize / 1.5);
    const displayHeight = dims.height * fontSize;

    canvas.width = displayWidth * pixelRatio;
    canvas.height = displayHeight * pixelRatio;

    canvas.style.width = displayWidth + "px";
    canvas.style.height = displayHeight + "px";

    ctx = canvas.getContext("2d")!;
    animationId = requestAnimationFrame(tick);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  });
</script>

<main class="min-h-screen flex justify-center items-center" style:padding="{padding}px">
  <canvas bind:this={canvas}></canvas>
</main>
