import type { InputManager } from "./input-manager";
import type { Renderer } from "./renderer";
import type { SceneManager } from "./scene-manager";
import type { State } from "./state";

export abstract class Scene {
  abstract load(): Promise<void>;
  abstract init(): void;
  abstract update(state: State, input: InputManager, scenes: SceneManager): void;
  abstract draw(state: State, renderer: Renderer): void;
}
