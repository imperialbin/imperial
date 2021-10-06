import { useAtom } from "jotai";
import { useState } from "react";
import { FaLock, FaUser } from "react-icons/fa";
import styled from "styled-components";
import { Input } from "..";
import { useUser } from "../../../hooks";
import { activeModal } from "../../../state/modal";
import { request } from "../../../utils";
import { HeaderSecondary } from "./styles";

const Container = styled.form``;

const Error = styled.span`
  color: ${({ theme }) => theme.error};
  font-size: 1.2em;
`;

const Btn = styled.button<{ backgroundColor?: string }>`
  border: none;
  border-radius: 5px;
  margin-top: 8px;
  padding: 10px 15px;
  font-size: 0.9em;
  cursor: pointer;
  opacity: 0.8;
  color: ${({ theme }) => theme.textLight};
  background: ${({ theme, backgroundColor }) =>
    backgroundColor || theme.layoutDark};
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

const Span = styled.span`
  display: block;
  margin: 2px 0 15px 0;
  opacity: 0.6;
  color: ${({ theme }) => theme.textDarker};
  cursor: pointer;
  transition: opacity 0.2s ease-in-out;

  &:hover {
    opacity: 1;
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
    <>
      <HeaderSecondary>Login to your IMPERIAL account.</HeaderSecondary>
      <br />
      {error && (
        <>
          <br />
          <Error>{error}</Error>
          <br />
        </>
      )}
      <br />
      {error && (
        <label>
          <span style={{ color: "coral" }}>Error:</span> {error}
        </label>
      )}
      <Container onSubmit={submit}>
        <Input
          label="Email or username"
          icon={<FaUser />}
          iconClick={() => null}
          iconDisabled={true}
          placeholder="Enter your username or email"
          onChange={e => setUsername(e.target.value)}
          inputProps={{ required: true, type: "email" }}
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
        <Span onClick={() => setActiveModal(["signup", null])}>
          Don&apos;t have an account?
        </Span>
        <Btn disabled={loading} type="submit">
          Login
        </Btn>
      </Container>
    </>
  );
};
