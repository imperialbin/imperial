import { MutableRefObject, useEffect } from "react";

export const useModalHook = (
  ref: MutableRefObject<HTMLDivElement | null>,
  handler: (e: MouseEvent | TouchEvent | KeyboardEvent) => unknown
): void => {
  useEffect(() => {
    const listener = (e: MouseEvent | TouchEvent) => {
      if (ref.current?.contains(e.target as Node)) return;

      handler(e);
    };

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") handler(e);
    });

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};
