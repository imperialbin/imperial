import { useRouter } from "next/router";
import { useState } from "react";
import { Lock, Mail, X } from "react-feather";
import Input from "../../components/Input";
import { Container, StyledButton, Wrapper } from "../../components/AuthStyles";
import { store } from "../../state";
import { makeRequest } from "../../utils/Rest";
import { addNotification } from "../../state/actions";

function Reset() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [disableButton, setDisableButton] = useState(false);

  const router = useRouter();

  const resetPassword = async () => {
    const token = router.query.token as string;
    if (!token) {
      return store.dispatch(
        addNotification({
          message: "Invalid token.",
          type: "error",
          icon: <X />,
        }),
      );
    }

    if (newPassword !== confirmPassword) {
      return store.dispatch(
        addNotification({
          message: "Passwords do not match.",
          type: "error",
          icon: <X />,
        }),
      );
    }

    setDisableButton(true);
    const { success, error } = await makeRequest("POST", "/auth/reset_password/token", {
      token,
      newPassword,
    });

    if (!success) {
      setDisableButton(false);

      return store.dispatch(
        addNotification({
          icon: <X />,
          message: error?.message ?? "An error occurred whilst resetting your password.",
          type: "error",
        }),
      );
    }

    store.dispatch(
      addNotification({
        icon: <Mail />,
        message: "Password reset! Please login with your new password.",
        type: "success",
      }),
    );
  };

  return (
    <Wrapper>
      <Container>
        <div>
          <h1>Reset Password</h1>
          <p>If it makes you feel any better, we&apos;ve all been here before...</p>
        </div>

        <Input
          value={newPassword}
          placeholder="New Password"
          icon={<Lock />}
          type="password"
          onChange={({ target: { value } }) => setNewPassword(value)}
        />
        <Input
          value={confirmPassword}
          placeholder="Confirm Password"
          type="password"
          icon={<Lock />}
          onChange={({ target: { value } }) => setConfirmPassword(value)}
        />

        <StyledButton
          clickOnEnter
          disabled={
            newPassword.length === 0 || confirmPassword.length === 0 || disableButton
          }
          onClick={resetPassword}
        >
          Reset Password
        </StyledButton>
      </Container>
    </Wrapper>
  );
}

export default Reset;
