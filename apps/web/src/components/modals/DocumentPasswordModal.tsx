import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Lock, X } from "react-feather";
import { addNotification, setDisableClickOutsideModal } from "../../state/actions";
import { decrypt } from "../../utils/crypto";
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

function DocumentPasswordModal({
  closeModal,
  data: { encryptedContent, setDecryptedContent },
  dispatch,
}: IDocumentPasswordModalProps) {
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
      <Paragraph>To access this document, you will need to provide a password.</Paragraph>
      <Content>
        <Input
          value={password}
          icon={{ svg: <Lock /> }}
          placeholder="s3cur3 p@s5w0rd1"
          onChange={({ target: { value } }) => setPassword(value)}
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
          clickOnEnter
          disabled={password.length === 0}
          onClick={() => {
            const decryptedContent = decrypt(password, encryptedContent);

            if (!decryptedContent)
              return dispatch(
                addNotification({
                  icon: <X />,
                  message: "Incorrect password!",
                  type: "error",
                }),
              );

            setDecryptedContent(decryptedContent);
            closeModal();
          }}
        >
          Submit
        </Button>
      </Footer>
    </Wrapper>
  );
}

export default DocumentPasswordModal;
