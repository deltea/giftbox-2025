import { config } from "$lib/config";
import { Player } from "$lib/entities/player";
import type { InputManager } from "$lib/input-manager";
import type { Renderer } from "$lib/renderer";
import { Scene } from "$lib/scene";
import type { SceneManager } from "$lib/scene-manager";
import type { State } from "$lib/state";
import { loadArt } from "$lib/utils";

export class HomeScene extends Scene {
  player: Player | null = null;

  duckArt: string[][] = [];
  duckFlippedArt: string[][] = [];

  async load(): Promise<void> {
    this.duckArt = await loadArt("/src/lib/assets/duck-small.txt");
    this.duckFlippedArt = await loadArt("/src/lib/assets/duck-small-flipped.txt");
  }

  init(scenes: SceneManager): void {
    super.init(scenes);

    this.player = this.addEntity(new Player(
      8,
      config.dims.height - 10,
      this.duckArt,
      this.duckFlippedArt,
      config.colors.fg,
      config.dims.height - 10
    ));
  }

  update(state: State, input: InputManager, scenes: SceneManager): void {
    super.update(state, input, scenes);
  }

  draw(state: State, renderer: Renderer): void {
    super.draw(state, renderer, "/", config.colors.fg);

    renderer.drawRoundedRect(
      10,
      6,
      renderer.width - 20,
      renderer.height - 12,
      8,
      "#",
      config.colors.bg,
      1
    )
  }
}
