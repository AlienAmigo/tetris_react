import type { CSSProperties } from "react";

interface CellProps {
  isFilled: boolean;
  color?: string;
  isGhost?: boolean;
}

export function Cell({ isFilled, color, isGhost }: CellProps) {
  const style: CSSProperties = {
    width: "100%",
    height: "100%",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxSizing: "border-box",
    backgroundColor: isFilled
      ? isGhost
        ? `${color}20`
        : color
      : "rgba(255, 255, 255, 0.03)",
  };

  return <div className="cell" style={style} />;
}
