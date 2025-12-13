import type { InputManager } from "./InputManager";
import type { Renderer } from "./renderer";
import type { State } from "./state";

export abstract class Scene {
  abstract init(state: State, input: InputManager): void;
  abstract update(state: State, input: InputManager): void;
  abstract render(state: State, draw: Renderer): void;
}
