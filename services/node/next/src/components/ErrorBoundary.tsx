import React from "react";
import Button from "@/components/Button";
import { Logo } from "@/components/Icons";
import { styled } from "@/stitches.config";

const Container = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  width: "100vw",
  color: "$text-muted",

  "> svg": {
    position: "absolute",
    top: 35,
    left: 35,
    height: 80,
    width: 80,
  },
});

const Title = styled("h1", {
  fontWeight: "bolder",
  fontSize: "5.5em",
  fontFamily: "$mono",
  color: "$text-primary",
});

const Paragraph = styled("p", {
  fontSize: "1.5em",
  maxWidth: "45ch",
  textAlign: "center",
  fontFamily: "$mono",
  color: "$text-secondary",
  marginBottom: 20,
});

class ErrorBoundary extends React.Component<
  {
    children: React.ReactNode;
  },
  { error: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { error: false };
  }

  static getDerivedStateFromError() {
    return { error: true };
  }

  render() {
    if (this.state.error) {
      return (
        <Container>
          <Logo />
          <Title>Oops</Title>
          <Paragraph>
            You&apos;ve encountered a client error. No worries though!
            We&apos;ve sent the error to our developers.
          </Paragraph>
          <Button onClick={() => window.location.reload()}>Reload</Button>
          <span style={{ position: "absolute", bottom: 35 }}>© IMPERIAL</span>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
