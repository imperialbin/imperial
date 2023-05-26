import { connect, ConnectedProps } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useRef } from "react";
import { styled } from "@web/stitches.config";
import { closeModal } from "../state/actions";
import { ImperialState } from "../state/reducers";
import { useOutsideClick } from "../hooks/useOutsideClick";
import LoginModal from "./modals/LoginModal";
import SignupModal from "./modals/SignupModal";
import LanguageSelectorModal from "./modals/LanguageSelectorModal";
import UserSettingsModal from "./modals/UserSettingsModal";
import DocumentSettingsModal from "./modals/DocumentSettingsModal";
import DocumentPasswordModal from "./modals/DocumentPasswordModal";
import EditorsModal from "./modals/EditorsModal";
import ResendConfirmEmailModal from "./modals/ResendConfirmEmailModal";

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
  login: LoginModal,
  signup: SignupModal,
  user_settings: UserSettingsModal,
  language_selector: LanguageSelectorModal,
  document_settings: DocumentSettingsModal,
  document_password: DocumentPasswordModal,
  editors: EditorsModal,
  resend_confirm_email: ResendConfirmEmailModal,
};

type GetComponentProps<T> = T extends
  | React.ComponentType<infer P>
  | React.Component<infer P>
  ? P
  : never;
export type Modals = keyof typeof MODAL_MAP;
export type ModalData<T extends Modals> = GetComponentProps<
  (typeof MODAL_MAP)[T]
> extends {
  data: unknown;
}
  ? GetComponentProps<(typeof MODAL_MAP)[T]>["data"]
  : {} | never;

function ModalManager({ modal, disable_click_outside_modal, dispatch }: ReduxProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const ActiveModal = modal ? MODAL_MAP[modal.modal] : null;

  useOutsideClick(modalRef, () =>
    disable_click_outside_modal ? null : dispatch(closeModal()),
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
            key={modal.modal}
            transition={{ duration: 0.15 }}
            variants={CONTAINER_ANIMATION}
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
}

const mapStateToProps = ({ modal, ui_state }: ImperialState) => ({
  modal,
  disable_click_outside_modal: ui_state.disable_click_outside_modal,
});

const connector = connect(mapStateToProps);
type ReduxProps = ConnectedProps<typeof connector>;

export default connector(ModalManager);
