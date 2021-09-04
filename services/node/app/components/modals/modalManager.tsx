import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { ModalProps, ThemeForStupidProps } from "../../types";
import { useAtom } from "jotai";
import { atomActiveModal } from "../../state/modal";
import { Tooltip } from "../tooltip";
import { IoMdClose } from "react-icons/io";
import { useRef } from "react";
import { useModalHook } from "../../hooks/modalHook";
import { modals } from "../../state/modal/modals";

const ModalContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  color: white;
  backdrop-filter: blur(1.5px);
  background: rgba(0, 0, 0, 0.3);
`;

const ModalBody = styled(motion.div)`
  width: 80%;
  max-width: 600px;
  border-radius: 8px;
  padding: 8px;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 16px 70px;
  background: ${({ theme }: ThemeForStupidProps) =>
    theme.layoutLightestOfTheBunch};
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: white;
`;

const Title = styled.h1`
  margin: 0 10px;
  font-size: 1.85em;
  font-weight: 600;
  flex-grow: 1;
`;

const modalContainerAnimation = {
  initial: {
    "opacity": 0,
    "backdrop-filter": "blur(0px)",
  },
  isOpen: {
    "opacity": 1,
    "backdrop-filter": "blur(1.3px)",
  },
  exit: {
    "opacity": 0,
    "backdrop-filter": "blur(0px)",
  },
};

const modalAnimation = {
  initial: {
    transform: "scale(0.95)",
  },
  isOpen: {
    transform: "scale(1)",
  },
  exit: {
    transform: "scale(0.95)",
  },
};

export const ModalManager = (): JSX.Element => {
  const [activeModal, setActiveModal] = useAtom(atomActiveModal);
  const modalRef = useRef();

  const modal = modals[activeModal];

  useModalHook(modalRef, () => setActiveModal(null));

  return (
    <AnimatePresence>
      {activeModal && (
        <ModalContainer
          initial={"initial"}
          animate={"isOpen"}
          exit={"exit"}
          transition={{ duration: 0.2 }}
          variants={modalContainerAnimation}
        >
          <ModalBody
            // @ts-expect-error mate
            ref={modalRef}
            transition={{ duration: 0.15 }}
            variants={modalAnimation}
          >
            <Header>
              <Title>{modal.title}</Title>
              <Tooltip
                style={{ display: "inline-flex", marginRight: 13 }}
                title="Close (esc)"
              >
                <IoMdClose
                  size={23}
                  style={{ cursor: "pointer" }}
                  onClick={() => setActiveModal(null)}
                />
              </Tooltip>
            </Header>
            <br />
          </ModalBody>
        </ModalContainer>
      )}
    </AnimatePresence>
  );
};
