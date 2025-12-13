import type { InputManager } from "./input-manager";
import type { Renderer } from "./renderer";
import type { State } from "./state";
import { calculateArtDims } from "./utils";

export class Entity {
  pos: { x: number; y: number };
  art: string[][];
  artDims: { w: number; h: number };
  color: string;
  layer: number = 0;

  constructor(x: number, y: number, art: string[][], color: string, layer: number = 0) {
    this.pos = { x, y };
    this.art = art;
    this.color = color;
    this.artDims = calculateArtDims(art);
    this.layer = layer;
  }

  update(state: State, input: InputManager): void {}

  draw(renderer: Renderer): void {
    renderer.drawArt(
      this.pos.x,
      this.pos.y,
      this.artDims.w,
      this.artDims.h,
      this.art,
      this.color,
      this.layer
    );
  }
}
