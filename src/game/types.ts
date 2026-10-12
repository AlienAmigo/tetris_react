export type CellValue = 0 | string;

export interface Position {
  x: number;
  y: number;
}

export type TetrominoType = "I" | "O" | "T" | "S" | "Z" | "J" | "L";

export interface Tetromino {
  type: TetrominoType;
  matrix: number[][];
  color: string;
}

export interface GameState {
  board: CellValue[][];
  currentPiece: Tetromino | null;
  currentPosition: Position;
  nextPiece: Tetromino;
  score: number;
  level: number;
  lines: number;
  isPaused: boolean;
  isGameOver: boolean;
}
