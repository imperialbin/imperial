import { styled } from "@/stitches.config";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import Button from "../components/Button";
import { ErrorBoundaryUI } from "../components/ErrorBoundary";

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
    <>
      <NextSeo title="404 – Not Found" description="Seems like you're lost" />
      <ErrorBoundaryUI
        title="404"
        message="Seems like you're lost"
        button={<Button onClick={() => router.push("/")}>Home</Button>}
      />
    </>
  );
};

export default FourOFour;
