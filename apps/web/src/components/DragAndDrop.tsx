import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { File } from "react-feather";
import { styled } from "../stitches.config";

const Container = styled(motion.div, {
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100vw",
  height: "100vh",
  zIndex: 999999,
});

const MiniContainer = styled(motion.div, {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "90%",
  height: "80%",
  maxWidth: 400,
  maxHeight: 180,
  borderRadius: 8,
  padding: 10,
  background: "$primary600",
  boxShadow: "rgba(0, 0, 0, 0.5) 0px 16px 70px",
});

const Dash = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
  borderRadius: 8,
  borderStyle: "dotted",
  borderColor: "$text-muted",
});

const IconContainer = styled(motion.div, {
  position: "absolute",
  top: -30,
  left: 10,

  "> svg": {
    color: "$text-secondary",
  },
});

const Title = styled("h1", {
  fontSize: "1.5em",
  margin: 0,
  textAlign: "center",
  color: "$text-primary",
});

const Span = styled("span", {
  textAlign: "center",
  padding: "0 30px",
  color: "$text-secondary",
});

const Tip = styled("span", {
  position: "absolute",
  left: 22,
  bottom: 20,
  fontSize: "0.8em",
  opacity: 0.8,
  color: "$text-secondary",
});

const TipAccent = styled("span", {
  fontSize: "0.9em",
  fontWeight: 700,
  paddingRight: 8,
  color: "$success",
});

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

function DragandDrop() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    let lastElement: EventTarget | null;

    const enter = (e: DragEvent) => {
      e.preventDefault();

      if (!e.dataTransfer?.types.find((type: string) => type === "Files")) return;

      lastElement = e.target;

      setActive(true);
    };

    const leave = (e: DragEvent) => {
      if (lastElement !== e.target) return;

      setActive(false);
    };

    const isFileImage = (file: Blob) => file && file.type.split("/")[0] === "image";

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
                : window.monaco.editor.getModels()[0].getValue() + reader.result,
            ),
        );
      }
    };

    window.addEventListener("drop", drop);
    window.addEventListener("dragenter", enter);
    window.addEventListener("dragleave", leave);
    window.addEventListener("dragover", (e) => e.preventDefault());

    return () => {
      window.removeEventListener("drop", drop);
      window.removeEventListener("dragenter", enter);
      window.removeEventListener("dragleave", leave);
      window.removeEventListener("dragover", (e) => e.preventDefault());
    };
  }, []);

  return (
    <AnimatePresence>
      {active ? (
        <Container
          transition={{ duration: 0.15 }}
          variants={animations}
          initial="initial"
          animate="active"
          exit="exit"
        >
          <MiniContainer variants={miniContainerAnimation}>
            <Dash>
              <IconContainer variants={iconAnimation}>
                <File size={70} />
              </IconContainer>
              <Title>Drop that!</Title>
              <Span>Drop anywhere to transfer the text in the file to IMPERIAL</Span>
              <Tip>
                <TipAccent>PROTIP</TipAccent>
                hold SHIFT to overwrite everything!
              </Tip>
            </Dash>
          </MiniContainer>
        </Container>
      ) : null}
    </AnimatePresence>
  );
}

export default DragandDrop;
