import { useAtom } from "jotai";
import { useState } from "react";
import { FaLock, FaMailBulk } from "react-icons/fa";
import styled from "styled-components";
import { Input } from "..";
import { useUser } from "../../hooks";
import { activeModal } from "../../state/modal";
import { request } from "../../utils";
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
`;

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<null | string>(null);
  const { mutate } = useUser();
  const [, setActiveModal] = useAtom(activeModal);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username) return setError("You need to have a username");
    if (!password) return setError("You need to have a password");

    const { data, error } = await request("/auth/login", "POST", {
      username,
      password,
    });

    if (!data.success && error) return setError(data.message);

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
      <Container onSubmit={submit}>
        <Input
          label="Email or username"
          icon={<FaMailBulk />}
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
        <Btn type="submit">Login</Btn>
      </Container>
    </>
  );
};
