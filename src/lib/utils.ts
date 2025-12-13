export async function loadArt(path: string): Promise<string[][]> {
  const response = await fetch(path);
  const text = await response.text();
  const lines = text.split("\n").map(line => line.split(""));
  return lines;
}
