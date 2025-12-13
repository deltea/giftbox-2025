import type { InputManager } from "./InputManager";
import type { Renderer } from "./renderer";
import type { State } from "./state";

export interface Cell {
  char: string;
  color: string;
}

export interface Scene {
  init(state: State, input: InputManager): void;
  update(state: State, input: InputManager): void;
  render(state: State, draw: Renderer): void;
}

export interface EngineConfig {
  containerId: string;
  dims: {
    width: number;
    height: number;
  };
  fontSize: number;
  padding: number;
  pixelRatio: number;
  colors: {
    fg: string;
    bg: string;
    accent: string;
  };
  startScene: string;
  scenes: {
    [key: string]: Scene;
  };
}
