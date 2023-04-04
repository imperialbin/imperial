// useKeyAction - a hook that does a callback on a specific key press

import { useEffect } from "react";

export default function useKeyAction(key: string, callback: () => void) {
  useEffect(() => {
    const onKeyPress = (e: KeyboardEvent) => {
      if (e.key !== key) return;

      callback();
    };

    document.addEventListener("keydown", onKeyPress);

    return () => {
      document.removeEventListener("keydown", onKeyPress);
    };
  }, [key, callback]);
}
