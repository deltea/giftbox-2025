import { StartScene } from "./scenes/start";
import type { EngineConfig } from "./types";

export const config: EngineConfig = {
  containerId: "container",
  fontSize: 16,
  padding: 24,
  pixelRatio: 3,
  dims: {
    width: Math.floor((window.innerWidth - 24 * 2) / (16 / 1.5)),
    height: Math.floor((window.innerHeight - 24 * 2) / 16)
  },
  colors: {
    fg: "#eee0cb",
    bg: "#242825",
    accent: "#839788"
  },
  startScene: "start",
  scenes: {
    "start": new StartScene
  }
}
