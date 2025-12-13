import { config } from "$lib/config";
import { Entity } from "$lib/entity";
import type { Renderer } from "$lib/renderer";
import type { State } from "$lib/state";

export class Player extends Entity {
  maxSpeed: number = 20;
  dir: number = 1;
  gravity: number = 80;
  velocity: { x: number; y: number } = { x: 0, y: 0 };
  deceleration: number = 0.08;
  flippedArt: string[][] = [];

  constructor(x: number, y: number, art: string[][], flippedArt: string[][], color: string) {
    super(x, y, art, color, 10);
    this.flippedArt = flippedArt;
  }

  update(state: State): void {
    this.velocity.y += this.gravity * state.deltaTime;
    this.pos.y += this.velocity.y * state.deltaTime;

    if (this.isOnGround()) {
      this.pos.y = config.dims.height - 4;
      this.velocity.y = 0;
    }

    this.pos.x += this.velocity.x * state.deltaTime;
  }

  draw(renderer: Renderer): void {
    const artToDraw = this.dir === -1 ? this.art : this.flippedArt;
    renderer.drawArt(
      this.pos.x,
      this.pos.y,
      this.artDims.w,
      this.artDims.h,
      artToDraw,
      this.color
    );
  }

  move(direction: number): void {
    if (this.isOnGround()) {
      this.dir = direction;
      this.velocity.y = -25;
      this.velocity.x = direction * this.maxSpeed;
    }
  }

  decelerate(): void {
    if (this.isOnGround()) {
      this.velocity.x *= 1 - this.deceleration;
    }
  }

  isOnGround(): boolean {
    return this.pos.y >= config.dims.height - 4;
  }
}
