import type { Tetromino, TetrominoType, Position } from "./types";
import { TETROMINO_SHAPES, TETROMINO_COLORS } from "./constants";

const TETROMINO_TYPES: TetrominoType[] = ["I", "O", "T", "S", "Z", "J", "L"];

export function createTetromino(type: TetrominoType): Tetromino {
  return {
    type,
    matrix: TETROMINO_SHAPES[type].map((row) => [...row]),
    color: TETROMINO_COLORS[type],
  };
}

export function getRandomType(): TetrominoType {
  return TETROMINO_TYPES[Math.floor(Math.random() * TETROMINO_TYPES.length)];
}

export function getSpawnPosition(matrixWidth: number): Position {
  return {
    x: Math.floor((10 - matrixWidth) / 2),
    y: 0,
  };
}
