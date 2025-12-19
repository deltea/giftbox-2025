import { config } from "$lib/config";
import { Interactable } from "$lib/entities/interactable";
import { Player } from "$lib/entities/player";
import type { InputManager } from "$lib/input-manager";
import type { Renderer } from "$lib/renderer";
import { Scene } from "$lib/scene";
import type { SceneManager } from "$lib/scene-manager";
import type { State } from "$lib/state";
import { loadArt } from "$lib/utils";

export class HomeScene extends Scene {
  player: Player | null = null;
  posterState: "link_click" | "mob_psycho" | "none" = "none";

  duckArt: string[][] = [];
  duckFlippedArt: string[][] = [];
  doorArt: string[][] = [];
  bedArt: string[][] = [];
  lightbulbArt: string[][] = [];
  posterArt: string[][] = [];
  mobPsychoArt: string[][] = [];
  linkClickArt: string[][] = [];

  async load(): Promise<void> {
    this.duckArt = await loadArt("/src/lib/assets/duck-small.txt");
    this.duckFlippedArt = await loadArt("/src/lib/assets/duck-small-flipped.txt");
    this.doorArt = await loadArt("/src/lib/assets/door.txt");
    this.bedArt = await loadArt("/src/lib/assets/bed.txt");
    this.lightbulbArt = await loadArt("/src/lib/assets/lightbulb.txt");
    this.posterArt = await loadArt("/src/lib/assets/poster.txt");
    this.mobPsychoArt = await loadArt("/src/lib/assets/mob-psycho.txt");
    this.linkClickArt = await loadArt("/src/lib/assets/link-click.txt");
  }

  init(scenes: SceneManager, state: State): void {
    super.init(scenes, state);

    this.player = this.addEntity(new Player(
      state.spawnPoint.x,
      state.spawnPoint.y,
      this.duckArt,
      this.duckFlippedArt,
      config.colors.fg,
      config.dims.height - 15 - this.duckArt.length + 1,
      { min: 12, max: config.dims.width - 12 }
    ));

    this.addEntity(new Interactable(
      config.dims.width - 28,
      config.dims.height - 23,
      this.doorArt,
      config.colors.accent,
      this.player,
      "⬆ go outside",
      () => {
        state.spawnPoint = { x: 20, y: config.dims.height - 4 };
        scenes.changeScene("street", state);
      },
      2
    ));

    this.addEntity(new Interactable(
      36,
      26,
      this.posterArt,
      config.colors.accent,
      this.player,
      "⬆ look at poster",
      () => this.posterState = "mob_psycho",
      2
    ));

    this.addEntity(new Interactable(
      74,
      26,
      this.posterArt,
      config.colors.accent,
      this.player,
      "⬆ look at poster",
      () => this.posterState = "link_click",
      2
    ));
  }

  update(state: State, input: InputManager, scenes: SceneManager): void {
    super.update(state, input, scenes);

    if (input.isKeyPressed("Escape")) {
      this.posterState = "none";
    }
  }

  draw(state: State, renderer: Renderer): void {
    super.draw(state, renderer, "#", config.colors.fg);

    renderer.drawRoundedRect(10, 15, renderer.width - 20, renderer.height - 30, 8, ".", config.colors.bg, 1);
    renderer.drawArt(18, config.dims.height - 15 - this.bedArt.length + 1, 22, 7, this.bedArt, config.colors.accent, 2);
    renderer.drawArt(renderer.width / 2 - 6, 15, 12, 10, this.lightbulbArt, config.colors.accent, 2);

    if (this.posterState !== "none") {
      if (this.posterState === "link_click") {
        renderer.drawRect(renderer.width / 2 - 72 / 2, renderer.height / 2 - 39 / 2, 72, 39, ":", config.colors.bg, 18);
        renderer.drawRectBorderFancy(renderer.width / 2 - 72 / 2, renderer.height / 2 - 39 / 2, 72, 39, config.colors.accent, 19);
        renderer.drawArt(renderer.width / 2 - 72 / 2 + 3, renderer.height / 2 - 33 / 2, 66, 33, this.linkClickArt, config.colors.accent, 20);
      } else if (this.posterState === "mob_psycho") {
        renderer.drawRect(renderer.width / 2 - 49 / 2, renderer.height / 2 - 43 / 2, 49, 43, ":", config.colors.bg, 18);
        renderer.drawRectBorderFancy(renderer.width / 2 - 49 / 2, renderer.height / 2 - 43 / 2, 49, 43, config.colors.accent, 19);
        renderer.drawArt(renderer.width / 2 - 49 / 2 + 3, renderer.height / 2 - 43 / 2 + 3, 43, 37, this.mobPsychoArt, config.colors.accent, 20);
      }
      renderer.drawRect(renderer.width / 2 - 8, renderer.height - 7, 16, 3, " ", config.colors.bg);
      renderer.drawText(renderer.width / 2, renderer.height - 6, "esc to close", config.colors.accent);
    }
  }
}
