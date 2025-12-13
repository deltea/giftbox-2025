import { padding, pixelRatio, fontSize, colors } from "./config";
import { EventManager } from "./eventManager";
import { Grid } from "./grid";

const events = new EventManager();

let grid: Grid;

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let animationId: number;

export function init() {
  canvas = document.createElement("canvas");
  const container = document.getElementById("container");
  if (!container) return;
  container.appendChild(canvas);
  container.style.padding = `${padding}px`;

  const dims = {
    width: Math.floor((window.innerWidth - padding * 2) / (fontSize / 1.5)),
    height: Math.floor((window.innerHeight - padding * 2) / fontSize)
  }

  const displayWidth = dims.width * (fontSize / 1.5);
  const displayHeight = dims.height * fontSize;

  canvas.width = displayWidth * pixelRatio;
  canvas.height = displayHeight * pixelRatio;

  canvas.style.width = displayWidth + "px";
  canvas.style.height = displayHeight + "px";

  ctx = canvas.getContext("2d")!;
  animationId = requestAnimationFrame(tick);

  grid = new Grid(dims.width, dims.height);
}

function update(currentTime: number) {
  const time = currentTime * 0.002;
  const chars = " .:-=+*#%@";

  for (let y = 0; y < grid.height; y++) {
    const sinY = Math.sin(y * 0.3 + time);

    for (let x = 0; x < grid.width; x++) {
      const sinX = Math.sin(x * 0.3 + time);
      const sinXY = Math.sin((x + y) * 0.2 + time);

      const value = sinX + sinY + sinXY;
      const normalized = (value + 3) / 6;
      const charIndex = Math.floor(normalized * 9);

      grid.cells[y][x] = { char: chars.charAt(charIndex), color: `hsl(135, 9%, ${normalized * 95 + 5}%)` };
    }
  }

  grid.drawRoundedRect(grid.width / 3, grid.height / 3, grid.width / 3, grid.height / 3, 4);
  grid.drawText(grid.width / 2, grid.height / 2 - 6, "THE GIFT MACHINE (for maddie!)", colors.fg);
  grid.drawText( grid.width / 2, grid.height / 2 - 4, "a small toy made for hack club giftbox", colors.fg);
  grid.drawText(grid.width / 2, grid.height / 2 + 4, "press   and   to start", colors.accent);
  grid.drawText(grid.width / 2 - 5, grid.height / 2 + 4, "⬅", events.isKeyPressed("ArrowLeft") ? colors.fg : colors.accent);
  grid.drawText(grid.width / 2 + 1, grid.height / 2 + 4, "⮕", events.isKeyPressed("ArrowRight") ? colors.fg : colors.accent);
}

function render(currentTime: number) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = `${fontSize * pixelRatio}px monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      const cell = grid.cells[y][x];
      ctx.fillStyle = cell.color;
      ctx.fillText(
        cell.char,
        (x + 0.5) * (fontSize / 1.5) * pixelRatio,
        (y + 0.5) * fontSize * pixelRatio
      );
    }
  }
}

export function tick(currentTime: number) {
  update(currentTime);
  render(currentTime);
  animationId = requestAnimationFrame(tick);
}

export function deinit() {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
}
