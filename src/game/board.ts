import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  INITIAL_DROP_INTERVAL,
  MIN_DROP_INTERVAL,
  MAX_LEVEL,
} from "./constants";
import type { CellValue } from "./types";

export function createEmptyBoard(): CellValue[][] {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, () => 0 as CellValue),
  );
}

export function clearFullLines(board: CellValue[][]): {
  newBoard: CellValue[][];
  linesCleared: number;
} {
  const newBoard = board.filter((row) => row.some((cell) => cell === 0));
  const linesCleared = BOARD_HEIGHT - newBoard.length;

  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array.from({ length: BOARD_WIDTH }, () => 0 as CellValue));
  }

  return { newBoard, linesCleared };
}

export function getDropInterval(level: number): number {
  const step = (INITIAL_DROP_INTERVAL - MIN_DROP_INTERVAL) / (MAX_LEVEL - 1);
  return Math.max(
    MIN_DROP_INTERVAL,
    INITIAL_DROP_INTERVAL - (level - 1) * step,
  );
}
