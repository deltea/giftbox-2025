import { colors } from "./config";
import type { Cell } from "./types";

export class Grid {
  width: number;
  height: number;
  cells: Cell[][];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.cells = Array(height)
      .fill(null)
      .map(() =>
        Array(width).fill({ char: " ", color: colors.fg })
      );
  }

  clear(): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.cells[y][x] = { char: " ", color: colors.fg };
      }
    }
  }

  drawRect(x: number, y: number, w: number, h: number, char: string = " ", color: string = colors.fg) {
    const pos = { x: Math.floor(x), y: Math.floor(y) };
    const dims = { w: Math.floor(w), h: Math.floor(h) };
    for (let i = pos.y; i < pos.y + dims.h; i++) {
      for (let j = pos.x; j < pos.x + dims.w; j++) {
        if (i >= 0 && i < this.height && j >= 0 && j < this.width) {
          this.cells[i][j] = { char, color };
        }
      }
    }
  }

  drawRoundedRect(x: number, y: number, w: number, h: number, radius: number, char: string = " ", color: string = colors.fg) {
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
          this.cells[i][j] = { char, color };
        }
      }
    }
  }

  drawText(x: number, y: number, text: string, color: string = colors.fg, center: boolean = true) {
    const pos = { x: Math.floor(x), y: Math.floor(y) };
    const startX = center ? pos.x - Math.floor(text.length / 2) : pos.x;
    for (let i = 0; i < text.length; i++) {
      const posX = startX + i;
      if (pos.y >= 0 && pos.y < this.height && posX >= 0 && posX < this.width) {
        this.cells[pos.y][posX] = { char: text.charAt(i), color };
      }
    }
  }

  getMouseCell(mouseX: number, mouseY: number, fontSize: number, pixelRatio: number): Cell | null {
    const x = Math.floor(mouseX / ((fontSize / 1.5) * pixelRatio));
    const y = Math.floor(mouseY / (fontSize * pixelRatio));
    if (y >= 0 && y < this.height && x >= 0 && x < this.width) {
      return this.cells[y][x];
    }
    return null;
  }
}
