import type { InputManager } from "$lib/input-manager";
import type { Renderer } from "$lib/renderer";
import type { SceneManager } from "$lib/scene-manager";
import type { State } from "$lib/state";
import { Scene } from "$lib/scene";
import { loadArt } from "$lib/utils";

import clawArtPath from "$lib/assets/claw.txt";
import { config } from "$lib/config";

export class GameScene extends Scene {
  clawArt: string[][] = [];

  clawPos: { x: number; y: number } = { x: 0, y: 0 };

  constructor() {
    super();
    loadArt(clawArtPath).then(art => this.clawArt = art);
  }

  init(state: State, input: InputManager): void {
    // run once when the scene is loaded
  }

  update(state: State, input: InputManager, scenes: SceneManager): void {
    if (input.isKeyPressed("ArrowLeft")) {
      this.clawPos.x -= 1;
    } else if (input.isKeyPressed("ArrowRight")) {
      this.clawPos.x += 1;
    }
  }

  draw(state: State, renderer: Renderer): void {
    renderer.drawRect(0, 0, renderer.width, renderer.height, "/", config.colors.bg);
    renderer.drawArt(
      this.clawPos.x,
      this.clawPos.y,
      this.clawArt,
      config.colors.fg
    );
  }
}
