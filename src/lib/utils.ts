export async function loadArt(path: string): Promise<string[][]> {
  const response = await fetch(path);
  const text = await response.text();
  const lines = text.split("\n").map(line => line.split(""));
  return lines;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

export function calculateArtDims(art: string[][]): { w: number; h: number } {
  const h = art.length;
  const w = art.reduce((maxWidth, line) => Math.max(maxWidth, line.length), 0);
  return { w, h };
}
