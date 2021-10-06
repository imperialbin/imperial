import { AnimatePresence, motion } from "framer-motion";
import { useAtom } from "jotai";
import { useState } from "react";
import { FaCheck, FaLock, FaMailBulk } from "react-icons/fa";
import styled from "styled-components";
import { Input } from "..";
import { useUser } from "../../../hooks";
import { activeModal } from "../../../state/modal";
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

const SuccessContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 40px;
`;

const Check = styled(FaCheck)`
  color: ${({ theme }) => theme.success};
`;

const SuccessTitle = styled.h1`
  text-align: center;
  font-size: 1.4em;
  font-weight: 500;
  margin-bottom: 0;
  color: ${({ theme }) => theme.textDarker};
`;

const SuccessSpan = styled.span`
  text-align: center;
  font-size: 1.2em;
  font-weight: 500;
  color: ${({ theme }) => theme.textDarker}8d;
`;

const showAnimation = {
  initial: {
    opacity: 0,
    transform: "scale(0.95)",
  },
  animate: {
    opacity: 1,
    transform: "scale(1)",
  },
};

export const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [, setActiveModal] = useAtom(activeModal);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { mutate } = useUser();

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

    if (!confirmPassword) {
      setLoading(false);
      return setError("You must confirm your password");
    }

    if (password !== confirmPassword) {
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

    setError(null);
    setLoading(false);
    setSuccess(true);
    mutate({});
  };

  return (
    <>
      <HeaderSecondary>Create an IMPERIAL account.</HeaderSecondary>
      <AnimatePresence>
        {!success ? (
          <>
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
                inputProps={{ required: true, type: "email" }}
              />
              <Input
                label="Username"
                icon={<FaMailBulk />}
                iconClick={() => null}
                iconDisabled={true}
                placeholder="Enter your username"
                onChange={e => setUsername(e.target.value)}
                inputProps={{ required: true, type: "username" }}
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
              <Input
                label="Confirm password"
                icon={<FaLock />}
                iconClick={() => null}
                iconDisabled={true}
                placeholder="Enter your password again"
                onChange={e => setConfirmPassword(e.target.value)}
                inputProps={{ required: true, type: "password" }}
              />
              <Span onClick={() => setActiveModal(["login", null])}>
                Already have an account?
              </Span>
              <Btn disabled={loading} type="submit">
                Signup
              </Btn>
            </Container>
          </>
        ) : (
          <SuccessContainer
            transition={{ duration: 0.25 }}
            variants={showAnimation}
            initial="initial"
            animate="animate"
            exit="initial"
          >
            <Check size={40} />
            <SuccessTitle>Successfully created your account!</SuccessTitle>
            <SuccessSpan>Make sure to check your email ({email})</SuccessSpan>
          </SuccessContainer>
        )}
      </AnimatePresence>
    </>
  );
};
