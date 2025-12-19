import { config } from "$lib/config";
import { Interactable } from "$lib/entities/interactable";
import { Player } from "$lib/entities/player";
import type { InputManager } from "$lib/input-manager";
import type { Renderer } from "$lib/renderer";
import { Scene } from "$lib/scene";
import type { SceneManager } from "$lib/scene-manager";
import type { State } from "$lib/state";
import { loadArt } from "$lib/utils";

export class StoreScene extends Scene {
  player: Player | null = null;

  duckArt: string[][] = [];
  duckFlippedArt: string[][] = [];
  doorArt: string[][] = [];

  async load(): Promise<void> {
    this.duckArt = await loadArt("/src/lib/assets/duck-small.txt");
    this.duckFlippedArt = await loadArt("/src/lib/assets/duck-small-flipped.txt");
    this.doorArt = await loadArt("/src/lib/assets/door.txt");
  }

  init(scenes: SceneManager, state: State): void {
    super.init(scenes, state);

    this.player = this.addEntity(new Player(
      56,
      config.dims.height - 10,
      this.duckArt,
      this.duckFlippedArt,
      config.colors.fg
    ));

    this.addEntity(new Interactable(
      28,
      config.dims.height - 8,
      this.doorArt,
      config.colors.accent,
      this.player,
      "⬆ go outside",
      () => {
        state.spawnPoint = { x: config.dims.width - 36, y: config.dims.height - 4 };
        scenes.changeScene("street", state)
      },
      2
    ));
  }

  update(state: State, input: InputManager, scenes: SceneManager): void {
    super.update(state, input, scenes);
  }

  draw(state: State, renderer: Renderer): void {
    super.draw(state, renderer);
  }
}
