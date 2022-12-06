import { motion, Variants } from "framer-motion";
import { X } from "react-feather";
import { DiscordLogo } from "../../../components/Icons";
import { styled } from "../../../stitches";

export const Wrapper = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100vh",
});

export const LogoContainer = styled("div", {
  position: "absolute",
  top: 25,
  left: 25,

  svg: {
    height: 55,
  },
});

export const BrandContainer = styled("div", {
  display: "flex",
  margin: "20px 0",

  "& > svg": {
    height: 50,
  },
});

export const ContentWrapper = styled(motion.div, {
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

export const Title = styled("h1", {
  fontSize: "2em",
  color: "$text-primary",
});

export const Paragraph = styled("p", {
  fontSize: "1em",
  maxWidth: "40ch",
  marginBottom: 15,
  color: "$text-secondary",
});

export const StyledX = styled(X, {
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

export const CONTAINER_ANIMATION = {
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
