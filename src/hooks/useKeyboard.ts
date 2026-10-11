import { useRef, useEffect } from "react";

type KeyCallback = () => void;

interface UseKeyboardOptions {
  onKeyDown: Record<string, KeyCallback>;
}

export function useKeyboard({ onKeyDown }: UseKeyboardOptions) {
  const onKeyDownRef = useRef(onKeyDown);

  onKeyDownRef.current = onKeyDown;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      const key = event.key;

      if (key in onKeyDownRef.current) {
        event.preventDefault();
        onKeyDownRef.current[key]();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onKeyDown]);
}
