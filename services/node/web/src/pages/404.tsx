import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import Button from "../components/Button";
import { ErrorBoundaryUI } from "../components/ErrorBoundary";

function FourOFour() {
  const router = useRouter();

  return (
    <>
      <NextSeo title="404 – Not Found" description="Seems like you're lost"/>
      <ErrorBoundaryUI
        title="404"
        message="Seems like you're lost"
        button={<Button onClick={() => router.push("/")}>Home</Button>}
      />
    </>
  );
}

export default FourOFour;
