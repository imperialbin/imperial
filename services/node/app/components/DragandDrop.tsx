import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaFileAlt } from "react-icons/fa";
import styled from "styled-components";

const Container = styled(motion.div)`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  z-index: 999999;
`;

const MiniContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 90%;
  height: 80%;
  max-width: 400px;
  max-height: 180px;
  border-radius: 8px;
  padding: 10px;
  background: ${({ theme }) => theme.layoutLittleLessDark};
  box-shadow: rgba(0, 0, 0, 0.5) 0px 16px 70px;
`;

const Dash = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  border-style: dotted;
  border-color: ${({ theme }) => theme.textDarkest};
`;

const IconContainer = styled(motion.div)`
  position: absolute;
  top: -30px;
  left: 10px;
`;

const Title = styled.h1`
  font-size: 1.5em;
  margin: 0;
  text-align: center;
  color: ${({ theme }) => theme.textLight};
`;

const Span = styled.span`
  text-align: center;
  padding: 0 30px;
  color: ${({ theme }) => theme.textDarker};
`;

const animations = {
  initial: {
    opacity: 0,
    backdropFilter: "blur(0)",
    background: "rgba(0, 0, 0, 0)",
  },
  active: {
    opacity: 1,
    backdropFilter: "blur(1.5px)",
    background: "rgba(0, 0, 0, 0.2)",
  },
  exit: {
    opacity: 0,
    backdropFilter: "blur(0)",
    background: "rgba(0, 0, 0, 0)",
  },
};

const miniContainerAnimation = {
  initial: {
    transform: "scale(0.95)",
  },
  active: {
    transform: "scale(1)",
  },
  exit: {
    transform: "scale(0.95)",
  },
};

const iconAnimation = {
  initial: {
    y: -15,
  },
  active: {
    y: 0,
  },
  exit: {
    y: 10,
  },
};

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
        <Container
          transition={{ duration: 0.15 }}
          variants={animations}
          initial={"initial"}
          animate={"active"}
          exit={"exit"}
        >
          <MiniContainer variants={miniContainerAnimation}>
            <Dash>
              <IconContainer variants={iconAnimation}>
                <FaFileAlt size={70} />
              </IconContainer>
              <Title>Drop that!</Title>
              <Span>
                Drop anywhere to transfer the text in the file to IMPERIAL
              </Span>
            </Dash>
          </MiniContainer>
        </Container>
      )}
    </AnimatePresence>
  );
};
