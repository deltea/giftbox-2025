import { config } from "./config";
import type { Cell } from "./types";

/**
 * renders a ascii grid to the canvas
 * has a bunch of util methods for drawing shapes and text
 */
export class Renderer {
  canvas: HTMLCanvasElement | null = null;
  ctx: CanvasRenderingContext2D | null = null;
  width: number;
  height: number;
  layers: Cell[][][];
  layerCount: number;

  constructor(width: number, height: number, layerCount: number = 8) {
    this.width = width;
    this.height = height;
    this.layerCount = layerCount;
    this.layers = Array.from({ length: layerCount }, () => this.createLayer());
  }

  private createLayer(): Cell[][] {
    return Array.from({ length: this.height }, () =>
      Array.from({ length: this.width }, () => ({ char: " ", color: config.colors.fg }))
    );
  }

  init(): void {
    this.canvas = document.createElement("canvas");
    const container = document.getElementById(config.containerId);

    if (!container) {
      throw new Error(`container with id "${config.containerId}" not found`);
    }

    container.appendChild(this.canvas);
    container.style.padding = `${config.padding}px`;

    const displayWidth = config.dims.width * (config.fontSize / 1.5);
    const displayHeight = config.dims.height * config.fontSize;

    this.canvas.width = displayWidth * config.pixelRatio;
    this.canvas.height = displayHeight * config.pixelRatio;

    this.canvas.style.width = displayWidth + "px";
    this.canvas.style.height = displayHeight + "px";

    this.ctx = this.canvas.getContext("2d");
    if (!this.ctx) {
      throw new Error("failed to get 2d context from canvas");
    }
  }

  render(): void {
    if (!this.ctx || !this.canvas) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.font = `${config.fontSize * config.pixelRatio}px monospace`;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const cell = this.getCompositeCell(x, y);
        this.ctx.fillStyle = cell.color;
        this.ctx.fillText(
          cell.char,
          (x + 0.5) * (config.fontSize / 1.5) * config.pixelRatio,
          (y + 0.5) * config.fontSize * config.pixelRatio
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

  getCell(x: number, y: number, layer: number = 0): Cell | null {
    const posX = Math.floor(x);
    const posY = Math.floor(y);
    const safeLayer = this.clampLayer(layer);
    if (posY >= 0 && posY < this.height && posX >= 0 && posX < this.width) {
      return this.layers[safeLayer][posY][posX];
    }
    return null;
  }

  setCell(x: number, y: number, char: string, color: string = config.colors.fg, layer: number = 0) {
    const posX = Math.floor(x);
    const posY = Math.floor(y);
    const safeLayer = this.clampLayer(layer);
    if (posY >= 0 && posY < this.height && posX >= 0 && posX < this.width) {
      this.layers[safeLayer][posY][posX] = { char, color };
    }
  }

  private clampLayer(layer: number): number {
    if (Number.isNaN(layer)) return 0;
    return Math.min(this.layerCount - 1, Math.max(0, Math.floor(layer)));
  }

  private getCompositeCell(x: number, y: number): Cell {
    let cell: Cell | null = null;
    for (let layer = 0; layer < this.layerCount; layer++) {
      const current = this.layers[layer][y][x];
      if (cell === null || current.char !== " ") {
        cell = current;
      }
    }
    return cell || { char: " ", color: config.colors.fg };
  }

  // drawing methods
  clear(layer?: number): void {
    const layersToClear = typeof layer === "number" ? [this.clampLayer(layer)] : Array.from({ length: this.layerCount }, (_, i) => i);

    for (const layerIndex of layersToClear) {
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          this.layers[layerIndex][y][x] = { char: " ", color: config.colors.fg };
        }
      }
    }
  }

  drawRect(x: number, y: number, w: number, h: number, char: string = " ", color: string = config.colors.fg, layer: number = 0) {
    const pos = { x: Math.floor(x), y: Math.floor(y) };
    const dims = { w: Math.floor(w), h: Math.floor(h) };
    for (let i = pos.y; i < pos.y + dims.h; i++) {
      for (let j = pos.x; j < pos.x + dims.w; j++) {
        if (i >= 0 && i < this.height && j >= 0 && j < this.width) {
          this.setCell(j, i, char, color, layer);
        }
      }
    }
  }

  drawRoundedRect(x: number, y: number, w: number, h: number, radius: number, char: string = " ", color: string = config.colors.fg, layer: number = 0) {
    const pos = { x: Math.floor(x), y: Math.floor(y) };
    const dims = { w: Math.floor(w), h: Math.floor(h) };
    for (let i = pos.y; i < pos.y + dims.h; i++) {
      for (let j = pos.x; j < pos.x + dims.w; j++) {
        const inCorner =
          (i < pos.y + radius && j < pos.x + radius && (Math.pow(j - (pos.x + radius), 2) + Math.pow(i - (pos.y + radius), 2) > Math.pow(radius, 2))) ||
          (i < pos.y + radius && j >= pos.x + dims.w - radius && (Math.pow(j - (pos.x + dims.w - radius - 1), 2) + Math.pow(i - (pos.y + radius), 2) > Math.pow(radius, 2))) ||
          (i >= pos.y + dims.h - radius && j < pos.x + radius && (Math.pow(j - (pos.x + radius), 2) + Math.pow(i - (pos.y + dims.h - radius - 1), 2) > Math.pow(radius, 2))) ||
          (i >= pos.y + dims.h - radius && j >= pos.x + dims.w - radius && (Math.pow(j - (pos.x + dims.w - radius - 1), 2) + Math.pow(i - (pos.y + dims.h - radius - 1), 2) > Math.pow(radius, 2)));
        if (i >= 0 && i < this.height && j >= 0 && j < this.width && !inCorner) {
          this.setCell(j, i, char, color, layer);
        }
      }
    }
  }

  drawRectBorder(x: number, y: number, w: number, h: number, char: string = " ", color: string = config.colors.fg, layer: number = 0) {
    const pos = { x: Math.floor(x), y: Math.floor(y) };
    const dims = { w: Math.floor(w), h: Math.floor(h) };
    for (let i = pos.y; i < pos.y + dims.h; i++) {
      for (let j = pos.x; j < pos.x + dims.w; j++) {
        if (i >= 0 && i < this.height && j >= 0 && j < this.width) {
          if (i === pos.y || i === pos.y + dims.h - 1 || j === pos.x || j === pos.x + dims.w - 1) {
            this.setCell(j, i, char, color, layer);
          }
        }
      }
    }
  }

  drawRectBorderFancy(x: number, y: number, w: number, h: number, color: string = config.colors.fg, layer: number = 0) {
    this.drawRectBorder(x, y, w, h, "#", color, layer);
    this.setCell(x, y, "+", color, layer);
    this.setCell(x + w - 1, y, "+", color, layer);
    this.setCell(x, y + h - 1, "+", color, layer);
    this.setCell(x + w - 1, y + h - 1, "+", color, layer);
    for (let i = x + 1; i < x + w - 1; i++) {
      this.setCell(i, y, "-", color, layer);
      this.setCell(i, y + h - 1, "-", color, layer);
    }
    for (let i = y + 1; i < y + h - 1; i++) {
      this.setCell(x, i, "|", color, layer);
      this.setCell(x + w - 1, i, "|", color, layer);
    }
  }

  drawText(x: number, y: number, text: string, color: string = config.colors.fg, center: boolean = true, layer: number = 0) {
    const pos = { x: Math.floor(x), y: Math.floor(y) };
    const startX = center ? pos.x - Math.floor(text.length / 2) : pos.x;
    for (let i = 0; i < text.length; i++) {
      const posX = startX + i;
      if (pos.y >= 0 && pos.y < this.height && posX >= 0 && posX < this.width) {
        this.setCell(posX, pos.y, text.charAt(i), color, layer);
      }
    }
  }

  drawArt(x: number, y: number, w: number, h: number, art: string[][], color: string = config.colors.fg, layer: number = 0) {
    const pos = { x: Math.floor(x), y: Math.floor(y) };

    for (let i = 0; i < h; i++) {
      for (let j = 0; j < w; j++) {
        const posX = pos.x + j;
        const posY = pos.y + i;
        const artCell = art[i][j]
        if (posY >= 0 && posY < this.height && posX >= 0 && posX < this.width) {
          if (artCell && artCell !== " ") {
            this.setCell(posX, posY, artCell, color, layer);
          }
        }
      }
    }
  }
}
