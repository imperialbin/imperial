import Image from "next/image";
import { useState } from "react";
import styled from "styled-components";
import { addNotification, closeModal, openModal } from "../../../state/actions";
import { Lock, User, X } from "react-feather";
import Input from "../Input";
import { request } from "../../utils/Request";
import Header from "./components/Header";
import { fetchMe } from "../../utils/FetchMe";
import { ModalProps } from "./components/modals";
import { Wrapper } from "./components/Styles";

const StyledWrapper = styled(Wrapper)`
  width: 80%;
  max-width: 650px;
  height: 50%;
  min-height: 200px;
  max-height: 325px;
`;

const FullContainer = styled.div`
  display: inline-flex;
  height: 100%;
  width: 100%;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0.8;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.background.dark};
  box-shadow: -1.7168px 6.86722px 36.0529px 8.58402px rgba(0, 0, 0, 0.25);
  padding: 10px;
  border-bottom-right-radius: 12px;
  border-top-right-radius: 12px;
`;

const LeftBtn = styled.button`
  border: none;
  border-radius: 5px;
  margin-top: 8px;
  padding: 10px 15px;
  font-size: 0.9em;
  cursor: pointer;
  opacity: 0.8;
  color: ${({ theme }) => theme.text.light};
  background: ${({ theme }) => theme.background.darkest};
  box-shadow: 0px 0px 13px rgba(0, 0, 0, 0.25);
  transition: all 0.2s ease-in-out;

  &:hover {
    opacity: 1;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  &:last-of-type {
    margin-top: 15px;
  }
`;

const Right = styled.div`
  flex: 1.25;
  padding: 10px 30px;
`;

const BtnContainer = styled.div`
  align-self: flex-start;
  margin-left: 10px;
`;

const Subtitle = styled.h1`
  font-size: 1.2em;
  margin: 20px 0;
  color: ${({ theme }) => theme.text.light};
`;

const Container = styled.form`
  max-width: 100%;
`;

const Error = styled.span`
  color: ${({ theme }) => theme.system.error};
  font-size: 1.2em;
`;

const Btn = styled.button`
  border: none;
  border-radius: 5px;
  margin-top: 5px;
  padding: 10px 15px;
  font-size: 0.9em;
  cursor: pointer;
  opacity: 0.8;
  color: ${({ theme }) => theme.text.light};
  background: ${({ theme }) => theme.background.dark};
  box-shadow: 0px 0px 13px rgba(0, 0, 0, 0.25);
  transition: all 0.2s ease-in-out;

  &:hover {
    opacity: 1;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

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
        }),
      );
    }

    if (username.length < 3) {
      setLoading(false);
      return dispatch(
        addNotification({
          icon: <X />,
          message: "Username must be 3 characters",
          type: "error",
        }),
      );
    }

    if (!password) {
      setLoading(false);
      return dispatch(
        addNotification({
          icon: <X />,
          message: "Please provide a password",
          type: "error",
        }),
      );
    }

    if (password.length < 8) {
      setLoading(false);
      return dispatch(
        addNotification({
          icon: <X />,
          message: "Password must be 8 characters",
          type: "error",
        }),
      );
    }

    const { success, error } = await request("POST", "/auth/login", {
      username,
      password,
    });

    setLoading(false);

    if (!success && error)
      return dispatch(
        addNotification({
          icon: <X />,
          message: error.message,
          type: "error",
        }),
      );

    setError(null);

    fetchMe();
    dispatch(closeModal());
  };

  return (
    <StyledWrapper>
      <Header />
      <FullContainer>
        <Left>
          <Image
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
              iconDisabled={true}
              placeholder="Enter your username or email"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input
              label="Password"
              icon={<Lock />}
              iconClick={() => null}
              iconDisabled={true}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              type="password"
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
