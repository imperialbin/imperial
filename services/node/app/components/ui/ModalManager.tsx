import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { Document } from "../../types";
import { useAtom } from "jotai";
import { activeModal } from "../../state/modal";
import { Tooltip } from "./Tooltip";
import { IoMdClose } from "react-icons/io";
import { useRef } from "react";
import { useModalHook } from "../../hooks/modalHook";
import { modals } from "../../state/modal/modals";
import {
  LanguageModal,
  AddUsersModal,
  DocumentSettings,
  UserSettings,
  Login,
  Signup,
  ResetPassword,
} from "./modals";

const ModalContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  color: white;
  backdrop-filter: blur(1.5px);
  background: rgba(0, 0, 0, 0.3);
`;

const ModalBody = styled(motion.div)<{
  modal: string;
  noHeader: boolean;
}>`
  width: 80%;
  max-width: ${({ modal }) => (modal === "userSettings" ? "800px" : "650px")};
  min-height: 200px;
  ${({ modal }) => modal === "userSettings" && "height: 50%;"}
  max-height: 80%;
  overflow: scroll;
  border-radius: 8px;
  padding: ${({ noHeader }) => (!noHeader ? "18px" : "0")};
  box-shadow: rgba(0, 0, 0, 0.5) 0px 16px 70px;
  background: ${({ theme }) => theme.layoutLightestOfTheBunch};
`;

const Header = styled.div<{
  noHeader: boolean;
}>`
  display: flex;
  position: ${({ noHeader }) => (noHeader ? "absolute" : "relative")};
  right: ${({ noHeader }) => noHeader && "10px"};
  top: ${({ noHeader }) => noHeader && "15px"};
  flex-direction: row;
  align-items: center;
  color: white;
  z-index: 1;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.55em;
  font-weight: 600;
  flex-grow: 1;
`;

const modalContainerAnimation = {
  initial: {
    opacity: 0,
    backdropFilter: "blur(0px)",
  },
  isOpen: {
    opacity: 1,
    backdropFilter: "blur(1.3px)",
  },
  exit: {
    opacity: 0,
    backdropFilter: "blur(0px)",
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
  const [[currentModal, data], setActiveModal] = useAtom(activeModal);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const modal = currentModal && modals[currentModal];

  useModalHook(modalRef, () => setActiveModal([null, null]));

  return (
    <AnimatePresence>
      {modal && currentModal && (
        <ModalContainer
          initial={"initial"}
          animate={"isOpen"}
          exit={"exit"}
          transition={{ duration: 0.2 }}
          variants={modalContainerAnimation}
        >
          <ModalBody
            ref={modalRef}
            transition={{ duration: 0.15 }}
            variants={modalAnimation}
            modal={currentModal}
            noHeader={modal.noHeader}
          >
            <Header noHeader={modal.noHeader}>
              {/* Remove header for some modals */}
              {!modal.noHeader && <Title>{modal.title}</Title>}
              <Tooltip
                style={{
                  display: "inline-flex",
                  marginRight: 8,
                }}
                title="Close (esc)"
              >
                <IoMdClose
                  size={23}
                  style={{ cursor: "pointer" }}
                  onClick={() => setActiveModal([null, null])}
                />
              </Tooltip>
            </Header>
            {currentModal === "language" && <LanguageModal />}
            {currentModal === "addUsers" && <AddUsersModal />}
            {currentModal === "userSettings" && <UserSettings />}
            {currentModal === "documentSettings" && (
              <DocumentSettings document={data as Document} />
            )}
            {currentModal === "login" && <Login />}
            {currentModal === "signup" && <Signup />}
            {currentModal === "resetPassword" && <ResetPassword />}
            <br />
          </ModalBody>
        </ModalContainer>
      )}
    </AnimatePresence>
  );
};
