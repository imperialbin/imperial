import { useState } from "react";
import { Lock, User, X } from "react-feather";
import { addNotification, openModal } from "../../state/actions";
import { styled } from "../../stitches";
import { makeRequest } from "../../utils/Rest";
import Input from "../Input";
import Header from "./base/Header";
import { ModalProps } from "./base/modals";
import { Wrapper } from "./base/Styles";

const StyledWrapper = styled(Wrapper, {
  width: "80%",
  maxWidth: 650,
  height: "50%",
  minHeight: 200,
  maxHeight: 325,
});

const FullContainer = styled("div", {
  display: "inline-flex",
  height: "100%",
  width: "100%",
});

const Left = styled("div", {
  display: "flex",
  flexDirection: "column",
  flex: 0.8,
  alignItems: "center",
  justifyContent: "center",
  background: "${({ theme }) => theme.background.dark}",
  boxShadow: "-1.7168px 6.86722px 36.0529px 8.58402px rgba(0, 0, 0, 0.25)",
  padding: 10,
  borderBottomRightRadius: 12,
  borderTopRightRadius: 12,
});

const LeftBtn = styled("button", {
  border: "none",
  borderRadius: 5,
  marginTop: 8,
  padding: "10px 15px",
  fontSize: "0.9em",
  cursor: "pointer",
  opacity: 0.8,
  color: "${({ theme }) => theme.text.light}",
  background: "",
  boxShadow: "0px 0px 13px rgba(0, 0, 0, 0.25)",
  transition: "all 0.2s ease-in-out",

  "&:hover": {
    opacity: 1,
  },

  "&:disabled": {
    cursor: "not-allowed",
    opacity: 0.5,
  },
  "&:last-of-type": {
    marginTop: 15,
  },
});

const Right = styled("div", {
  flex: 1.25,
  padding: "10px 30px",
});

const BtnContainer = styled("div", {
  alignSelf: "flex-start",
  marginLeft: 10,
});

const Subtitle = styled("h1", {
  fontSize: "1.2em",
  margin: "20px 0",
  color: "",
});

const Container = styled("form", {
  maxWidth: "100%",
});

const Btn = styled("button", {
  border: "none",
  borderRadius: 5,
  marginTop: 5,
  padding: "10px 15px",
  fontSize: "0.9em",
  cursor: "pointer",
  opacity: 0.8,
  color: "$text-light",
  background: "$primary",
  boxShadow: "0px 0px 13px rgba(0, 0, 0, 0.25)",
  transition: "all 0.2s ease-in-out",

  "&:hover": {
    opacity: 1,
  },

  "&:disabled": {
    cursor: "not-allowed",
    opacity: 0.5,
  },
});

const Login = ({ dispatch }: ModalProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!username) {
      setLoading(false);
      return dispatch(
        addNotification({
          icon: <X />,
          message: "Please provide a username",
          type: "error",
        })
      );
    }

    if (username.length < 3) {
      setLoading(false);
      return dispatch(
        addNotification({
          icon: <X />,
          message: "Username must be 3 characters",
          type: "error",
        })
      );
    }

    if (!password) {
      setLoading(false);
      return dispatch(
        addNotification({
          icon: <X />,
          message: "Please provide a password",
          type: "error",
        })
      );
    }

    if (password.length < 8) {
      setLoading(false);
      return dispatch(
        addNotification({
          icon: <X />,
          message: "Password must be 8 characters",
          type: "error",
        })
      );
    }

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

    setError(null);

    window.location.reload();
  };

  return (
    <StyledWrapper>
      <Header />
      <FullContainer>
        <Left>
          <img
            src="/img/logo_transparent.png"
            width={90}
            height={80}
            draggable={false}
          />
          <br />
          <br />
          <BtnContainer>
            <LeftBtn onClick={() => dispatch(openModal("signup"))}>
              Don&apos;t have an account?
            </LeftBtn>
            <LeftBtn onClick={() => dispatch(openModal("signup"))}>
              Forgot password?
            </LeftBtn>
          </BtnContainer>
        </Left>
        <Right>
          <Subtitle>Welcome back!</Subtitle>
          <Container onSubmit={submit}>
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
            <Btn disabled={loading} type="submit">
              Login
            </Btn>
            <br />
            <br />
          </Container>
        </Right>
      </FullContainer>
    </StyledWrapper>
  );
};

export default Login;
