import Header from "./base/Header";
import { ModalProps } from "./base/modals";
import { Content, Wrapper } from "./base/Styles";

import { styled } from "@web/stitches.config";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Check as CheckIcon, Lock, Mail, User, X } from "react-feather";

import Button from "@web/components/Button";
import { Logo } from "@web/components/Icons";
import Input from "@web/components/Input";
import { addNotification, openModal, setUser } from "@web/state/actions";
import { makeRequest } from "@web/utils/rest";
import { SelfUser } from "../../types";

import { setCookie } from "cookies-next";

const StyledWrapper = styled(Wrapper, {
  width: "80%",
  maxWidth: 600,
  maxHeight: 300,
});

const StyledContent = styled(Content, {
  flexDirection: "row",
  marginBottom: 0,
  height: "unset",
});

const FormContainer = styled("div", {
  width: "50%",
  gap: 10,
  display: "flex",
  flexDirection: "column",
});

const LogoContainer = styled("div", {
  position: "fixed",
  background: "$primary700",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: 300,
  width: 270,
  gap: 10,
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
  transition: {
    duration: 0.2,
  },
};

function Signup({ dispatch }: ModalProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const submit = async () => {
    if (!username) {
      return dispatch(
        addNotification({
          icon: <X />,
          message: "You need an username",
          type: "error",
        }),
      );
    }

    if (!email) {
      return dispatch(
        addNotification({
          icon: <X />,
          message: "You need an email",
          type: "error",
        }),
      );
    }

    if (!password) {
      return dispatch(
        addNotification({
          icon: <X />,
          message: "You need a password",
          type: "error",
        }),
      );
    }

    setLoading(true);
    const { data, success, error } = await makeRequest<{
      token: string;
      user: SelfUser;
    }>("POST", "/auth/signup", {
      username,
      email,
      password,
    });

    setLoading(false);

    if (!success || !data) {
      return dispatch(
        addNotification({
          icon: <X />,
          message: error?.message ?? "An error occurred whilst signing up",
          type: "error",
        }),
      );
    }

    dispatch(setUser(data.user));

    // Manually set cookie (the prod version would be set by the server)
    if (process.env.NODE_ENV !== "production") {
      setCookie("imperial-auth", data.token, {
        sameSite: "lax",
      });
    }

    setSuccess(true);
  };

  return (
    <StyledWrapper>
      <Header>Signup</Header>
      <StyledContent>
        <AnimatePresence>
          {!success ? (
            <>
              <FormContainer>
                <Input
                  required
                  label="Email"
                  icon={{ svg: <Mail /> }}
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  required
                  label="Username"
                  icon={{ svg: <User /> }}
                  placeholder="Enter your username"
                  type="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Input
                  required
                  label="Password"
                  icon={{ svg: <Lock /> }}
                  placeholder="Enter your password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                  clickOnEnter
                  style={{ alignSelf: "flex-start", marginTop: 15 }}
                  disabled={loading}
                  type="submit"
                  onClick={submit}
                >
                  Signup
                </Button>
              </FormContainer>
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: "45.5%",
                }}
              >
                <LogoContainer>
                  <Logo />
                  <Button onClick={() => dispatch(openModal("login"))}>
                    Have an account?
                  </Button>
                </LogoContainer>
              </div>
            </>
          ) : (
            <SuccessContainer
              transition={SUCCESS_ANIMATION.transition}
              initial={SUCCESS_ANIMATION.initial}
              animate={SUCCESS_ANIMATION.animate}
              exit={SUCCESS_ANIMATION.initial}
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
}

export default Signup;
