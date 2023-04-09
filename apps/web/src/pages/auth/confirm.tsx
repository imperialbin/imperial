import { useEffect, useState } from "react";
import { Mail } from "react-feather";
import { Logo } from "../../components/Icons";
import { makeRequest } from "../../utils/Rest";
import {
  BrandContainer,
  CONTAINER_ANIMATION,
  ContentWrapper,
  LogoContainer,
  Paragraph,
  Title,
  Wrapper,
} from "./github";

function Upgrade() {
  const [success, setSuccess] = useState<boolean | undefined>(undefined);
  const [message, setMessage] = useState("Hang tight, we're confirming your email now.");

  const confirm = async () => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      setSuccess(false);
      setMessage("No token was provided. Please try again.");
      return;
    }

    const { success, error } = await makeRequest("POST", "/auth/confirm", {
      token,
    });

    if (!success) {
      setSuccess(false);
      setMessage(error?.message ?? "An error occurred whilst confirming your email.");

      return;
    }

    setSuccess(true);
    setMessage("Nice! You can now close this tab and enjoy IMPERIAL's sweet features.");
  };

  useEffect(() => {
    confirm();
  }, []);

  return (
    <Wrapper>
      <LogoContainer>
        <Logo />
      </LogoContainer>
      <ContentWrapper
        animate={CONTAINER_ANIMATION.animate}
        initial={CONTAINER_ANIMATION.initial}
      >
        <BrandContainer>
          <Mail color="var(--text-secondary)" width={50} />
        </BrandContainer>
        <Title>
          {success === undefined
            ? "Confirming your email"
            : success
            ? "Confirmed your email"
            : "Oops..."}
        </Title>
        <Paragraph>{message}</Paragraph>
      </ContentWrapper>
    </Wrapper>
  );
}

export default Upgrade;
