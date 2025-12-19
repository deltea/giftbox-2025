import { config } from "$lib/config";
import { Cloud } from "$lib/entities/cloud";
import { Interactable } from "$lib/entities/interactable";
import { Player } from "$lib/entities/player";
import type { Entity } from "$lib/entity";
import type { InputManager } from "$lib/input-manager";
import type { Renderer } from "$lib/renderer";
import { Scene } from "$lib/scene";
import type { SceneManager } from "$lib/scene-manager";
import type { State } from "$lib/state";
import { loadArt } from "$lib/utils";

export class StreetScene extends Scene {
  player: Player | null = null;

  duckArt: string[][] = [];
  duckFlippedArt: string[][] = [];
  houseArt: string[][] = [];
  shopArt: string[][] = [];
  vendingMachineArt: string[][] = [];
  cloudArt: string[][] = [];
  drPepperArt: string[][] = [];

  isShowingDrPepper: boolean = false;

  async load(): Promise<void> {
    this.duckArt = await loadArt("/assets/duck-small.txt");
    this.duckFlippedArt = await loadArt("/assets/duck-small-flipped.txt");
    this.houseArt = await loadArt("/assets/mushroom-house.txt");
    this.shopArt = await loadArt("/assets/shop.txt");
    this.vendingMachineArt = await loadArt("/assets/vending-machine.txt");
    this.cloudArt = await loadArt("/assets/cloud.txt");
    this.drPepperArt = await loadArt("/assets/dr-pepper.txt");
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
      2,
      config.dims.height - 24,
      this.houseArt,
      config.colors.accent,
      this.player,
      "⬆ enter house",
      () => {
        state.spawnPoint = { x: 56, y: config.dims.height - 10 };
        scenes.changeScene("home", state);
      }
    ));
    this.addEntity(new Interactable(
      config.dims.width - 43,
      config.dims.height - 20,
      this.shopArt,
      config.colors.accent,
      this.player,
      "⬆ enter aquarium",
      () => {
        state.spawnPoint = { x: 20, y: config.dims.height - 4 };
        scenes.changeScene("store", state)
      }
    ));
    this.addEntity(new Interactable(
      config.dims.width / 2 - 9,
      config.dims.height - 13,
      this.vendingMachineArt,
      config.colors.accent,
      this.player,
      state.hasMission ? "⬆ buy a can of dr pepper" : "it's a vending machine",
      () => {
        if (state.hasMission) {
          state.hasKey = true;
          this.isShowingDrPepper = true;
        }
      }
    ));
    this.addEntity(new Cloud(
      50,
      10,
      this.cloudArt,
      config.colors.accent,
      10
    ));
    this.addEntity(new Cloud(
      30,
      22,
      this.cloudArt,
      config.colors.accent,
      -8
    ));
  }

  update(state: State, input: InputManager, scenes: SceneManager): void {
    super.update(state, input, scenes);

    if (input.isKeyPressed("Escape")) {
      this.isShowingDrPepper = false;
    }
  }

  draw(state: State, renderer: Renderer): void {
    super.draw(state, renderer);

    if (this.isShowingDrPepper) {
      renderer.drawRect(renderer.width / 2 - 45, renderer.height / 2 - 25, 90, 50, "-", config.colors.bg, 9);
      renderer.drawRectBorderFancy(renderer.width / 2 - 45, renderer.height / 2 - 25, 90, 50, config.colors.accent, 10);
      renderer.drawText(renderer.width / 2, 10, "you got the dr. pepper!!!!", config.colors.fg, true, 10);
      renderer.drawArt(
        renderer.width / 2 - 7,
        renderer.height / 2 - 6,
        14,
        13,
        this.drPepperArt,
        config.colors.fg,
        10
      );
      renderer.drawRect(renderer.width / 2 - 8, renderer.height - 10, 16, 3, "+", config.colors.accent, 10);
      renderer.drawText(renderer.width / 2, renderer.height - 9, "esc to close", config.colors.fg, true, 10);
    }
  }
}
