import { Lock } from "react-feather";
import Input from "../Input";
import Header from "./base/Header";
import { ModalProps } from "./base/modals";
import { Paragraph, Wrapper } from "./base/Styles";

const PasswordModal = (props: ModalProps) => {
  return (
    <Wrapper>
      <Header>Document is encrypted</Header>
      <Paragraph>
        To access this document, you will need to provide a password.
      </Paragraph>
      <Input icon={<Lock />} placeholder="s3cur3 p@s5w0rd1" />
    </Wrapper>
  );
};

export default PasswordModal;
