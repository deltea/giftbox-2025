import type { Cell } from "./types";

export interface Grid {
  width: number;
  height: number;
  cells: Cell[][];
}

export class Grid {
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.cells = Array(height).fill(null).map(() => Array(width).fill({ char: " ", color: "var(--color-fg)" }));
  }

  drawRect(x: number, y: number, w: number, h: number, char: string = " ", color: string = "var(--color-fg)") {
    for (let i = y; i < y + h; i++) {
      for (let j = x; j < x + w; j++) {
        if (i >= 0 && i < this.height && j >= 0 && j < this.width) {
          this.cells[i][j] = { char, color };
        }
      }
    }
  }

  drawText(x: number, y: number, text: string, color: string = "var(--color-fg)", center: boolean = true) {
    const startX = center ? x - Math.floor(text.length / 2) : x;
    for (let i = 0; i < text.length; i++) {
      const posX = startX + i;
      if (y >= 0 && y < this.height && posX >= 0 && posX < this.width) {
        this.cells[y][posX] = { char: text.charAt(i), color };
      }
    }
  }
}
