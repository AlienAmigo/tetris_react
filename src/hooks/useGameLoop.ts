import { useRef, useCallback, useEffect } from "react";

export function useGameLoop(
  callback: (deltaTime: number) => void,
  isRunning: boolean,
) {
  const callbackRef = useRef(callback);
  const frameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  callbackRef.current = callback;

  const animate = useCallback((time: number) => {
    if (lastTimeRef.current === 0) {
      lastTimeRef.current = time;
    }

    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    callbackRef.current(deltaTime);
    frameRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (isRunning) {
      lastTimeRef.current = 0;
      frameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (frameRef.current !== 0) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = 0;
      }
    };
  }, [isRunning, animate]);
}
