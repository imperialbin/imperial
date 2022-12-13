import { connect, ConnectedProps } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useRef } from "react";
import { styled } from "@stitches/react";
import { closeModal } from "../state/actions";
import { ImperialState } from "../state/reducers";
import { useOutsideClick } from "../hooks/useOutsideClick";
import Login from "./modals/Login";
import Signup from "./modals/Signup";
import { LanguageSelector } from "./modals/LanguageSelector";
import UserSettings from "./modals/UserSettings";
import { DocumentSettings } from "./modals/DocumentSettings";
import DocumentPasswordModal from "./modals/DocumentPasswordModal";

const Wrapper = styled(motion.div, {
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  position: "fixed",
  "z-index": 900,
  display: "flex",
  "flex-direction": "column",
  "justify-content": "center",
  "align-items": "center",
  background: "rgba(0, 0, 0, 0.3)",
});

const Container = styled(motion.div, {
  width: "100%",
  height: "100%",
  display: "flex",
  "flex-direction": "column",
  "justify-content": "center",
  "align-items": "center",
});

const WRAPPER_ANIMATION = {
  initial: {
    opacity: 0,
  },
  active: {
    opacity: 1,
  },
};

const CONTAINER_ANIMATION = {
  initial: {
    transform: "scale(0.95)",
  },
  active: {
    transform: "scale(1)",
  },
};

const MODAL_MAP = {
  login: Login,
  signup: Signup,
  user_settings: UserSettings,
  language_selector: LanguageSelector,
  document_settings: DocumentSettings,
  document_password: DocumentPasswordModal,
};

type GetComponentProps<T> = T extends
  | React.ComponentType<infer P>
  | React.Component<infer P>
  ? P
  : never;
export type Modals = keyof typeof MODAL_MAP;
export type ModalData<T extends Modals> = GetComponentProps<
  typeof MODAL_MAP[T]
> extends {
  data: unknown;
}
  ? GetComponentProps<typeof MODAL_MAP[T]>["data"]
  : {} | never;

const ModalManager = ({
  modal,
  disable_click_outside_modal,
  dispatch,
}: ReduxProps) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const ActiveModal = modal ? MODAL_MAP[modal.modal] : null;

  useOutsideClick(modalRef, () =>
    disable_click_outside_modal ? null : dispatch(closeModal())
  );

  const stableDispatch = useCallback(dispatch, []);

  return (
    <AnimatePresence>
      {modal ? (
        <Wrapper
          initial="initial"
          animate="active"
          exit="initial"
          transition={{ duration: 0.2 }}
          variants={WRAPPER_ANIMATION}
        >
          <Container
            ref={modalRef}
            transition={{ duration: 0.15 }}
            variants={CONTAINER_ANIMATION}
            key={modal.modal}
          >
            {ActiveModal ? (
              <ActiveModal
                dispatch={stableDispatch}
                closeModal={() => dispatch(closeModal())}
                data={modal.data}
              />
            ) : null}
          </Container>
        </Wrapper>
      ) : null}
    </AnimatePresence>
  );
};

const mapStateToProps = ({ modal, ui_state }: ImperialState) => {
  return {
    modal,
    disable_click_outside_modal: ui_state.disable_click_outside_modal,
  };
};
const connector = connect(mapStateToProps);
type ReduxProps = ConnectedProps<typeof connector>;

export default connector(ModalManager);