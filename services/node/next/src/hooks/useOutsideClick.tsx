import { MutableRefObject, useEffect } from "react";

export const useOutsideClick = (
  ref: MutableRefObject<HTMLDivElement | null>,
  handler: (_e: MouseEvent | TouchEvent | KeyboardEvent) => unknown
): void => {
  useEffect(() => {
    const listener = (e: MouseEvent | TouchEvent) => {
      if (!ref || !ref.current || ref.current !== e.target) return;

      handler(e);
    };

    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handler(e);
    };

    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [ref, handler]);
};
