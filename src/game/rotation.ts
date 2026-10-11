import type { Position } from "./types";

export function rotateMatrix(matrix: number[][]): number[][] {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const rotated: number[][] = Array.from({ length: cols }, () =>
    Array.from({ length: rows }, () => 0),
  );

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      rotated[x][rows - 1 - y] = matrix[y][x];
    }
  }

  return rotated;
}

export function rotateCounterClockwise(matrix: number[][]): number[][] {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const rotated: number[][] = Array.from({ length: cols }, () =>
    Array.from({ length: rows }, () => 0),
  );

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      rotated[cols - 1 - x][y] = matrix[y][x];
    }
  }

  return rotated;
}

const WALL_KICKS: [number, number][] = [
  [0, 0],
  [-1, 0],
  [1, 0],
  [0, -1],
  [-1, -1],
  [1, -1],
  [-2, 0],
  [2, 0],
];

export function tryWallKick(
  matrix: number[][],
  position: Position,
  _board: unknown[][],
  _kickDirection: number,
): Position {
  for (const [kickX, kickY] of WALL_KICKS) {
    const testX = position.x + kickX;
    const testY = position.y + kickY;

    if (
      testX >= 0 &&
      testX + matrix[0].length <= 10 &&
      testY >= 0 &&
      testY + matrix.length <= 20
    ) {
      return { x: testX, y: testY };
    }
  }

  return position;
}
