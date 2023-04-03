import Button from "@web/components/Button";
import { Logo } from "@web/components/Icons";
import Input from "@web/components/Input";
import { addNotification, openModal, setUser } from "@web/state/actions";
import { styled } from "@web/stitches.config";
import { makeRequest } from "@web/utils/Rest";
import { useState } from "react";
import { Lock, User, X } from "react-feather";
import { SelfUser } from "../../types";
import Header from "./base/Header";
import { Content, Wrapper } from "./base/Styles";
import { ModalProps } from "./base/modals";

const StyledWrapper = styled(Wrapper, {
  width: "80%",
  maxWidth: 600,
});

const StyledContent = styled(Content, {
  flexDirection: "row",
  marginBottom: 0,
});

const LogoContainer = styled("div", {
  position: "absolute",
  background: "$tertiary",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  width: "45%",
  gap: 10,
  right: 0,
  top: 0,
  borderBottomLeftRadius: "$medium",
  borderTopLeftRadius: "$medium",

  "> svg": {
    height: 80,
  },

  "> button": {
    position: "absolute",
    bottom: 20,
  },
});

function Login({ dispatch, closeModal }: ModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!username) {
      return dispatch(
        addNotification({
          icon: <X />,
          message: "Please provide a username",
          type: "error",
        }),
      );
    }

    if (username.length < 3) {
      return dispatch(
        addNotification({
          icon: <X />,
          message: "Username must be 3 characters",
          type: "error",
        }),
      );
    }

    if (!password) {
      return dispatch(
        addNotification({
          icon: <X />,
          message: "Please provide a password",
          type: "error",
        }),
      );
    }

    if (password.length < 8) {
      return dispatch(
        addNotification({
          icon: <X />,
          message: "Password must be 8 characters",
          type: "error",
        }),
      );
    }

    setLoading(true);

    const { data, success, error } = await makeRequest<{
      token: string;
      user: SelfUser;
    }>("POST", "/auth/login", {
      username,
      password,
    });

    setLoading(false);

    if (!success || !data)
      return dispatch(
        addNotification({
          icon: <X />,
          message: error?.message ?? "An error occurred whilst logging in.",
          type: "error",
        }),
      );

    dispatch(setUser(data.user));

    closeModal();
  };

  return (
    <StyledWrapper>
      <Header>Login</Header>
      <StyledContent>
        <div
          style={{
            width: "50%",
            gap: 10,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Input
            iconDisabled
            required
            label="Email or username"
            icon={<User />}
            placeholder="Enter your username or email"
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            iconDisabled
            required
            label="Password"
            icon={<Lock />}
            placeholder="Enter your password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            clickOnEnter
            style={{ alignSelf: "flex-start", marginTop: 15 }}
            disabled={loading}
            type="submit"
            onClick={submit}
          >
            Login
          </Button>
        </div>
        <LogoContainer>
          <Logo />
          <Button onClick={() => dispatch(openModal("signup"))}>No account?</Button>
        </LogoContainer>
      </StyledContent>
    </StyledWrapper>
  );
}

export default Login;
