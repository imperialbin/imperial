import Header from "./base/Header";
import { ModalProps } from "./base/modals";
import { LeftBtn, Wrapper } from "./base/Styles";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { styled } from "../../stitches";
import { Check as CheckIcon, Mail, User, Lock } from "react-feather";

import Input from "../Input";
import { makeRequest } from "../../utils/Rest";
import { openModal } from "../../state/actions";
import Button from "../Button";

const FullContainer = styled("div", {
  display: "inline-flex",
  height: "100%",
  width: "100%",
});

const Left = styled("div", {
  display: "flex",
  flexDirection: "column",
  flex: "0.8",
  alignItems: "center",
  justifyContent: "center",
  background: "$primary",
  boxShadow: "-1.7168px 6.86722px 36.0529px 8.58402px rgba(0, 0, 0, 0.25)",
  padding: "10px",
  borderBottomRightRadius: "12px",
  borderTopRightRadius: "12px",
});

const Right = styled("div", {
  flex: "1.25",
  padding: "10px 30px",
  overflow: "scroll",
});

const BtnContainer = styled("div", {
  alignSelf: "flex-start",
  marginLeft: "10px",
});

const Subtitle = styled("h1", {
  fontSize: "1.2em",
  margin: "20px 0",
  color: "$text-white",
});

const Error = styled("span", {
  color: "$error",
  fontSize: "1em",
});

const Span = styled("span", {
  display: "block",
  margin: "2px 0 15px 0",
  opacity: "0.6",
  color: "$text-muted",
  cursor: "pointer",
  transition: "opacity 0.2s ease-in-out",
  "&:hover": {
    opacity: 1,
  },
});

const SuccessContainer = styled(motion.div, {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  marginTop: "40px",
});

const Check = styled(CheckIcon, {
  color: "$success",
});

const SuccessTitle = styled("h1", {
  textAlign: "center",
  fontSize: "1.4em",
  fontWeight: "500",
  marginBottom: "0",
  color: "$text-muted",
});

const SuccessSpan = styled("span", {
  textAlign: "center",
  fontSize: "1.2em",
  fontWeight: 500,
  color: "$text-muted",
});

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

const Signup = ({ dispatch }: ModalProps) => {
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

    const { success, data, error } = await makeRequest("POST", "/auth/signup", {
      username,
      email,
      password,
    });

    if (!success && error) {
      setLoading(false);
      return setError(data.message);
    }

    // fetchMe();
    setError(null);
    setLoading(false);
    setSuccess(true);
  };

  return (
    <Wrapper>
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
            {!success ? (
              <LeftBtn onClick={() => dispatch(openModal("login"))}>
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
                <form onSubmit={submit}>
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
                  <Span onClick={() => dispatch(openModal("login"))}>
                    Already have an account?
                  </Span>
                  <Button disabled={loading} type="submit">
                    Signup
                  </Button>
                </form>
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
