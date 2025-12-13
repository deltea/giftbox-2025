import { config } from "$lib/config";
import { Entity } from "$lib/entity";
import type { Renderer } from "$lib/renderer";
import type { State } from "$lib/state";

export class Interactable extends Entity {
  target: Entity;
  isActive: boolean = true;

  constructor(x: number, y: number, art: string[][], color: string, target: Entity) {
    super(x, y, art, color);
    this.target = target;
  }

  update(state: State): void {
    super.update(state);
    if (!this.isActive && this.isTouching(this.target)) {
      this.onInteract();
    } else if (this.isActive && !this.isTouching(this.target)) {
      this.onDisinteract();
    }
  }

  onInteract(): void {
    this.isActive = true;
    console.log("on interacted!");
  }

  onDisinteract(): void {
    this.isActive = false;
    console.log("on disinteracted!");
  }

  draw(renderer: Renderer): void {
    if (this.isActive) {
      this.color = config.colors.fg;
    } else {
      this.color = config.colors.accent;
    }
    super.draw(renderer);
  }

  isTouching(entity: Entity): boolean {
    return !(
      this.pos.x + this.artDims.w < entity.pos.x ||
      this.pos.x > entity.pos.x + entity.artDims.w ||
      this.pos.y + this.artDims.h < entity.pos.y ||
      this.pos.y > entity.pos.y + entity.artDims.h
    );
  }
}
