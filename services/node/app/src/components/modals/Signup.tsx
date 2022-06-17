import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import { Check as CheckIcon, Mail, User, Lock } from "react-feather";
import { request } from "../../utils/Request";
import { store } from "../../../state";
import { openModal } from "../../../state/actions";
import Input from "../Input";
import Header from "./components/Header";
import { fetchMe } from "../../utils/FetchMe";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 80%;
  max-width: 650px;
  min-height: 200px;
  height: 50%;
  border-radius: 12px;
  max-height: 325px;
  overflow: hidden;
  background: ${({ theme }) => theme.background.lightestOfTheBunch};
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
  max-height: 300px;
  padding: 10px 30px;
  overflow: scroll;
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

const Container = styled.form``;

const Error = styled.span`
  color: ${({ theme }) => theme.system.error};
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
  color: ${({ theme }) => theme.text.light};
  background: ${({ theme, backgroundColor }) =>
    backgroundColor || theme.background.dark};
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
  color: ${({ theme }) => theme.text.dark};
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

const Check = styled(CheckIcon)`
  color: ${({ theme }) => theme.system.success};
`;

const SuccessTitle = styled.h1`
  text-align: center;
  font-size: 1.4em;
  font-weight: 500;
  margin-bottom: 0;
  color: ${({ theme }) => theme.text.dark};
`;

const SuccessSpan = styled.span`
  text-align: center;
  font-size: 1.2em;
  font-weight: 500;
  color: ${({ theme }) => theme.text.dark}8d;
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

const Signup = (): JSX.Element => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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

    const { success, data, error } = await request("POST", "/auth/signup", {
      username,
      email,
      password,
      confirmPassword,
    });

    if (!success && error) {
      setLoading(false);
      return setError(data.message);
    }

    fetchMe();
    setError(null);
    setLoading(false);
    setSuccess(true);
  };

  return (
    <Wrapper>
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
            {!success ? (
              <LeftBtn onClick={() => store.dispatch(openModal("login"))}>
                Already have an account?
              </LeftBtn>
            ) : null}
          </BtnContainer>
        </Left>
        <Right>
          <AnimatePresence>
            {!success ? (
              <>
                <Subtitle>Welcome aboard!</Subtitle>
                {error ? (
                  <>
                    <br />
                    <Error>{error}</Error>
                    <br />
                  </>
                ) : null}
                <Container onSubmit={submit}>
                  <Input
                    label="Email"
                    icon={<Mail />}
                    iconClick={() => null}
                    iconDisabled={true}
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                  />
                  <Input
                    label="Username"
                    icon={<User />}
                    iconClick={() => null}
                    iconDisabled={true}
                    placeholder="Enter your username"
                    onChange={(e) => setUsername(e.target.value)}
                    type="username"
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
                  <Input
                    label="Confirm password"
                    icon={<Lock />}
                    iconClick={() => null}
                    iconDisabled={true}
                    placeholder="Enter your password again"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type="password"
                    required
                  />
                  <Span onClick={() => store.dispatch(openModal("login"))}>
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
                <SuccessSpan>
                  Make sure to check your email ({email})
                </SuccessSpan>
              </SuccessContainer>
            )}
          </AnimatePresence>
        </Right>
      </FullContainer>
    </Wrapper>
  );
};

export default Signup;
