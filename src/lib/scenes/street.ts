import { config } from "$lib/config";
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

  async load(): Promise<void> {
    this.duckArt = await loadArt("/src/lib/assets/duck-small.txt");
    this.duckFlippedArt = await loadArt("/src/lib/assets/duck-small-flipped.txt");
    this.houseArt = await loadArt("/src/lib/assets/mushroom-house.txt");
    this.shopArt = await loadArt("/src/lib/assets/shop.txt");
    this.vendingMachineArt = await loadArt("/src/lib/assets/vending-machine.txt");
  }

  init(): void {
    super.init();
    this.player = this.addEntity(new Player(
      config.dims.width / 2,
      config.dims.height - 8,
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
      "↵ enter house"
    ));
    this.addEntity(new Interactable(
      config.dims.width - 43,
      config.dims.height - 20,
      this.shopArt,
      config.colors.accent,
      this.player,
      "↵ enter store"
    ));
    this.addEntity(new Interactable(
      config.dims.width / 2 - 9,
      config.dims.height - 13,
      this.vendingMachineArt,
      config.colors.accent,
      this.player,
      "↵ use vending machine"
    ));
  }

  update(state: State, input: InputManager, scenes: SceneManager): void {
    super.update(state, input, scenes);

    if (input.isKeyPressed("ArrowLeft")) {
      this.player?.move(-1);
    } else if (input.isKeyPressed("ArrowRight")) {
      this.player?.move(1);
    } else {
      this.player?.decelerate();
    }
  }

  draw(state: State, renderer: Renderer): void {
    super.draw(state, renderer);
  }
}
