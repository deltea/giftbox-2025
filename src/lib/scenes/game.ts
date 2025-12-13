import type { InputManager } from "$lib/input-manager";
import type { Renderer } from "$lib/renderer";
import type { SceneManager } from "$lib/scene-manager";
import type { State } from "$lib/state";
import { Scene } from "$lib/scene";
import { clamp, loadArt } from "$lib/utils";
import { config } from "$lib/config";

import clawArtPath from "$lib/assets/claw.txt";

export class GameScene extends Scene {
  clawArt: string[][] = [];

  clawPos: { x: number; y: number } = { x: 0, y: 0 };
  clawSpeed: number = 25;

  async load(): Promise<void> {
    this.clawArt = await loadArt(clawArtPath);
  }

  init(): void {
    // run once when the scene is loaded
  }

  update(state: State, input: InputManager, scenes: SceneManager): void {
    const delta = state.deltaTime;

    if (input.isKeyPressed("ArrowLeft")) {
      this.clawPos.x -= this.clawSpeed * delta;
    }
    if (input.isKeyPressed("ArrowRight")) {
      this.clawPos.x += this.clawSpeed * delta;
    }

    this.clawPos.x = clamp(this.clawPos.x, 0, config.dims.width - this.clawArt[0].length);
  }

  draw(state: State, renderer: Renderer): void {
    renderer.drawRect(0, 0, renderer.width, renderer.height, "/", config.colors.bg);
    renderer.drawArt(
      this.clawPos.x,
      this.clawPos.y,
      21,
      12,
      this.clawArt,
      config.colors.fg
    );
  }
}
