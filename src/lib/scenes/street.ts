import { config } from "$lib/config";
import type { InputManager } from "$lib/input-manager";
import type { Renderer } from "$lib/renderer";
import { Scene } from "$lib/scene";
import type { SceneManager } from "$lib/scene-manager";
import type { State } from "$lib/state";
import { clamp, loadArt } from "$lib/utils";

export class StreetScene extends Scene {
  playerPos: { x: number; y: number } = { x: 0, y: 0 };
  playerMaxSpeed: number = 20;
  playerDir: number = 1;
  gravity: number = 80;
  playerVel: { x: number; y: number } = { x: 0, y: 0 };
  playerDeceleration: number = 0.08;

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
    this.playerPos.x = config.dims.width / 2;
    this.playerPos.y = config.dims.height - 8;
  }

  update(state: State, input: InputManager, scenes: SceneManager): void {
    const delta = state.deltaTime;

    if (input.isKeyPressed("ArrowLeft")) {
      this.playerDir = -1;
      if (this.playerIsOnGround()) {
        this.playerVel.y = -25;
        this.playerVel.x = -this.playerMaxSpeed;
      }
    } else if (input.isKeyPressed("ArrowRight")) {
      this.playerDir = 1;
      if (this.playerIsOnGround()) {
        this.playerVel.y = -25;
        this.playerVel.x = this.playerMaxSpeed;
      }
    } else {
      if (this.playerIsOnGround()) {
        this.playerVel.x *= 1 - this.playerDeceleration;
      }
    }

    this.playerVel.y += this.gravity * delta;
    this.playerPos.y += this.playerVel.y * delta;

    if (this.playerIsOnGround()) {
      this.playerPos.y = config.dims.height - 4;
      this.playerVel.y = 0;
    }

    this.playerPos.x += this.playerVel.x * delta;
  }

  draw(state: State, renderer: Renderer): void {
    renderer.drawRect(0, 0, renderer.width, renderer.height, ".", config.colors.bg);

    renderer.drawArt(
      2,
      config.dims.height - 24,
      37,
      25,
      this.houseArt,
      config.colors.accent
    );
    renderer.drawArt(
      config.dims.width - 43,
      config.dims.height - 20,
      40,
      21,
      this.shopArt,
      config.colors.accent
    );
    renderer.drawArt(
      config.dims.width / 2 - 9,
      config.dims.height - 13,
      18,
      13,
      this.vendingMachineArt,
      config.colors.accent
    );
    renderer.drawArt(
      this.playerPos.x,
      this.playerPos.y,
      8,
      4,
      this.playerDir === -1 ? this.duckArt : this.duckFlippedArt,
      config.colors.fg
    );
  }

  playerIsOnGround(): boolean {
    return this.playerPos.y >= config.dims.height - 4;
  }
}
