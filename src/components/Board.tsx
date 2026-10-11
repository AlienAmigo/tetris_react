import type { GameState } from "../game/types";
import type { JSX } from "react";
import { BOARD_HEIGHT, BOARD_WIDTH } from "../game/constants";
import { getGhostPosition } from "../game/collision";
import { Cell } from "./Cell";

interface BoardProps {
  gameState: GameState;
}

function renderBoard(gameState: GameState): number[][] {
  const board: number[][] = Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, () => 0),
  );

  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      if (gameState.board[y][x] === 1) {
        board[y][x] = 1;
      }
    }
  }

  return board;
}

function renderCurrentPiece(gameState: GameState): {
  matrix: number[][];
  position: { x: number; y: number };
  color: string;
} | null {
  if (!gameState.currentPiece) return null;

  return {
    matrix: gameState.currentPiece.matrix,
    position: gameState.currentPosition,
    color: gameState.currentPiece.color,
  };
}

function renderGhostPiece(gameState: GameState): {
  matrix: number[][];
  position: { x: number; y: number };
  color: string;
} | null {
  if (!gameState.currentPiece) return null;

  const ghostPos = getGhostPosition(
    gameState.currentPiece.matrix,
    gameState.currentPosition,
    gameState.board,
  );

  if (ghostPos.y === gameState.currentPosition.y) return null;

  return {
    matrix: gameState.currentPiece.matrix,
    position: ghostPos,
    color: gameState.currentPiece.color,
  };
}

function getCellContent(
  board: number[][],
  currentPiece: ReturnType<typeof renderCurrentPiece>,
  ghostPiece: ReturnType<typeof renderGhostPiece>,
  row: number,
  col: number,
): { filled: boolean; color?: string; isGhost?: boolean } {
  if (board[row][col] === 1) {
    return { filled: true };
  }

  if (currentPiece) {
    const pieceRow = row - currentPiece.position.y;
    const pieceCol = col - currentPiece.position.x;

    if (
      pieceRow >= 0 &&
      pieceRow < currentPiece.matrix.length &&
      pieceCol >= 0 &&
      pieceCol < currentPiece.matrix[0].length &&
      currentPiece.matrix[pieceRow][pieceCol] === 1
    ) {
      return { filled: true, color: currentPiece.color };
    }
  }

  if (ghostPiece) {
    const pieceRow = row - ghostPiece.position.y;
    const pieceCol = col - ghostPiece.position.x;

    if (
      pieceRow >= 0 &&
      pieceRow < ghostPiece.matrix.length &&
      pieceCol >= 0 &&
      pieceCol < ghostPiece.matrix[0].length &&
      ghostPiece.matrix[pieceRow][pieceCol] === 1
    ) {
      return { filled: true, color: ghostPiece.color, isGhost: true };
    }
  }

  return { filled: false };
}

export function Board({ gameState }: BoardProps) {
  const board = renderBoard(gameState);
  const currentPiece = renderCurrentPiece(gameState);
  const ghostPiece = renderGhostPiece(gameState);

  const cells: Array<JSX.Element> = [];

  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      const content = getCellContent(board, currentPiece, ghostPiece, y, x);
      const key = `${y}-${x}`;

      cells.push(
        <Cell
          key={key}
          isFilled={content.filled}
          color={content.color}
          isGhost={content.isGhost}
        />,
      );
    }
  }

  return (
    <div className="board">
      <div className="board-grid">{cells}</div>
    </div>
  );
}
