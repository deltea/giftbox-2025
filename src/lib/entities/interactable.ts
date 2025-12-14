import { config } from "$lib/config";
import { Entity } from "$lib/entity";
import type { InputManager } from "$lib/input-manager";
import type { Renderer } from "$lib/renderer";
import type { State } from "$lib/state";

export class Interactable extends Entity {
  target: Entity;
  isActive: boolean = true;
  text: string = "";
  callback?: () => void;

  constructor(x: number, y: number, art: string[][], color: string, target: Entity, text: string = "", callback?: () => void, layer: number = 0) {
    super(x, y, art, color, layer);
    this.target = target;
    this.text = text;
    this.callback = callback;
  }

  update(state: State, input: InputManager): void {
    super.update(state, input);
    if (!this.isActive && this.isTouching(this.target)) {
      this.onInteract();
    } else if (this.isActive && !this.isTouching(this.target)) {
      this.onDisinteract();
    }

    if (this.isActive && input.isKeyPressed("ArrowUp")) {
      if (this.callback) {
        this.callback();
      }
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
    super.draw(renderer);

    if (this.isActive && this.text.length > 0) {
      const boxWidth = this.text.length + 6;
      const boxHeight = 5;
      const yOffset = 1;
      const textLayer = this.layer + 1;
      renderer.drawRectBorderFancy(
        this.pos.x + this.artDims.w / 2 - boxWidth / 2,
        this.pos.y - boxHeight - yOffset,
        this.text.length + 6,
        boxHeight,
        config.colors.fg,
        textLayer
      );
      renderer.drawText(
        this.pos.x + this.artDims.w / 2 - boxWidth / 2 + 3,
        this.pos.y - boxHeight - yOffset + boxHeight / 2,
        this.text,
        config.colors.fg,
        false,
        textLayer
      );
    }
  }

  isTouching(entity: Entity): boolean {
    return !(
      this.pos.x + this.artDims.w < entity.pos.x ||
      this.pos.x > entity.pos.x + entity.artDims.w/* ||
      this.pos.y + this.artDims.h < entity.pos.y ||
      this.pos.y > entity.pos.y + entity.artDims.h*/
    );
  }
}
