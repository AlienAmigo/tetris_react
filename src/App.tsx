import { Board } from "./components/Board";
import { NextPiece } from "./components/NextPiece";
import { ScorePanel } from "./components/ScorePanel";
import { Controls } from "./components/Controls";
import { useTetris } from "./hooks/useTetris";

export function App() {
  const { displayState, onPause, onRestart, isStarted, onStart } = useTetris();

  return (
    <div className="app">
      <h1 className="app-title">Тетрис</h1>

      {!isStarted && (
        <div className="overlay overlay-start">
          <div className="overlay-content">
            <h2>Тетрис</h2>
            <p className="start-hint">Нажмите Enter или кликните для старта</p>
            <button className="overlay-button" onClick={onStart}>
              Начать игру
            </button>
          </div>
        </div>
      )}

      <div className="game-container">
        <div className="game-sidebar sidebar-left">
          <ScorePanel
            score={displayState.score}
            level={displayState.level}
            lines={displayState.lines}
          />
          <NextPiece piece={displayState.nextPiece} />
          <Controls
            onPause={onPause}
            onRestart={onRestart}
            isPaused={displayState.isPaused}
          />
        </div>

        <Board gameState={displayState} />

        <div className="game-sidebar sidebar-right">
          <div className="controls-hint">
            <h3>Управление</h3>
            <div className="hint-row">
              <span className="hint-key">← →</span>
              <span className="hint-text">Движение</span>
            </div>
            <div className="hint-row">
              <span className="hint-key">↓</span>
              <span className="hint-text">Мягкий drop</span>
            </div>
            <div className="hint-row">
              <span className="hint-key">↑ / X</span>
              <span className="hint-text">Поворот ↻</span>
            </div>
            <div className="hint-row">
              <span className="hint-key">Z</span>
              <span className="hint-text">Поворот ↺</span>
            </div>
            <div className="hint-row">
              <span className="hint-key">Пробел</span>
              <span className="hint-text">Hard drop</span>
            </div>
            <div className="hint-row">
              <span className="hint-key">P</span>
              <span className="hint-text">Пауза</span>
            </div>
          </div>
        </div>
      </div>

      {displayState.isPaused && !displayState.isGameOver && (
        <div className="overlay overlay-paused">
          <div className="overlay-content">
            <h2>Пауза</h2>
            <button className="overlay-button" onClick={onPause}>
              Продолжить
            </button>
          </div>
        </div>
      )}

      {displayState.isGameOver && (
        <div className="overlay overlay-gameover">
          <div className="overlay-content">
            <h2>Игра окончена</h2>
            <p className="final-score">Счёт: {displayState.score}</p>
            <button className="overlay-button" onClick={onRestart}>
              Играть снова
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
