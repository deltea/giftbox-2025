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

  drawRoundedRect(x: number, y: number, w: number, h: number, radius: number, char: string = " ", color: string = "var(--color-fg)") {
    for (let i = y; i < y + h; i++) {
      for (let j = x; j < x + w; j++) {
        const inCorner =
          (i < y + radius && j < x + radius && (Math.pow(j - (x + radius), 2) + Math.pow(i - (y + radius), 2) > Math.pow(radius, 2))) ||
          (i < y + radius && j >= x + w - radius && (Math.pow(j - (x + w - radius - 1), 2) + Math.pow(i - (y + radius), 2) > Math.pow(radius, 2))) ||
          (i >= y + h - radius && j < x + radius && (Math.pow(j - (x + radius), 2) + Math.pow(i - (y + h - radius - 1), 2) > Math.pow(radius, 2))) ||
          (i >= y + h - radius && j >= x + w - radius && (Math.pow(j - (x + w - radius - 1), 2) + Math.pow(i - (y + h - radius - 1), 2) > Math.pow(radius, 2)));
        if (i >= 0 && i < this.height && j >= 0 && j < this.width && !inCorner) {
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

  getMouseCell(mouseX: number, mouseY: number, fontSize: number, pixelRatio: number): Cell | null {
    const x = Math.floor(mouseX / ((fontSize / 1.5) * pixelRatio));
    const y = Math.floor(mouseY / (fontSize * pixelRatio));
    if (y >= 0 && y < this.height && x >= 0 && x < this.width) {
      return this.cells[y][x];
    }
    return null;
  }

  addButton(x: number, y: number, w: number, h: number, color: string = "var(--color-fg)", label: string, onClick: () => void) {
    // this.drawRect(x, y, w, h, " ", );
    this.drawText(x + Math.floor(w / 2), y + Math.floor(h / 2), label, color, true);
    for (let i = y; i < y + h; i++) {
      for (let j = x; j < x + w; j++) {
        if (i >= 0 && i < this.height && j >= 0 && j < this.width) {
          this.cells[i][j].onClick = onClick;
        }
      }
    }
  }
}
