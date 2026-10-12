import { BOARD_HEIGHT, BOARD_WIDTH } from "./constants";
import type { CellValue, Position } from "./types";

export function isColliding(
  matrix: number[][],
  position: Position,
  board: CellValue[][],
): boolean {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] !== 0) {
        const newX = position.x + x;
        const newY = position.y + y;

        if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
          return true;
        }

        if (newY >= 0 && board[newY][newX] !== 0) {
          return true;
        }
      }
    }
  }

  return false;
}

export function getGhostPosition(
  matrix: number[][],
  position: Position,
  board: CellValue[][],
): Position {
  let ghostY = position.y;

  while (!isColliding(matrix, { x: position.x, y: ghostY + 1 }, board)) {
    ghostY++;
  }

  return { x: position.x, y: ghostY };
}
