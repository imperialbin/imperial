import { useEffect } from "react";

export const useModalHook = (ref: any, handler: any) => {
  useEffect(() => {
    const listener = (e: any) => {
      if (!ref.current || ref.current.contains(e.target)) return;

      handler(e);
    };

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") handler();
    });

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};
