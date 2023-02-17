import Button from "../components/Button";
import { Logo } from "../components/Icons";
import { styled } from "@/stitches.config";
import { useRouter } from "next/router";

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
  fontFamily: "$mono",
  color: "$text-secondary",
  marginBottom: 20,
});

const FourOFour = () => {
  const router = useRouter();

  return (
    <Container>
      <Logo />
      <Title>404</Title>
      <Paragraph>Seems like you&apos;re lost</Paragraph>
      <Button onClick={() => router.push("/")}>Home</Button>
      <span style={{ position: "absolute", bottom: 35 }}>© IMPERIAL</span>
    </Container>
  );
};

export default FourOFour;
