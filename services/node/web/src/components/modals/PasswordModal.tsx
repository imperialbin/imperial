import styled from "styled-components";
import { ModalProps } from "./base/modals";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 80%;
  max-width: 650px;
  min-height: 200px;
  height: 50%;
  max-height: 325px;
  overflow: hidden;
  border-radius: 12px;
  background: ${({ theme }) => theme.background.lightestOfTheBunch};
`;

const PasswordModal = (props: ModalProps) => {
  return (
    <Wrapper>
      <h1>Document is encrypted.</h1>
    </Wrapper>
  );
};

export default PasswordModal;
