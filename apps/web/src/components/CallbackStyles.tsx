import { X } from "react-feather";
import { styled } from "../stitches.config";
import { PropsWithChildren } from "react";
import { Logo } from "./Icons";
import { motion } from "framer-motion";

const Wrapper = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100vh",
});

const LogoContainer = styled("div", {
  position: "absolute",
  top: 25,
  left: 25,

  svg: {
    height: 55,
  },
});

const BrandContainer = styled("div", {
  display: "flex",
  margin: "20px 0",

  "& > svg": {
    height: 50,
  },
});

const ContentWrapper = styled(motion.div, {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "$large",
  borderRadius: 10,
  textAlign: "center",
  maxWidth: 500,
  gap: 10,
  width: "90%",
  background: "$primary",
  boxShadow: "-1px 6px 36px 8px rgba(0, 0, 0, 0.25)",
});

const Title = styled("h1", {
  fontSize: "2em",
  color: "$text-primary",
});

const Paragraph = styled("p", {
  fontSize: "1em",
  maxWidth: "40ch",
  marginBottom: 15,
  color: "$text-secondary",
});

const StyledX = styled(X, {
  color: "$text-muted",
  transition: "color 0.15s ease-in-out",
  margin: "0 25px",

  variants: {
    type: {
      loading: {
        color: "$text-muted",
      },
      error: {
        color: "$error",
      },
      success: {
        color: "$success",
      },
    },
  },
});

const CONTAINER_ANIMATION = {
  animate: {
    y: 0,
    opacity: 1,
    scale: 1,
  },
  initial: {
    y: 10,
    opacity: 0.8,
    scale: 0.95,
  },
};

function CallbackWrapper({ children }: PropsWithChildren) {
  return (
    <Wrapper>
      <LogoContainer>
        <Logo />
      </LogoContainer>
      <ContentWrapper
        animate={CONTAINER_ANIMATION.animate}
        initial={CONTAINER_ANIMATION.initial}
      >
        {children}
      </ContentWrapper>
    </Wrapper>
  );
}

export {
  Wrapper,
  LogoContainer,
  BrandContainer,
  ContentWrapper,
  Title,
  Paragraph,
  StyledX,
  CONTAINER_ANIMATION,
  CallbackWrapper,
};
