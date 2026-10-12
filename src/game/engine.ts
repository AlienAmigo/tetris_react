import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  LEVEL_LINES_THRESHOLD,
  LINE_SCORES,
} from "./constants";
import type { CellValue, Position, GameState } from "./types";
import { createEmptyBoard } from "./board";
import { clearFullLines } from "./board";
import { getDropInterval } from "./board";
import { createTetromino, getRandomType, getSpawnPosition } from "./tetromino";
import { isColliding } from "./collision";
import { rotateMatrix, rotateCounterClockwise } from "./rotation";

function placePiece(
  board: CellValue[][],
  matrix: number[][],
  position: Position,
  color: string,
): CellValue[][] {
  const newBoard = board.map((row) => [...row]);

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] !== 0) {
        const boardY = position.y + y;
        const boardX = position.x + x;
        if (
          boardY >= 0 &&
          boardY < BOARD_HEIGHT &&
          boardX >= 0 &&
          boardX < BOARD_WIDTH
        ) {
          newBoard[boardY][boardX] = color as CellValue;
        }
      }
    }
  }

  return newBoard;
}

export function createInitialState(): GameState {
  const nextType = getRandomType();
  const nextPiece = createTetromino(nextType);
  const spawnPos = getSpawnPosition(nextPiece.matrix[0].length);

  return {
    board: createEmptyBoard(),
    currentPiece: null,
    currentPosition: spawnPos,
    nextPiece,
    score: 0,
    level: 1,
    lines: 0,
    isPaused: false,
    isGameOver: false,
  };
}

export function spawnPiece(state: GameState): GameState {
  const currentPiece = state.nextPiece;
  const nextType = getRandomType();
  const nextPiece = createTetromino(nextType);
  const spawnPos = getSpawnPosition(currentPiece.matrix[0].length);

  if (isColliding(currentPiece.matrix, spawnPos, state.board)) {
    return { ...state, isGameOver: true, currentPiece };
  }

  return {
    ...state,
    currentPiece,
    currentPosition: spawnPos,
    nextPiece,
  };
}

export function moveLeft(state: GameState): GameState {
  if (!state.currentPiece || state.isPaused || state.isGameOver) return state;

  const newPos: Position = {
    x: state.currentPosition.x - 1,
    y: state.currentPosition.y,
  };

  if (!isColliding(state.currentPiece.matrix, newPos, state.board)) {
    return { ...state, currentPosition: newPos };
  }

  return state;
}

export function moveRight(state: GameState): GameState {
  if (!state.currentPiece || state.isPaused || state.isGameOver) return state;

  const newPos: Position = {
    x: state.currentPosition.x + 1,
    y: state.currentPosition.y,
  };

  if (!isColliding(state.currentPiece.matrix, newPos, state.board)) {
    return { ...state, currentPosition: newPos };
  }

  return state;
}

export function moveDown(state: GameState): {
  state: GameState;
  dropped: boolean;
  scored: boolean;
} {
  if (!state.currentPiece || state.isPaused || state.isGameOver) {
    return { state, dropped: false, scored: false };
  }

  const newPos: Position = {
    x: state.currentPosition.x,
    y: state.currentPosition.y + 1,
  };

  if (!isColliding(state.currentPiece.matrix, newPos, state.board)) {
    return {
      state: { ...state, currentPosition: newPos },
      dropped: true,
      scored: false,
    };
  }

  const placedBoard = placePiece(
    state.board,
    state.currentPiece.matrix,
    state.currentPosition,
    state.currentPiece.color,
  );
  const { newBoard, linesCleared } = clearFullLines(placedBoard);

  const newLines = state.lines + linesCleared;
  const newLevel = Math.floor(newLines / LEVEL_LINES_THRESHOLD) + 1;
  const lineScore = LINE_SCORES[linesCleared] ?? 0;
  const newScore = state.score + lineScore * state.level;

  return {
    state: {
      ...state,
      board: newBoard,
      currentPiece: null,
      score: newScore,
      level: newLevel,
      lines: newLines,
    },
    dropped: true,
    scored: linesCleared > 0,
  };
}

export function hardDrop(state: GameState): GameState {
  if (!state.currentPiece || state.isPaused || state.isGameOver) return state;

  let dropY = state.currentPosition.y;

  while (
    !isColliding(
      state.currentPiece.matrix,
      { x: state.currentPosition.x, y: dropY + 1 },
      state.board,
    )
  ) {
    dropY++;
  }

  const dropDistance = dropY - state.currentPosition.y;
  const droppedScore = dropDistance * 2;

  const placedBoard = placePiece(
    state.board,
    state.currentPiece.matrix,
    {
      x: state.currentPosition.x,
      y: dropY,
    },
    state.currentPiece.color,
  );
  const { newBoard, linesCleared } = clearFullLines(placedBoard);

  const newLines = state.lines + linesCleared;
  const newLevel = Math.floor(newLines / LEVEL_LINES_THRESHOLD) + 1;
  const lineScore = LINE_SCORES[linesCleared] ?? 0;
  const newScore = state.score + lineScore * state.level + droppedScore;

  return {
    ...state,
    board: newBoard,
    currentPiece: null,
    score: newScore,
    level: newLevel,
    lines: newLines,
  };
}

export function rotate(state: GameState, clockwise: boolean): GameState {
  if (!state.currentPiece || state.isPaused || state.isGameOver) return state;

  const rotatedMatrix = clockwise
    ? rotateMatrix(state.currentPiece.matrix)
    : rotateCounterClockwise(state.currentPiece.matrix);

  for (const kickOffset of [0, -1, 1, -2, 2]) {
    const testPos: Position = {
      x: state.currentPosition.x + kickOffset,
      y: state.currentPosition.y,
    };

    if (!isColliding(rotatedMatrix, testPos, state.board)) {
      return {
        ...state,
        currentPiece: { ...state.currentPiece, matrix: rotatedMatrix },
        currentPosition: testPos,
      };
    }
  }

  return state;
}

export function togglePause(state: GameState): GameState {
  if (state.isGameOver) return state;

  return {
    ...state,
    isPaused: !state.isPaused,
  };
}

export function applyGravity(
  _state: GameState,
  deltaTime: number,
): { state: GameState; dropped: boolean } {
  if (!_state.currentPiece || _state.isPaused || _state.isGameOver) {
    return { state: _state, dropped: false };
  }

  const dropInterval = getDropInterval(_state.level);
  let accumulatedTime =
    (_state as GameState & { _dropAccumulator: number })._dropAccumulator ?? 0;

  accumulatedTime += deltaTime;

  if (accumulatedTime >= dropInterval) {
    const result = moveDown(_state);
    const updatedState = result.state as GameState & {
      _dropAccumulator: number;
    };
    updatedState._dropAccumulator = 0;

    if (!result.dropped) {
      if (_state.currentPiece) {
        const placedBoard = placePiece(
          updatedState.board,
          _state.currentPiece.matrix,
          _state.currentPosition,
          _state.currentPiece.color,
        );
        const { newBoard, linesCleared } = clearFullLines(placedBoard);

        const newLines = updatedState.lines + linesCleared;
        const newLevel = Math.floor(newLines / LEVEL_LINES_THRESHOLD) + 1;
        const lineScore = LINE_SCORES[linesCleared] ?? 0;
        const newScore = updatedState.score + lineScore * updatedState.level;

        updatedState.board = newBoard;
        updatedState.score = newScore;
        updatedState.level = newLevel;
        updatedState.lines = newLines;
        updatedState.currentPiece = null;
      }
    }

    return { state: updatedState, dropped: true };
  }

  const updatedState = _state as GameState & { _dropAccumulator: number };
  updatedState._dropAccumulator = accumulatedTime;

  return { state: updatedState, dropped: false };
}

export function restart(_state: GameState): GameState {
  return createInitialState();
}
