import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Lock, X } from "react-feather";
import {
  addNotification,
  setDisableClickOutsideModal,
} from "../../state/actions";
import { decrypt } from "../../utils/Crypto";
import Button from "../Button";
import Input from "../Input";
import Header from "./base/Header";
import { ModalProps } from "./base/modals";
import { Content, Footer, Paragraph, Wrapper } from "./base/Styles";

interface IDocumentPasswordModalProps extends ModalProps {
  data: {
    encryptedContent: string;
    setDecryptedContent: React.Dispatch<React.SetStateAction<string>>;
  };
}

const DocumentPasswordModal = ({
  closeModal,
  data: { encryptedContent, setDecryptedContent },
  dispatch,
}: IDocumentPasswordModalProps) => {
  const [password, setPassword] = useState(location.hash.split("#")[1] ?? "");
  const router = useRouter();

  useEffect(() => {
    dispatch(setDisableClickOutsideModal(true));

    return () => {
      dispatch(setDisableClickOutsideModal(false));
    };
  }, []);

  return (
    <Wrapper>
      <Header canClose={false}>Document is encrypted</Header>
      <Paragraph>
        To access this document, you will need to provide a password.
      </Paragraph>
      <Content>
        <Input
          value={password}
          onChange={({ target: { value } }) => setPassword(value)}
          icon={<Lock />}
          placeholder="s3cur3 p@s5w0rd1"
        />
      </Content>
      <Footer>
        <Button
          btnType="secondary"
          onClick={() => {
            router.push("/");
            closeModal();
          }}
        >
          Go Home
        </Button>
        <Button
          onClick={() => {
            const decryptedContent = decrypt(password, encryptedContent);

            if (!decryptedContent)
              return dispatch(
                addNotification({
                  icon: <X />,
                  message: "Incorrect password!",
                  type: "error",
                })
              );

            setDecryptedContent(decryptedContent);
            closeModal();
          }}
          disabled={password.length === 0}
          clickOnEnter
        >
          Submit
        </Button>
      </Footer>
    </Wrapper>
  );
};

export default DocumentPasswordModal;
