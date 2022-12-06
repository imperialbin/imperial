import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DiscordLogo, Logo } from "../../components/Icons";
import { useQuery } from "../../hooks/useQuery";
import { styled } from "../../stitches";
import { makeRequest } from "../../utils/Rest";
import {
  BrandContainer,
  CONTAINER_ANIMATION,
  ContentWrapper,
  LogoContainer,
  Paragraph,
  StyledX,
  Title,
  Wrapper,
} from "./base/Styles";

const StyledDiscordLogo = styled(DiscordLogo, {
  color: "$text-secondary",
});

const Discord = () => {
  const [paragraphText, setParagraphText] = useState(
    "We're linking your discord with your IMPERIAL account."
  );
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const query = useQuery();
  const navigate = useNavigate();

  useEffect(() => {
    const code = query.get("code");
    if (!code) return navigate("/");

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
