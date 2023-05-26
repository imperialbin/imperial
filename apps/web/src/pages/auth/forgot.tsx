import { useState } from "react";
import { Mail, X } from "react-feather";
import { makeRequest } from "../../utils/rest";
import { store } from "../../state";
import { addNotification } from "../../state/actions";
import { Container, StyledButton, Wrapper } from "../../components/AuthStyles";
import Input from "../../components/Input";

function Forgot() {
  const [email, setEmail] = useState("");
  const [disableButton, setDisableButton] = useState(false);

  const sendEmail = async () => {
    setDisableButton(true);
    const { success, error } = await makeRequest("POST", "/auth/forgot", { email });

    if (!success) {
      setDisableButton(false);

      return store.dispatch(
        addNotification({
          icon: <X />,
          message: error?.message ?? "An error occurred whilst sending the email.",
          type: "error",
        }),
      );
    }

    store.dispatch(
      addNotification({
        icon: <Mail />,
        message: "Email sent! Check your inbox for a link to reset your password.",
        type: "success",
      }),
    );
  };

  return (
    <Wrapper>
      <Container>
        <div>
          <h1>Forgot Password?</h1>
          <p>It happens to the best of us... Luckily, we can help you with that!</p>
        </div>

        <Input
          value={email}
          placeholder="Email"
          icon={{ svg: <Mail /> }}
          onChange={({ target: { value } }) => setEmail(value)}
        />
        <StyledButton
          clickOnEnter
          disabled={email.length === 0 || disableButton}
          onClick={sendEmail}
        >
          Send Email
        </StyledButton>
      </Container>
    </Wrapper>
  );
}

export default Forgot;
