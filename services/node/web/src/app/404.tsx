import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { Logo } from "../components/Icons";
import { styled } from "../stitches";

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
  const navigate = useNavigate();

  return (
    <Container>
      <Logo />
      <Title>404</Title>
      <Paragraph>Seems like you're lost</Paragraph>
      <Button onClick={() => navigate("/")}>Home</Button>
      <span style={{ position: "absolute", bottom: 35 }}>© IMPERIAL</span>
    </Container>
  );
};

export default FourOFour;
