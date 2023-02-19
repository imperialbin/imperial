import { useEffect, useState } from "react";
import { DiscordLogo, Logo } from "@/components/Icons";
import { styled } from "@/stitches.config";
import { makeRequest } from "@/utils/Rest";
import {
  BrandContainer,
  CONTAINER_ANIMATION,
  ContentWrapper,
  LogoContainer,
  Paragraph,
  StyledX,
  Title,
  Wrapper,
} from "./github";
import { useRouter } from "next/router";

const StyledDiscordLogo = styled(DiscordLogo, {
  color: "$text-secondary",
});

const Discord = () => {
  const [paragraphText, setParagraphText] = useState(
    "We're linking your discord with your IMPERIAL account."
  );
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");

    if (!code) {
      router.push("/");
      return;
    }

    const fetchCallback = async () => {
      const { success } = await makeRequest(
        "GET",
        `/oauth/discord/callback?code=${code}`
      );

      if (!success) {
        setError(true);
        return setParagraphText(
          "There was an error connecting your Discord account with your IMPERIAL account."
        );
      }

      setError(false);
      setSuccess(true);
      setParagraphText(
        "Successfully connected your Discord account with your IMPERIAL account. You can close this tab."
      );
    };

    fetchCallback();
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
          <StyledDiscordLogo />
          <StyledX type={error ? "error" : success ? "success" : "loading"} />
          <Logo />
        </BrandContainer>
        <Title>Connecting your Discord</Title>
        <Paragraph>{paragraphText}</Paragraph>
      </ContentWrapper>
    </Wrapper>
  );
};

export default Discord;
