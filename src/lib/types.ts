export interface Cell {
  char: string;
  color: string;
}

export interface EngineConfig {
  containerId: string;
  gridWidth: number;
  gridHeight: number;
  fontSize: number;
  padding: number;
  pixelRatio: number;
  colors: {
    fg: string;
    bg: string;
    accent: string;
  };
}
