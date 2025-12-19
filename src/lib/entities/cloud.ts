import { config } from "$lib/config";
import { Entity } from "$lib/entity";
import type { State } from "$lib/state";

export class Cloud extends Entity {
  speed: number;

  constructor(x: number, y: number, art: string[][], color: string, speed: number) {
    super(x, y, art, color, 1);
    this.speed = speed;
  }

  update(state: State): void {
    this.pos.x += this.speed * state.deltaTime;
    if (this.pos.x > config.dims.width) {
      this.pos.x = -this.artDims.w;
    } else if (this.pos.x < -this.artDims.w) {
      this.pos.x = 100;
    }
  }
}
