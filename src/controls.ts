import { useEffect } from "react";

interface UseKeyboardShortcutArgs {
  key: string
  onKeyDown: () => void;
  onKeyUp: () => void;

}

export function useKeyboardShortcut({
  key,
  onKeyDown, 
  onKeyUp,
}: UseKeyboardShortcutArgs) {
  useEffect(() => {
    function keyDownHandler(e: globalThis.KeyboardEvent) {
      if (e.key === key) {
        e.preventDefault();
        onKeyDown();
      }
    }
    function keyUpHandler(e: globalThis.KeyboardEvent) {
        if (e.key === key) {
          e.preventDefault();
          onKeyUp();
        }
      }

    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("keyup", keyUpHandler);

    };
  }, []);
}