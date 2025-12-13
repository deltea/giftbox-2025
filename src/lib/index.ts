import { Engine } from "./engine";

let engine: Engine;

export async function init(): Promise<void> {
  engine = new Engine();
  await engine.init();
}

export function deinit(): void {
  if (engine) {
    engine.destroy();
  }
}
