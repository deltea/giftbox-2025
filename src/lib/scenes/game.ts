import { config } from "$lib/config";
import type { InputManager } from "$lib/input-manager";
import type { Renderer } from "$lib/renderer";
import { Scene } from "$lib/scene";
import type { State } from "$lib/state";

export class GameScene extends Scene {
  // put scene state properties here

  init(state: State, input: InputManager): void {
    // run once when the scene is loaded
  }

  update(state: State, input: InputManager): void {
    // update game logic and detect input here
  }

  draw(state: State, renderer: Renderer): void {
    // draw to the canvas here
  }
}
