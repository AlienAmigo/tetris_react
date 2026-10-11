import type { Tetromino } from "../game/types";
import type { JSX } from "react";
import { Cell } from "./Cell";

interface NextPieceProps {
  piece: Tetromino;
}

export function NextPiece({ piece }: NextPieceProps) {
  const matrix = piece.matrix;
  const cells: Array<JSX.Element> = [];

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      const isFilled = matrix[y][x] === 1;
      const key = `next-${y}-${x}`;

      cells.push(
        <Cell
          key={key}
          isFilled={isFilled}
          color={isFilled ? piece.color : undefined}
        />,
      );
    }
  }

  return (
    <div className="next-piece">
      <h3>Следующая</h3>
      <div
        className="next-piece-grid"
        style={{ gridTemplateColumns: `repeat(${matrix[0].length}, 1fr)` }}
      >
        {cells}
      </div>
    </div>
  );
}
