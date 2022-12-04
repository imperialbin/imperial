import { useState } from "react";
import { Lock, User, X } from "react-feather";
import { addNotification, closeModal, openModal } from "../../state/actions";
import { styled } from "../../stitches";
import { makeRequest } from "../../utils/Rest";
import Button from "../Button";
import { Logo } from "../Icons";
import Input from "../Input";
import Header from "./base/Header";
import { ModalProps } from "./base/modals";
import { Content, Wrapper } from "./base/Styles";

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

const Login = ({ dispatch }: ModalProps) => {
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
        })
      );
    }

    if (username.length < 3) {
      return dispatch(
        addNotification({
          icon: <X />,
          message: "Username must be 3 characters",
          type: "error",
        })
      );
    }

    if (!password) {
      return dispatch(
        addNotification({
          icon: <X />,
          message: "Please provide a password",
          type: "error",
        })
      );
    }

    if (password.length < 8) {
      return dispatch(
        addNotification({
          icon: <X />,
          message: "Password must be 8 characters",
          type: "error",
        })
      );
    }

    setLoading(true);

    const { success, error } = await makeRequest("POST", "/auth/login", {
      username,
      password,
    });

    setLoading(false);

    if (!success)
      return dispatch(
        addNotification({
          icon: <X />,
          message: error?.message ?? "An error occurred whilst logging in.",
          type: "error",
        })
      );

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
            label="Email or username"
            icon={<User />}
            iconClick={() => null}
            placeholder="Enter your username or email"
            onChange={(e) => setUsername(e.target.value)}
            iconDisabled
            required
          />
          <Input
            label="Password"
            icon={<Lock />}
            iconClick={() => null}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            iconDisabled
            required
          />
          <Button
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
          <Button onClick={() => dispatch(openModal("signup"))}>
            No account?
          </Button>
        </LogoContainer>
      </StyledContent>
    </StyledWrapper>
  );
};

export default Login;
