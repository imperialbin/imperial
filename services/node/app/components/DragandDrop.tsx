import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  z-index: 999999;
`;

export const DragandDrop = () => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    let lastElement: EventTarget | null;

    const enter = (e: DragEvent) => {
      e.preventDefault();

      if (!e.dataTransfer?.types.find((type: string) => type === "Files"))
        return;

      lastElement = e.target;

      setActive(true);
    };

    const leave = (e: DragEvent) => {
      if (lastElement !== e.target) return;

      setActive(false);
    };

    const drop = (e: DragEvent) => {
      e.preventDefault();
      setActive(false);

      const reader = new FileReader();
      reader.readAsText(e?.dataTransfer?.files[0] as Blob);
      reader.addEventListener("load", () => {
        console.log(reader.result);
      });
    };

    window.addEventListener("drop", drop);
    window.addEventListener("dragenter", enter);
    window.addEventListener("dragleave", leave);
    window.addEventListener("dragover", (e) => e.preventDefault());
  }, []);

  return (
    <AnimatePresence>
      {active && (
        <Container>
          <h1>Drop files</h1>
        </Container>
      )}
    </AnimatePresence>
  );
};
