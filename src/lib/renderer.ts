import { Grid } from "./grid";
import type { EngineConfig } from "./types";

export class Renderer {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private config: EngineConfig;

  constructor(config: EngineConfig) {
    this.config = config;
  }

  init(): void {
    this.canvas = document.createElement("canvas");
    const container = document.getElementById(this.config.containerId);

    if (!container) {
      throw new Error(
        `Container with id "${this.config.containerId}" not found`
      );
    }

    container.appendChild(this.canvas);
    container.style.padding = `${this.config.padding}px`;

    const displayWidth = this.config.gridWidth * (this.config.fontSize / 1.5);
    const displayHeight = this.config.gridHeight * this.config.fontSize;

    this.canvas.width = displayWidth * this.config.pixelRatio;
    this.canvas.height = displayHeight * this.config.pixelRatio;

    this.canvas.style.width = displayWidth + "px";
    this.canvas.style.height = displayHeight + "px";

    this.ctx = this.canvas.getContext("2d");
    if (!this.ctx) {
      throw new Error("Failed to get 2D context from canvas");
    }
  }

  render(grid: Grid): void {
    if (!this.ctx || !this.canvas) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.font = `${this.config.fontSize * this.config.pixelRatio}px monospace`;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        const cell = grid.cells[y][x];
        this.ctx.fillStyle = cell.color;
        this.ctx.fillText(
          cell.char,
          (x + 0.5) * (this.config.fontSize / 1.5) * this.config.pixelRatio,
          (y + 0.5) * this.config.fontSize * this.config.pixelRatio
        );
      }
    }
  }

  destroy(): void {
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    this.canvas = null;
    this.ctx = null;
  }
}
