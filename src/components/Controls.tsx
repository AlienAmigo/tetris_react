interface ControlsProps {
  onPause: () => void;
  onRestart: () => void;
  isPaused: boolean;
}

export function Controls({ onPause, onRestart, isPaused }: ControlsProps) {
  return (
    <div className="controls">
      <button className="control-button" onClick={onPause}>
        {isPaused ? "Продолжить" : "Пауза"}
      </button>
      <button className="control-button" onClick={onRestart}>
        Рестарт
      </button>
    </div>
  );
}
