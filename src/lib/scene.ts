import type { InputManager } from "./input-manager";
import type { Renderer } from "./renderer";
import type { SceneManager } from "./scene-manager";
import type { State } from "./state";

export abstract class Scene {
  abstract init(state: State, input: InputManager): void;
  abstract update(state: State, input: InputManager, scenes: SceneManager): void;
  abstract draw(state: State, renderer: Renderer): void;
}
