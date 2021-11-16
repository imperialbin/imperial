import { AnimatePresence, motion } from "framer-motion";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { FaFileAlt } from "react-icons/fa";
import styled from "styled-components";
import { languageState } from "../../state/editor";
import { supportedLanguages } from "../../utils";

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

const Tip = styled.span`
  position: absolute;
  left: 22px;
  bottom: 20px;
  font-size: 0.8em;
  opacity: 0.8;
`;

const TipAccent = styled.span`
  font-size: 0.9em;
  font-weight: 700;
  padding-right: 8px;
  color: ${({ theme }) => theme.success};
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

export const DragandDrop = (): JSX.Element => {
  const [active, setActive] = useState(false);
  const [language, setLanguage] = useAtom(languageState);

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

    const isFileImage = (file: Blob) =>
      file && file.type.split("/")[0] === "image";

    const drop = (e: DragEvent) => {
      e.preventDefault();
      setActive(false);
      if (!window.monaco) return;

      const reader = new FileReader();
      const file = e?.dataTransfer?.files[0] as Blob;

      reader.readAsText(file);

      if (!isFileImage(file)) {
        reader.addEventListener("load", () =>
          window.monaco.editor
            .getModels()[0]
            .setValue(
              e.shiftKey
                ? reader.result
                : window.monaco.editor.getModels()[0].getValue() +
                    reader.result,
            ),
        );

        const ext = (file as File)?.name.split(".").pop();

        const lang =
          supportedLanguages.find(lang =>
            lang.extensions?.some(extension => extension === ext),
          )?.name ?? language;

        if (lang !== "plaintext" || e.shiftKey) setLanguage(lang);
      }
    };

    window.addEventListener("drop", drop);
    window.addEventListener("dragenter", enter);
    window.addEventListener("dragleave", leave);
    window.addEventListener("dragover", e => e.preventDefault());
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
              <Tip>
                <TipAccent>PROTIP</TipAccent>
                hold SHIFT to overwrite everything!
              </Tip>
            </Dash>
          </MiniContainer>
        </Container>
      )}
    </AnimatePresence>
  );
};
