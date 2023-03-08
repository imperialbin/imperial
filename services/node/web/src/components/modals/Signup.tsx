import Header from "./base/Header";
import { ModalProps } from "./base/modals";
import { Content, Wrapper } from "./base/Styles";

import { styled } from "@/stitches.config";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Check as CheckIcon, Lock, Mail, User, X } from "react-feather";

import Button from "@/components/Button";
import { Logo } from "@/components/Icons";
import Input from "@/components/Input";
import { addNotification, openModal } from "@/state/actions";
import { makeRequest } from "@/utils/Rest";

const StyledWrapper = styled(Wrapper, {
  width: "80%",
  maxWidth: 600,
  maxHeight: 300,
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

const SuccessContainer = styled(motion.div, {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  width: "100%",
  minHeight: 150,

  "> svg": {
    color: "$success",
  },

  "> h1": {
    textAlign: "center",
    fontSize: "1.4em",
    marginBottom: "0",
    color: "$text-primary",
  },

  "> span": {
    textAlign: "center",
    fontSize: "1em",
    fontWeight: 500,
    color: "$text-secondary",
  },
});

const SUCCESS_ANIMATION = {
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
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const submit = async () => {
    if (!username) {
      return dispatch(
        addNotification({
          icon: <X />,
          message: "You need an username",
          type: "error",
        })
      );
    }

    if (!email) {
      return dispatch(
        addNotification({
          icon: <X />,
          message: "You need an email",
          type: "error",
        })
      );
    }

    if (!password) {
      return dispatch(
        addNotification({
          icon: <X />,
          message: "You need a password",
          type: "error",
        })
      );
    }

    if (!confirmPassword) {
      return dispatch(
        addNotification({
          icon: <X />,
          message: "You need to confirm your password",
          type: "error",
        })
      );
    }

    if (password !== confirmPassword) {
      return dispatch(
        addNotification({
          icon: <X />,
          message: "Passwords do not match",
          type: "error",
        })
      );
    }

    setLoading(true);
    const { success, data, error } = await makeRequest("POST", "/auth/signup", {
      username,
      email,
      password,
    });

    setLoading(false);

    if (!success) {
      return dispatch(
        addNotification({
          icon: <X />,
          message: error?.message ?? "An error occurred whilst signing up",
          type: "error",
        })
      );
    }

    // fetchMe();
    setSuccess(true);
  };

  return (
    <StyledWrapper>
      <Header>Signup</Header>
      <StyledContent>
        <AnimatePresence>
          {!success ? (
            <>
              <div
                style={{
                  width: "50%",
                  gap: 10,
                  display: "flex",
                  flexDirection: "column",
                  height: "auto",
                }}
              >
                <Input
                  label="Email"
                  icon={<Mail />}
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  iconDisabled
                  required
                />
                <Input
                  label="Username"
                  icon={<User />}
                  placeholder="Enter your username"
                  onChange={(e) => setUsername(e.target.value)}
                  type="username"
                  iconDisabled
                  required
                />
                <Input
                  label="Password"
                  icon={<Lock />}
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  iconDisabled
                  required
                />
                <Input
                  label="Confirm password"
                  icon={<Lock />}
                  placeholder="Enter your password again"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  iconDisabled
                  required
                />
                <Button
                  style={{ alignSelf: "flex-start", marginTop: 15 }}
                  disabled={loading}
                  type="submit"
                  onClick={submit}
                  clickOnEnter
                >
                  Signup
                </Button>
              </div>
              <LogoContainer>
                <Logo />
                <Button onClick={() => dispatch(openModal("login"))}>
                  Have an account?
                </Button>
              </LogoContainer>
            </>
          ) : (
            <SuccessContainer
              transition={{ duration: 0.25 }}
              variants={SUCCESS_ANIMATION}
              initial="initial"
              animate="animate"
              exit="initial"
            >
              <CheckIcon size={40} />
              <h1>Successfully created your account!</h1>
              <span>Make sure to check your email ({email})</span>
            </SuccessContainer>
          )}
        </AnimatePresence>
      </StyledContent>
    </StyledWrapper>
  );
};

export default Signup;
