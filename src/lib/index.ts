import { Engine } from "./engine";
import { padding, pixelRatio, fontSize, colors } from "./config";
import type { EngineConfig } from "./types";

let engine: Engine;

export async function init(): Promise<void> {
  const config: EngineConfig = {
    containerId: "container",
    gridWidth: Math.floor((window.innerWidth - padding * 2) / (fontSize / 1.5)),
    gridHeight: Math.floor((window.innerHeight - padding * 2) / fontSize),
    fontSize,
    padding,
    pixelRatio,
    colors
  };

  engine = new Engine(config);
  await engine.init();
}

export function deinit(): void {
  if (engine) {
    engine.destroy();
  }
}
