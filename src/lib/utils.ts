export async function loadArt(path: string): Promise<string[][]> {
  const response = await fetch(path);
  const text = await response.text();
  const lines = text.split("\n").map(line => line.split(""));
  return lines;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}
