import type { InputManager } from "./input-manager";
import type { Renderer } from "./renderer";
import type { SceneManager } from "./scene-manager";
import type { State } from "./state";

export interface Cell {
  char: string;
  color: string;
}

export interface Scene {
  load(): Promise<void>;
  init(scenes: SceneManager, state: State): void;
  update(state: State, input: InputManager, scenes: SceneManager): void;
  draw(state: State, renderer: Renderer): void;
  destroy(): void;
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
  bgChar: string;
  startScene: string;
  scenes: {
    [key: string]: Scene;
  };
}
