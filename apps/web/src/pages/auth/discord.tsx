import { DiscordLogo, Logo } from "@web/components/Icons";
import { styled } from "@web/stitches.config";
import { makeRequest } from "@web/utils/rest";
import { useEffect, useState } from "react";
import {
  BrandContainer,
  CallbackWrapper,
  Paragraph,
  StyledX,
  Title,
} from "../../components/CallbackStyles";

const StyledDiscordLogo = styled(DiscordLogo, {
  color: "$text-secondary",
});

function Discord() {
  const [success, setSuccess] = useState<boolean | undefined>(undefined);
  const [message, setMessage] = useState(
    "We're linking your discord with your IMPERIAL account.",
  );

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");

    if (!code) {
      setMessage("Invalid Code");
      setSuccess(false);
      return;
    }

    const fetchCallback = async () => {
      const { success, error } = await makeRequest(
        "GET",
        `/oauth/discord/callback?code=${code}`,
      );

      if (!success) {
        setSuccess(false);
        return setMessage(
          error?.message ??
            "There was an error connecting your Discord account with your IMPERIAL account.",
        );
      }

      setSuccess(true);
      setMessage(
        "Successfully connected your Discord account with your IMPERIAL account. You can close this tab.",
      );
    };

    fetchCallback();
  }, []);

  return (
    <CallbackWrapper>
      <BrandContainer>
        <StyledDiscordLogo />
        <StyledX
          type={success === undefined ? "loading" : success ? "success" : "error"}
        />
        <Logo />
      </BrandContainer>
      <Title>
        {success === undefined
          ? "Connecting your Discord"
          : success
          ? "Connected!"
          : "Uh Oh"}
      </Title>
      <Paragraph>{message}</Paragraph>
    </CallbackWrapper>
  );
}

export default Discord;
