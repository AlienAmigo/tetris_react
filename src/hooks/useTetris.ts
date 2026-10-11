import { useState, useCallback, useRef } from "react";
import type { GameState } from "../game/types";
import {
  createInitialState,
  spawnPiece,
  moveLeft,
  moveRight,
  moveDown,
  hardDrop,
  rotate,
  togglePause,
} from "../game/engine";
import { getDropInterval } from "../game/board";
import { useGameLoop } from "./useGameLoop";
import { useKeyboard } from "./useKeyboard";

export function useTetris() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const initial = createInitialState();
    return spawnPiece(initial);
  });

  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  const [displayState, setDisplayState] = useState<GameState>(gameState);
  const [isStarted, setIsStarted] = useState(false);
  const isStartedRef = useRef(isStarted);
  isStartedRef.current = isStarted;
  const dropAccumulatorRef = useRef(0);

  const handleTick = useCallback((deltaTime: number) => {
    const state = gameStateRef.current;
    const started = isStartedRef.current;

    if (!started || state.isPaused || state.isGameOver) return;

    dropAccumulatorRef.current += deltaTime;

    const dropInterval = getDropInterval(state.level);

    while (dropAccumulatorRef.current >= dropInterval) {
      dropAccumulatorRef.current -= dropInterval;

      const result = moveDown(state);
      const updatedState = result.state;

      if (!result.dropped) {
        if (updatedState.currentPiece === null) {
          const newState = spawnPiece(updatedState);
          dropAccumulatorRef.current = 0;
          setGameState(newState);
          setDisplayState(newState);
        } else {
          dropAccumulatorRef.current = 0;
          setGameState(updatedState);
          setDisplayState(updatedState);
        }
        return;
      }

      if (updatedState.currentPiece === null) {
        const spawned = spawnPiece(updatedState);
        dropAccumulatorRef.current = 0;
        setGameState(spawned);
        setDisplayState(spawned);
        return;
      }

      setGameState(updatedState);
      setDisplayState(updatedState);
    }
  }, []);

  useGameLoop(
    handleTick,
    isStartedRef.current && !gameState.isPaused && !gameState.isGameOver,
  );

  const keyHandlers = useCallback(() => {
    const state = gameStateRef.current;

    return {
      Enter: () => {
        if (!isStartedRef.current) {
          setIsStarted(true);
        }
      },
      ArrowLeft: () => {
        const newState = moveLeft(state);
        setGameState(newState);
        setDisplayState(newState);
      },
      ArrowRight: () => {
        const newState = moveRight(state);
        setGameState(newState);
        setDisplayState(newState);
      },
      ArrowDown: () => {
        const result = moveDown(state);
        const updatedState = result.state;
        const newScore = updatedState.score + (result.scored ? 0 : 1);
        const newState = { ...updatedState, score: newScore };
        setGameState(newState);
        setDisplayState(newState);

        if (newState.currentPiece === null) {
          const spawned = spawnPiece(newState);
          setGameState(spawned);
          setDisplayState(spawned);
        }
      },
      " ": () => {
        const newState = hardDrop(state);
        setGameState(newState);
        setDisplayState(newState);

        if (newState.currentPiece === null) {
          const spawned = spawnPiece(newState);
          setGameState(spawned);
          setDisplayState(spawned);
        }
      },
      ArrowUp: () => {
        const newState = rotate(state, true);
        setGameState(newState);
        setDisplayState(newState);
      },
      x: () => {
        const newState = rotate(state, true);
        setGameState(newState);
        setDisplayState(newState);
      },
      X: () => {
        const newState = rotate(state, true);
        setGameState(newState);
        setDisplayState(newState);
      },
      z: () => {
        const newState = rotate(state, false);
        setGameState(newState);
        setDisplayState(newState);
      },
      Z: () => {
        const newState = rotate(state, false);
        setGameState(newState);
        setDisplayState(newState);
      },
      p: () => {
        const newState = togglePause(state);
        setGameState(newState);
        setDisplayState(newState);
      },
      P: () => {
        const newState = togglePause(state);
        setGameState(newState);
        setDisplayState(newState);
      },
    };
  }, []);

  useKeyboard({ onKeyDown: keyHandlers() });

  const handlePause = useCallback(() => {
    const state = gameStateRef.current;
    const newState = togglePause(state);
    setGameState(newState);
    setDisplayState(newState);
  }, []);

  const handleRestart = useCallback(() => {
    const initial = createInitialState();
    const spawned = spawnPiece(initial);
    setGameState(spawned);
    setDisplayState(spawned);
    setIsStarted(true);
  }, []);

  const handleStart = useCallback(() => {
    if (!isStartedRef.current) {
      setIsStarted(true);
    }
  }, []);

  return {
    displayState,
    onPause: handlePause,
    onRestart: handleRestart,
    isStarted,
    onStart: handleStart,
  };
}
