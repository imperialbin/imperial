import { GitHubLogo, Logo } from "@web/components/Icons";
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

const StyledGitHubLogo = styled(GitHubLogo, {
  color: "$text-secondary",
});

function GitHub() {
  const [success, setSuccess] = useState<boolean | undefined>(undefined);
  const [message, setMessage] = useState(
    "We're linking your GitHub with your IMPERIAL account.",
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
        `/oauth/github/callback?code=${code}`,
      );

      if (!success) {
        setSuccess(false);
        return setMessage(
          error?.message ??
            "There was an error connecting your GitHub account with your IMPERIAL account.",
        );
      }

      setSuccess(true);
      setMessage(
        "Successfully connected your GitHub account with your IMPERIAL account. You can close this tab.",
      );
    };

    fetchCallback();
  }, []);

  return (
    <CallbackWrapper>
      <BrandContainer>
        <StyledGitHubLogo />
        <StyledX
          type={success === undefined ? "loading" : success ? "success" : "error"}
        />
        <Logo />
      </BrandContainer>
      <Title>
        {success === undefined
          ? "Connecting your GitHub"
          : success
          ? "Connected!"
          : "Uh Oh"}
      </Title>
      <Paragraph>{message}</Paragraph>
    </CallbackWrapper>
  );
}

export default GitHub;
