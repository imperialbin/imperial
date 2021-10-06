import { useState } from "react";
import { FaLock, FaMailBulk } from "react-icons/fa";
import styled from "styled-components";
import { Input } from "..";
import { HeaderSecondary } from "./styles";
import { request } from "../../../utils";

const Container = styled.form``;

const Error = styled.span`
  color: ${({ theme }) => theme.error};
  font-size: 1em;
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

export const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!username) {
      setLoading(false);
      return setError("You need to have a username");
    }

    if (!email) {
      setLoading(false);
      return setError("You need to have a email");
    }

    if (!password) {
      setLoading(false);
      return setError("You need to have a password");
    }

    if (confirmPassword !== password) {
      setLoading(false);
      return setError("Passwords do not match");
    }

    const { data, error } = await request("/auth/signup", "POST", {
      username,
      email,
      password,
      confirmPassword,
    });

    if (!data.success && error) {
      setLoading(false);
      return setError(data.message);
    }
  };

  return (
    <>
      <HeaderSecondary>Create an IMPERIAL account.</HeaderSecondary>
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
          label="Email"
          icon={<FaMailBulk />}
          iconClick={() => null}
          iconDisabled={true}
          placeholder="Enter your email"
          onChange={e => setEmail(e.target.value)}
        />
        <Input
          label="Username"
          icon={<FaMailBulk />}
          iconClick={() => null}
          iconDisabled={true}
          placeholder="Enter your username"
          onChange={e => setUsername(e.target.value)}
        />
        <Input
          label="Password"
          icon={<FaLock />}
          iconClick={() => null}
          iconDisabled={true}
          placeholder="Enter your password"
          onChange={e => setPassword(e.target.value)}
        />
        <Input
          label="Confirm password"
          icon={<FaLock />}
          iconClick={() => null}
          iconDisabled={true}
          placeholder="Enter your password again"
          onChange={e => setConfirmPassword(e.target.value)}
        />
        <Btn disabled={loading} type="submit">
          Signup
        </Btn>
      </Container>
    </>
  );
};
