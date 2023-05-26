import { styled } from "@web/stitches.config";
import Button from "@web/components/Button";

const Wrapper = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100vw",
  height: "100vh",
  background: "url('/img/texture.png')",
  backgroundSize: "500px",
});

const Container = styled("div", {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  maxWidth: 600,
  padding: "$large",
  background: "$primary",
  border: "1px solid $contrast",
  borderRadius: "$large",
  color: "$text-primary",
  gap: 10,

  "> div > p": {
    marginBottom: 10,
    color: "$text-secondary",
  },
});

const StyledButton = styled(Button, {
  alignSelf: "flex-end",
});

export { Wrapper, Container, StyledButton };
