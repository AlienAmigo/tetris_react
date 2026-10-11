interface ScorePanelProps {
  score: number;
  level: number;
  lines: number;
}

export function ScorePanel({ score, level, lines }: ScorePanelProps) {
  return (
    <div className="score-panel">
      <div className="score-item">
        <span className="score-label">Счёт</span>
        <span className="score-value">{score}</span>
      </div>
      <div className="score-item">
        <span className="score-label">Уровень</span>
        <span className="score-value">{level}</span>
      </div>
      <div className="score-item">
        <span className="score-label">Линии</span>
        <span className="score-value">{lines}</span>
      </div>
    </div>
  );
}
