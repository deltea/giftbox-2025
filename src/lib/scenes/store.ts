import { config } from "$lib/config";
import { Interactable } from "$lib/entities/interactable";
import { Player } from "$lib/entities/player";
import type { InputManager } from "$lib/input-manager";
import type { Renderer } from "$lib/renderer";
import { Scene } from "$lib/scene";
import type { SceneManager } from "$lib/scene-manager";
import type { State } from "$lib/state";
import { showBlahaj } from "$lib/stores";
import { clamp, getFlipped, loadArt } from "$lib/utils";

export class StoreScene extends Scene {
  player: Player | null = null;

  duckArt: string[][] = [];
  duckFlippedArt: string[][] = [];
  doorArt: string[][] = [];
  aquariumArt: string[][] = [];
  sharkArt: string[][] = [];
  sharkFlippedArt: string[][] = [];
  kioskArt: string[][] = [];

  sharkSpeed: number = 5;
  sharkDir: number = 1;
  sharkX: number = 15;
  sharkY: number = 24;

  async load(): Promise<void> {
    this.duckArt = await loadArt("/src/lib/assets/duck-small.txt");
    this.duckFlippedArt = await loadArt("/src/lib/assets/duck-small-flipped.txt");
    this.doorArt = await loadArt("/src/lib/assets/door.txt");
    this.aquariumArt = await loadArt("/src/lib/assets/aquarium.txt");
    this.sharkArt = await loadArt("/src/lib/assets/shark.txt");
    this.sharkFlippedArt = getFlipped(this.sharkArt);
    this.kioskArt = await loadArt("/src/lib/assets/kiosk.txt");
  }

  init(scenes: SceneManager, state: State): void {
    super.init(scenes, state);

    this.player = this.addEntity(new Player(
      state.spawnPoint.x,
      state.spawnPoint.y,
      this.duckArt,
      this.duckFlippedArt,
      config.colors.fg
    ));

    this.addEntity(new Interactable(
      18,
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
    this.addEntity(new Interactable(
      config.dims.width - 28,
      config.dims.height - 4,
      this.kioskArt,
      config.colors.fg,
      this.player,
      state.hasKey ? "⬆ give it to the shark" : "the shark is thirsty",
      () => {
        if (state.hasKey) {
          state.hasKey = false;
          state.hasMission = false;
          state.isEnd = true;
          showBlahaj.set(true);
          setTimeout(() => {
            scenes.changeScene("start", state);
          }, 3000);
        }
      },
      2,
      () => {
        if (!state.hasKey) {
          state.hasMission = true;
        }
      }
    ));
  }

  update(state: State, input: InputManager, scenes: SceneManager): void {
    super.update(state, input, scenes);
    const delta = state.deltaTime;

    this.sharkX = clamp(this.sharkX + this.sharkDir * this.sharkSpeed * delta, 10, 33);
    if (this.sharkX <= 10 || this.sharkX >= 33) {
      this.sharkDir *= -1;
    }
    this.sharkY = 24 + Math.sin(state.gameTime * 0.003) * 1;
  }

  draw(state: State, renderer: Renderer): void {
    super.draw(state, renderer, "#", config.colors.fg);

    renderer.drawRoundedRect(10, 10, renderer.width - 20, renderer.height + 5, 8, ".", config.colors.bg, 0);
    renderer.drawArt(25, 20, 70, 24, this.aquariumArt, config.colors.accent, 5);
    renderer.drawRect(10, 20, 15, 24, ".", config.colors.bg, 10);
    renderer.drawRect(renderer.width - 25, 20, 15, 24, ".", config.colors.bg, 10);

    if (!state.isEnd) {
      renderer.drawArt(this.sharkX, this.sharkY, 78, 15, this.sharkDir < 0 ? this.sharkArt : this.sharkFlippedArt, config.colors.fg);
    }

    renderer.drawText(renderer.width / 2, 46, "THE SHARK", config.colors.accent);
    renderer.drawRectBorder(renderer.width / 2 - 6, 46 - 1, 13, 3, "*", config.colors.accent);
  }
}
