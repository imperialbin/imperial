import { connect, ConnectedProps } from "react-redux";
import { ImperialState } from "../../state/reducers";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
import Login from "./modals/Login";
import Signup from "./modals/Signup";
import { useOutsideClick } from "../hooks/useOutsideClick";
import { closeModal } from "../../state/actions";
import UserSettings from "./modals/UserSettings";

const Wrapper = styled(motion.div)`
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 900;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
`;

const Container = styled(motion.div)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const WrapperAnimation = {
  initial: {
    opacity: 0,
  },
  active: {
    opacity: 1,
  },
};

const ContainerAnimation = {
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
};

export type Modals = keyof typeof MODAL_MAP; // 💀💀💀💀
type GetComponentProps<T> = T extends
  | React.ComponentType<infer P>
  | React.Component<infer P>
  ? P
  : never;
export type ModalData<T extends Modals> = GetComponentProps<
  typeof MODAL_MAP[T]
> extends {
  data: unknown;
}
  ? GetComponentProps<typeof MODAL_MAP[T]>["data"]
  : Record<string, never> | never;

const ModalManager = ({ modal, dispatch }: ReduxProps) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const ActiveModal = modal ? MODAL_MAP[modal.modal] : null;

  useOutsideClick(modalRef, () => dispatch(closeModal()));

  return (
    <AnimatePresence>
      {modal ? (
        <Wrapper
          initial={"initial"}
          animate={"active"}
          exit={"initial"}
          transition={{ duration: 0.2 }}
          variants={WrapperAnimation}
        >
          <Container
            ref={modalRef}
            transition={{ duration: 0.15 }}
            variants={ContainerAnimation}
          >
            {ActiveModal ? <ActiveModal /> : null}
          </Container>
        </Wrapper>
      ) : null}
    </AnimatePresence>
  );
};

const mapStateToProps = ({ modal }: ImperialState) => {
  return { modal };
};
const connector = connect(mapStateToProps);
type ReduxProps = ConnectedProps<typeof connector>;

export default connector(ModalManager);
