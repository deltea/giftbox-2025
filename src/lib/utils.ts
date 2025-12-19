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

// flip ascii art horizontally, flipping characters as needed
export function getFlipped(art: string[][]): string[][] {
  const flipMap: Record<string, string> = {
    "/": "\\",
    "\\": "/",
    "(": ")",
    ")": "(",
    "{": "}",
    "}": "{",
    "[": "]",
    "]": "[",
    "<": ">",
    ">": "<",
  };

  const maxWidth = Math.max(...art.map(line => line.length));

  const flippedArt: string[][] = art.map(line => {
    const paddedLine = [...line];
    while (paddedLine.length < maxWidth) {
      paddedLine.push(" ");
    }

    const flippedLine: string[] = [];
    for (let i = paddedLine.length - 1; i >= 0; i--) {
      const char = paddedLine[i];
      flippedLine.push(flipMap[char] || char);
    }
    return flippedLine;
  });

  return flippedArt;
}
