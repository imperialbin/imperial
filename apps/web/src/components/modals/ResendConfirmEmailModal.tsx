import { useState } from "react";
import { Check, X } from "react-feather";
import { addNotification } from "../../state/actions";
import { makeRequest } from "../../utils/rest";
import Button from "../Button";
import Header from "./base/Header";
import { Footer, Paragraph, Wrapper } from "./base/Styles";
import { ModalProps } from "./base/modals";

interface IResendConfirmEmailModalProps extends ModalProps {
  data: {
    email: string;
  };
}

function ResendConfirmEmailModal({
  closeModal,
  data: { email },
  dispatch,
}: IResendConfirmEmailModalProps) {
  const [loading, setLoading] = useState(false);

  const resendEmail = async () => {
    setLoading(true);
    const { success, error } = await makeRequest("POST", "/auth/resend_confirm", {
      email,
    });
    setLoading(false);

    if (!success) {
      return dispatch(
        addNotification({
          icon: <X />,
          message: error?.message ?? "Failed to resend confirmation email",
          type: "error",
        }),
      );
    }

    dispatch(
      addNotification({
        icon: <Check />,
        message: "Confirmation email sent!",
        type: "success",
      }),
    );
    closeModal();
  };

  return (
    <Wrapper>
      <Header>Resend Confirmation</Header>
      <Paragraph>
        Confirming your email will let you unlock all the special features IMPERIAL has to
        offer!
      </Paragraph>

      <Footer>
        <Button btnType="secondary" onClick={closeModal}>
          Cancel
        </Button>
        <Button clickOnEnter disabled={loading} onClick={resendEmail}>
          Resend
        </Button>
      </Footer>
    </Wrapper>
  );
}

export default ResendConfirmEmailModal;
