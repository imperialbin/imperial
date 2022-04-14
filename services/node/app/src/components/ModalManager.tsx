import { connect, ConnectedProps } from "react-redux";
import { ImperialState } from "../../state/reducers";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
import Login from "./modals/Login";
import Signup from "./modals/Signup";
import { useOutsideClick } from "../hooks/useOutsideClick";
import { closeModal } from "../../state/actions";

const Wrapper = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  color: white;
  background: rgba(0, 0, 0, 0.3);
`;
const Container = styled(motion.div)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
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
};

export type Modals = keyof typeof MODAL_MAP; // 💀💀💀💀

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
