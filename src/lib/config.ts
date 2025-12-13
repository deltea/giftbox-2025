import { GameScene } from "./scenes/game";
import { HomeScene } from "./scenes/home";
import { StartScene } from "./scenes/start";
import { StreetScene } from "./scenes/street";
import type { EngineConfig } from "./types";

export const config: EngineConfig = {
  containerId: "container",
  fontSize: 16,
  padding: 24,
  pixelRatio: window.devicePixelRatio || 2,
  dims: {
    // width: Math.floor((window.innerWidth - 24 * 2) / (16 / 1.5)),
    // height: Math.floor((window.innerHeight - 24 * 2) / 16)
    width: 120,
    height: 60
  },
  colors: {
    fg: "#eee0cb",
    bg: "#2f3731",
    accent: "#839788"
  },
  startScene: "start",
  bgChar: ".",
  scenes: {
    "start": new StartScene,
    "game": new GameScene,
    "street": new StreetScene,
    "home": new HomeScene
  }
}
