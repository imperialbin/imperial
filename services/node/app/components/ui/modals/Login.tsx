import { useAtom } from "jotai";
import { useState } from "react";
import { FaLock, FaUser } from "react-icons/fa";
import styled from "styled-components";
import { Input } from "..";
import { useUser } from "../../../hooks";
import { activeModal } from "../../../state/modal";
import { request } from "../../../utils";
import Image from "next/image";

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
  background: ${({ theme }) => theme.layoutDark};
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
  color: ${({ theme }) => theme.textLight};
  background: ${({ theme }) => theme.layoutDarkest};
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
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textLight};
`;

const Container = styled.form``;

const Error = styled.span`
  color: ${({ theme }) => theme.error};
  font-size: 1.2em;
`;

const Btn = styled.button`
  border: none;
  border-radius: 5px;
  margin-top: 8px;
  padding: 10px 15px;
  font-size: 0.9em;
  cursor: pointer;
  opacity: 0.8;
  color: ${({ theme }) => theme.textLight};
  background: ${({ theme }) => theme.layoutDark};
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

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const { mutate } = useUser();
  const [, setActiveModal] = useAtom(activeModal);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!username) {
      setLoading(false);
      return setError("You need to have a username");
    }

    if (!password) {
      setLoading(false);
      return setError("You need to have a password");
    }

    const { data, error } = await request("/auth/login", "POST", {
      username,
      password,
    });

    if (!data.success && error) {
      setLoading(false);
      return setError(data.message);
    }

    setError(null);
    setActiveModal([null, null]);
    mutate({});
  };

  return (
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
          <LeftBtn onClick={() => setActiveModal(["signup", null])}>
            Don&apos;t have an account?
          </LeftBtn>
          <LeftBtn onClick={() => setActiveModal(["resetPassword", null])}>
            Forgot password?
          </LeftBtn>
        </BtnContainer>
      </Left>
      <Right>
        <Subtitle>Welcome back!</Subtitle>
        {error && (
          <>
            <br />
            <Error>{error}</Error>
            <br />
          </>
        )}
        <Container onSubmit={submit}>
          <Input
            label="Email or username"
            icon={<FaUser />}
            iconClick={() => null}
            iconDisabled={true}
            placeholder="Enter your username or email"
            onChange={e => setUsername(e.target.value)}
          />
          <Input
            label="Password"
            icon={<FaLock />}
            iconClick={() => null}
            iconDisabled={true}
            placeholder="Enter your password"
            onChange={e => setPassword(e.target.value)}
            inputProps={{ required: true, type: "password" }}
          />
          <Btn disabled={loading} type="submit">
            Login
          </Btn>
          <br />
          <br />
        </Container>
      </Right>
    </FullContainer>
  );
};
